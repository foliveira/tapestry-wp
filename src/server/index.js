import { Server } from 'hapi'
import h2o2 from 'h2o2'
import Inert from 'inert'

import { success, error } from '../utilities/logger'
import handleStatic from './handle-static'
import handleApi from './handle-api'
import handleDynamic from './handle-dynamic'
import handleProxies from './handle-proxies'
import handleRedirects from './handle-redirects'
import CacheManager from '../utilities/cache-manager'

export default class Tapestry {

  constructor ({ config, assets = {} }, { silent } = {}) {

    // allow access from class
    this.config = config
    this.silent = silent

    // create server instance
    this.server = this.bootServer()

    // Important bit:
    this.server.ext('onPreResponse', (request, reply) => {
      request.response.headers &&
        (request.response.headers['X-Powered-By'] = 'Tapestry')
      reply.continue()
    })

    // register reset-cache event
    this.server.event('reset-cache')
    // Clear all caches on reset-cache event
    this.server.on('reset-cache', CacheManager.clearAll)

    // handle server routing
    const data = {
      server: this.server,
      config: this.config,
      assets
    }
    handleRedirects(data)
    handleStatic(data)
    handleProxies(data)
    handleApi(data)
    handleDynamic(data)

    // kick off server
    this.startServer()
  }

  bootServer () {
    // create new Hapi server and register required plugins
    const server = new Server()
    server.register([h2o2, Inert])
    server.connection({
      host: this.config.host || '0.0.0.0',
      port: this.config.port || process.env.PORT || 3030
    })
    this.config.serverUri = server.info.uri
    return server
  }
  startServer () {
    // run server
    this.server.start(err => {
      if (err)
        error(err)
      if (!this.silent)
        success(`Server ready: ${this.server.info.uri}`)
    })
  }
}
