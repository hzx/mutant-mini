
// routes: [
//  { ?path: string, component, ?name: string }
// ]
// path, name are optional
// special named routes without path
// path supports url templates with parameters,
// example:
// /api/companies/{companyId}
// call handler with params = { companyId }
class Router {
  constructor(routes) {
    this.routes = routes
    this.notFoundRoute = null
    this.currentRoute = null
    this.currentParams = null
    this.eventRoute = new Observable()
    // url (0), scheme (1), slash (2), host (3), port (4), path (5), query (6), // hash (7)
    this.parseUrlRegex = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/
  }

  enter() {
    window.addEventListener('popstate', this.onWindowUrlChange, false)
  }

  exit() {
    window.removeEventListener('popstate', this.onWindowUrlChange, false)
  }

  init() {
    this.parsedRoutes = this.routes.map(route => {
      if (!route.path) return route
      const slugs = this.parseSlugs(route.path)
      const params = this.slugsToParams(slugs)
      return {
        ...route,
        slugs,
        params
      }
    })

    this.routeCurrentUrl()
  }

  route(url) {
    const address = this.parseUrlPath(url)
    const path = address[5]
    const slugs = this.parseSlugs(path)
    const route = this.findRoute(slugs) || this.notFoundRoute
    const params = this.parseValueParams(route.params, slugs)
    if (route) {
      this.changeWindowUrlPath(path)
      this.eventRoute.notify({route, params})
    }
    // TODO not found
  }

  routeByName(name, params) {
    const route = this.findRouteByName(name)
    if (route) {
      const path = this.applyPathParams(route, params)
      this.changeWindowUrlPath(path)
      this.eventRoute.notify({route, params})
    }
    // TODO not found
  }

  routeCurrentUrl() {
    const url = window.location
    this.route(url)
  }

  parseSlugs(path) {
    const slugs = path.split('/')
    if (slugs.length === 0) return []
    if (slugs[0].length === 0) slugs.splice(0, 1)
    return slugs
  }

  slugsToParams(slugs) {
    return slugs.map(slug => slug.length > 0 &&
      slug[0] === '{' && slug[slug.length - 1] === '}'
      ? slug.substring(1, slug.length - 1) : null)
  }

  parseValueParams(routeParams, slugs) {
    const params = {}
    slugs.forEach((slug, r) => {
      const routeParam = routeParams[r]
      if (routeParam) params[routeParam] = slugs[r]
    })
    return params
  }

  applyPathParams(route, params) {
    const slugs = new Array(route.slugs.length)
    this.route.slugs.forEach((slug, i) => {
      slugs[i] = route.params[i] ? params[route.params[i]] : slug
    })
    return slugs.length ? `/${slugs.join('/')}` : ''
  }

  parseUrlPath(url) {
    // parse path
    const address = this.parseUrlRegex.exec(url)
    this.parseUrlRegex.lastIndex = 0
    return address
  }

  findRoute(slugs) {
    return this.parsedRoutes.find(route => route.slugs.length === slugs.length &&
        route.slugs.every((slug, i) => route.params[i] !== null ? true : slug === slugs[i]))
  }

  findRouteByName(name) {
    return this.parsedRoutes.find(route => route.name === name)
  }

  changeWindowUrlPath(path) {
    // params, title, urlPath
    window.history.pushState({}, '', path)
  }

  onWindowUrlChange = () => {
    this.routeCurrentUrl()
  }
}
