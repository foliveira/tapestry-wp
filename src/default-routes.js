import React, { PropTypes } from 'react'
import { Route } from 'react-router'
import CategoriesLoader from './loader-categories'
import PostLoader from './loader-post'
import PageLoader from './loader-page'
import FrontPageLoader from './loader-front-page'

const DefaultRoutes = ({ Category, Post, Page, FrontPage, Error }) =>
  <div>
    <Route
      path='/'
      component={FrontPageLoader}
      tag={FrontPage}
      fallback={Error} />
    <Route
      path='about/:slug'
      component={PageLoader}
      tag={Page}
      fallback={Error} />
    <Route
      path=':category(/:subcategory)'
      component={CategoriesLoader}
      tag={Category}
      fallback={Error} />
    <Route
      path=':category(/:subcategory)/:slug/:id'
      component={PostLoader}
      tag={Post}
      fallback={Error} />
  </div>

DefaultRoutes.propTypes = {
  Category: PropTypes.element,
  FrontPage: PropTypes.element,
  Page: PropTypes.element,
  Post: PropTypes.element,
  Error: PropTypes.element
}

export default DefaultRoutes
