import axios from 'axios'
import { parseUrl } from '../utils'

export default {
    name: 'main-mixin',
    data: () => ({}),
    computed: {
      pageUrl() { return this.$store.getters.pages[this.$options.name] },
      html() { return this.$store.getters.html },
      mwSite() { return this.$store.getters.mwSite }
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
          this.$refs[this.$options.name].querySelectorAll('a').forEach((link) => {
            if (link.href) {
              const parsedUrl = parseUrl(link.href)
              console.log(`parsedUrl.origin=${parsedUrl.origin} mwSite=${this.mwSite} window.location.hostname=${window.location.hostname}`)
              if ((parsedUrl.origin === this.mwSite || window.location.origin === parsedUrl.origin || window.location.hostname === 'localhost') &&
                  parsedUrl.pathname.slice(0, 6) === '/wiki/' &&
                  parsedUrl.pathname.slice(6, 11) !== 'File:' &&
                  link.href.indexOf('#') === -1) {
                const essayTitle = parsedUrl.pathname.slice(6)
                link.removeAttribute('href')
                link.addEventListener('click', (e) => {
                  this.$router.push(`/essay/${essayTitle}`)
                })
              }
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
  