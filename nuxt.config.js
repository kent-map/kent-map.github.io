import colors from 'vuetify/es5/util/colors'
import fs from 'fs'
import YAML from 'yaml'

const SETTINGS = YAML.parse(fs.readFileSync('./settings.yaml', 'utf8'))

const BUNDLE_VERSION = require('./package.json').version

const routerBase = {
  'GH_PAGES': { router: { base: ghPagesPath(SETTINGS.gh_path) } }
}[process.env.DEPLOY_ENV] || { router: { base: '/' } }

export default {
  env: { ...SETTINGS,
    deployEnv: process.env.DEPLOY_ENV || 'PROD',
    bundle_version: BUNDLE_VERSION,
    ve_service_endpoint: (process.env.DEPLOY_ENV || 'DEV') === 'DEV'
      ? 'http://localhost:5000'
      : 'https://us-central1-visual-essay.cloudfunctions.net',
    app_md_endpoint: (process.env.DEPLOY_ENV || 'DEV') === 'DEV'
      ? 'http://localhost:8080'
      : SETTINGS.gh_path,

  },
  ...routerBase,
  mode: 'spa',
  head: {
    title: SETTINGS.site_title,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    script: [
        { src: process.env.DEPLOY_ENV === 'DEV'
          ? 'http://localhost:8080/lib/visual-essays.js'
          : `https://visual-essays.online/lib/visual-essay-${BUNDLE_VERSION}.min.js` }
      ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  plugins: [
    { src: '@/plugins/detect-environment.js', ssr: false },
    { src: '@/plugins/marked.js', ssr: false }
  ],
  buildModules: [
    '@nuxtjs/vuetify',
  ],
  modules: [
    '@nuxtjs/axios',
  ],
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
  generate: {
    dir: 'dist',
    fallback: true,
  }
}

function ghPagesPath(path) {
  const elems = path.split('/')
  return `/${elems[elems.length-1]}/`
}