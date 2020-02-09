import axios from 'axios'
import { parseUrl } from '../utils'

export default {
    name: 'main-mixin',
    data: () => ({}),
    computed: {
      pageUrl() { return this.$store.getters.pages[this.$options.name] },
      html() { return this.$store.getters.html }
    },
    mounted() {
      const loc = parseUrl(this.pageUrl)
      let pageType
      if (loc.pathname.slice(loc.pathname.length - 3) === '.md') {
        pageType = 'markdown'
      } else {
        if (loc.pathname.indexOf('/wiki/') === 0 || loc.pathname.indexOf('/w/')) {
          pageType = 'mediawiki'
        }
      }
      console.log(`Page ${this.$options.name}: type=${pageType} url=${this.pageUrl}`)
      if (pageType === 'markdown') {
        return this.getMarkdown(this.pageUrl)
        .then((html) => {
          this.$store.dispatch('setHtml', html)
          this.$nextTick(() => { this.updateLinks() })
        })
    } else if (pageType === 'mediawiki') {
        return this.getWikitext(loc.hostname, this.pageUrl.split('/').slice(4).join('/'))
          .then((html) => {
            this.$store.dispatch('setHtml', html)
            this.$nextTick(() => {
              this.cleanWikitext()
              this.updateLinks()
            })
          })
      }
    },
    methods: {
      getMarkdown(url) {
        return axios.get(url).then(resp => this.$marked(resp.data))
      },
      getWikitext(site, title) {
        return axios.get(`https://${site}/w/api.php?action=parse&format=json&page=${encodeURIComponent(title)}`)
          .then(resp => resp.data.parse ? resp.data.parse.text['*'] : '')
      },
      updateLinks() {
        if (this.$refs[this.$options.name]) {
          const host = window.location.host
          this.$refs[this.$options.name].querySelectorAll('a').forEach((link) => {
            if (link.href) {
              let src = link.href
              const parsedUrl = parseUrl(link.href)
              if (parsedUrl.host === host) {
                src = `${process.env.app_md_endpoint}${path}`
              }
              link.removeAttribute('href')
              link.addEventListener('click', (e) => {
                e.preventDefault()
                // const path = parsedUrl.pathname.replace(/^\/visual-essays/, '') // needed for GH Pages
                this.$router.push({path: '/essay', query: { src }})
              })
            }
          })
        }
      },
      cleanWikitext() {
        if (this.$refs[this.$options.name]) {
          this.$refs[this.$options.name].querySelectorAll('.mw-editsection').forEach(function (a) {
            a.remove()
          })
        }
      },
    }
  }
  