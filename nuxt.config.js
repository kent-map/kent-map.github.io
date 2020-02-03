import colors from 'vuetify/es5/util/colors'

const routerBase = {
  'GH_PAGES': { router: { base: '/kent-maps/' } }
}[process.env.DEPLOY_ENV] || { router: { base: '/' } }

// const BUNDLE_VERSION = require('./package.json').version
const BUNDLE_VERSION = '0.2.5'

export default {
  // ...routerBase,
  mode: 'spa',
  env: {
    deployEnv: process.env.DEPLOY_ENV || 'PROD'
  },
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    script: [
        // { src: 'https://unpkg.com/leaflet@1.6.0/dist/leaflet.js' },
        { src: process.env.DEPLOY_ENV === 'DEV' ? 'http://localhost:8081/js/index.js' : `https://visual-essays.online/lib/visual-essay-${BUNDLE_VERSION}.min.js` }
      ],
    link: [
      // { rel: 'stylesheet', href: 'https://unpkg.com/leaflet@1.6.0/dist/leaflet.css' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '@/plugins/detect-environment.js', ssr: false },
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/vuetify',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  },
  generate: {
    dir: 'dist',
    fallback: true,
  }
}
