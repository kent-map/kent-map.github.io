export default ({ app }, inject) => {
  
  app.store.dispatch('setMwSite', process.env.mw_site )
  app.store.dispatch('setPage', {'index': process.env.index} )
  app.store.dispatch('setPage', {'about': process.env.about} )
  app.store.dispatch('setPage', {'help': process.env.help} )
  app.store.dispatch('setPage', {'contact': process.env.contact} )
}