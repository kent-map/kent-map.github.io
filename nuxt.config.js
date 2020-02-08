import colors from 'vuetify/es5/util/colors'
import fs from 'fs'
import YAML from 'yaml'

const SETTINGS = YAML.parse(fs.readFileSync('./settings.yaml', 'utf8'))

const routerBase = {
  'GH_PAGES': { router: { base: '/' } }
}[process.env.DEPLOY_ENV] || { router: { base: '/' } }

export default {
  env: { ...SETTINGS,
    deployEnv: process.env.DEPLOY_ENV || 'PROD',
    ve_service_endpoint: (process.env.DEPLOY_ENV || 'PROD') === 'DEV'
      ? 'http://localhost:5000'
      : 'https://us-central1-visual-essay.cloudfunctions.net',
    app_md_endpoint: (process.env.DEPLOY_ENV || 'DEV') === 'DEV'
      // ? 'http://localhost:8080/docs'
      ? `${SETTINGS.gh_path}/docs`
      : `${SETTINGS.gh_path}/docs`

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
          : `https://jstor-labs.github.io/visual-essays/lib/visual-essays-${SETTINGS.visual_essays_version}.min.js` }
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