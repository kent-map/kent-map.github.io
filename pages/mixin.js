import axios from 'axios'
import { parseUrl } from '../utils'
import ResizeSensor from 'resize-sensor'

export default {
    name: 'main-mixin',
    data: () => ({
      essay: undefined
    }),
    computed: {
      html() { return this.$store.getters.html },
      mwSite() { return this.$store.getters.mwSite }
    },
    created() {
      this.$store.dispatch('setTitle', process.env.site_title)
      this.$store.dispatch('setBanner', process.env.banner_image)
    },
    methods: {
      getStaticPage(pageUrl) {
        const loc = parseUrl(pageUrl)
        let pageType
        if (loc.pathname.slice(loc.pathname.length - 3) === '.md') {
          pageType = 'markdown'
        } else {
          if (loc.pathname.indexOf('/wiki/') === 0 || loc.pathname.indexOf('/w/')) {
            pageType = 'mediawiki'
          }
        }
        console.log(`Page ${this.$options.name}: type=${pageType} url=${pageUrl}`)
        if (pageType === 'markdown') {
          return this.getMarkdown(pageUrl)
          .then((html) => {
            this.$store.dispatch('setHtml', html)
            this.$nextTick(() => { this.updateLinks() })
          })
      } else if (pageType === 'mediawiki') {
          return this.getWikitext(loc.hostname, pageUrl.split('/').slice(4).join('/'))
            .then((html) => {
              this.$store.dispatch('setHtml', html)
              this.$nextTick(() => {
                this.cleanWikitext()
                this.updateLinks()
              })
            })
        }
      },
      getMarkdown(url) {
        return axios.get(url).then(resp => this.$marked(resp.data))
      },
      getWikitext(site, title) {
        return axios.get(`https://${site}/w/api.php?action=parse&format=json&page=${encodeURIComponent(title)}`)
          .then(resp => resp.data.parse ? resp.data.parse.text['*'] : '')
      },
      updateLinks() {
        console.log('updateLinks', this.$options.name)
        if (this.$refs[this.$options.name]) {
          this.$refs[this.$options.name].querySelectorAll('a').forEach((link) => {
            if (link.href) {
              const parsedUrl = parseUrl(link.href)
              // console.log(`parsedUrl.origin=${parsedUrl.origin} mwSite=${this.mwSite} window.location.hostname=${window.location.hostname}`)
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
      getEssay(src) {
        window.data = undefined
        let url = `${process.env.ve_service_endpoint}/essay?src=${encodeURIComponent(src)}&nocss`
        if (process.env.context) {
          url += `&context=${process.env.context}`
        }
        axios.get(url)
          // .then(resp => this.$store.dispatch('setHtml', resp.data))
          .then(resp => this.essay = resp.data)
          .then(essay => this.onLoaded())
      },
      onLoaded() {
        const essayElem = document.getElementById('visual-essay')
        console.log('onLoaded', essayElem)
        if (essayElem) {
          const _this = this
          new ResizeSensor(essayElem, function() {
            const essaySpacer = document.getElementById('essay-spacer')
            _this.$store.dispatch('setSpacerHeight', essaySpacer ? essaySpacer.clientHeight : 0)
          })
          // get essay metadata
          console.log('onLoaded', window.data)
          if (!window.data) {
            const jsonld = essayElem.querySelectorAll('script[type="application/ld+json"]')
            if (jsonld.length > 0) {
              jsonld.forEach((scr) => {
                eval(scr)
              })
            }
          }
          this.addMetadata()
          this.updateLinks()
        } else {
          setTimeout(() => { this.onLoaded() }, 1000)
        }
      },
      addMetadata() {
        console.log('addMetadata', window.data)
        if (window.data) {
          window.data.forEach((item) => {
            if (item.type === 'essay') {
              if (item.title) {
                this.$store.dispatch('setTitle', item.title)
              }
              if (item.banner) {
                this.$store.dispatch('setBanner', item.banner)
              }          }
          })
        } else {
          setTimeout(() => { this.addMetadata() }, 1000)
        }
      },
      /*updateLinks() {
        console.log('updateLinks')
        if (this.$refs.main) {
          this.$refs.main.querySelectorAll('a').forEach((link) => {
            // console.log(link.href)
            if (link.href) {
              const parsedUrl = parseUrl(link.href)
              if (parsedUrl.host === window.location.host &&
                  parsedUrl.pathname.slice(0, 6) === '/wiki/' &&
                  parsedUrl.pathname.slice(6, 11) !== 'File:' &&
                  link.href.indexOf('#') === -1) {
                const essayTitle = parsedUrl.pathname.slice(6)
                console.log(`essayTitle=${essayTitle}`)
                link.removeAttribute('href')
                link.addEventListener('click', (e) => {
                  this.$router.push(`/essay/${essayTitle}`)
                })
              }
            }
          })
        }
      }
      */
    }
  }
  