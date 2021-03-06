
import fetch from 'isomorphic-fetch'
import CacheManager from '../utilities/cache-manager'

export default ({ server, config }) => {

  // Create a new cache | 100 requests only, expire after 2 minutes
  const cache = CacheManager.createCache('api')

  server.route({
    method: 'GET',
    path: '/api/v1/{query*}',
    handler: (req, reply) => {
      const remote = `${config.siteUrl}/wp-json/wp/v2/${req.params.query}${req.url.search}`
      // Look for a cached response - maybe undefined
      const cacheResponse = cache.get(remote)
      // If we find a response in the cache send it back
      if (cacheResponse) {
        reply(cacheResponse)
      } else {
        fetch(remote)
          .then(response => response.json())
          .then(resp => {
            // We can only get here if there's nothing cached
            // Put the response into the cache using the request path as a key
            cache.set(remote, resp)
            reply(resp)
          })
      }
    }
  })
}
