export default ({ app }, inject) => {
  
  app.store.dispatch('setPage', {'index': process.env.index} )
  app.store.dispatch('setPage', {'about': process.env.about} )
  app.store.dispatch('setPage', {'help': process.env.help} )
  app.store.dispatch('setPage', {'contact': process.env.contact} )
  console.log('pages', app.store.getters.pages)
}