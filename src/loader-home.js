import React, { Component } from 'react'
import AsyncProps from 'async-props'
import fetch from 'isomorphic-fetch'

export default class Loader extends Component {

  static loadProps({params, loadContext}, cb) {
    // LoadContext is basicaly an object we can pass around
    // the sever with our components and some baseUrl on it
    return fetch(`${loadContext.siteUrl}/wp-json/wp/v2/posts`)
      .then(response => response.json())
      .then(data => cb(null, { data }))
      .catch(error => cb(error))
  }

  render () {
    const Home = this.props.route.home
    return <Home {...this.props.data} />
  }
}
