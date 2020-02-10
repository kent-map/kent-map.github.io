<template>
  <v-layout>
    <v-flex>
      <div ref="main" id="main" v-html="essay"/>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from 'axios'
import ResizeSensor from 'resize-sensor'
import { parseUrl } from '../../utils'

export default {
  name: 'essay',
  data: () => ({
    essay: undefined,
    essayBaseUrl: undefined
  }),
  computed: {
    mwSite() { return this.$store.getters.mwSite }
  },
  created() {
    window.data = undefined
    this.$store.dispatch('setTitle', process.env.site_title)
    this.$store.dispatch('setBanner', process.env.banner_image)
  },
  mounted() {
    console.log(this.$route)
    const src = `${this.mwSite}/wiki/${this.$route.params.pathMatch}`
    console.log(src)
    // const src = this.$route.query.src.replace(/http:\/\/localhost:5000/, 'file://localhost')
    console.log('essay', src, process.env.ve_service_endpoint)
    const essayLoc = parseUrl(src)
    this.essayBaseUrl = `${essayLoc.protocol}://${essayLoc.hostname}`
    this.getEssay(src)
  },
  methods: {
    waitForLoaded() {
      const essayElem = document.getElementById('essay')
      console.log(essayElem)
      if (essayElem) {
        console.log(essayElem)
        this.getEssayMetadata()
        this.updateLinks()
      } else {
        setTimeout(() => { this.waitForLoaded() }, 1000)
      }
    },
    getEssay(src) {
      let url = `${process.env.ve_service_endpoint}/essay?src=${encodeURIComponent(src)}&nocss`
      console.log('getEssay', url)
      if (process.env.context) {
        url += `&context=${process.env.context}`
      }
      console.log(url)
      axios.get(url)
        .then((resp) => {
          this.essay = resp.data
          this.waitForLoaded()
          this.$nextTick(() => {          
            const essay = document.getElementById('essay')
            const _this = this
            new ResizeSensor(essay, function() {
              const essaySpacer = document.getElementById('essay-spacer')
              _this.$store.dispatch('setSpacerHeight', essaySpacer ? essaySpacer.clientHeight : 0)
            })
          })
        })
    },
    addMetadata() {
      console.log('addMetadata')
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
        setTimeout(() => { this.addMetadata() }, 200)
      }
    },
    getEssayMetadata(essay) {
      if (!window.data) {
        essay.querySelectorAll('script[type="application/ld+json"]').forEach((scr) => {
          eval(scr)
        })
      }
      this.addMetadata()
    },
    updateLinks() {
      if (this.$refs.main) {
        this.$refs.main.querySelectorAll('a').forEach((link) => {
          if (link.href) {
            const parsedUrl = parseUrl(link.href)
            if (parsedUrl.host === window.location.host &&
                parsedUrl.pathname.slice(0, 6) === '/wiki/' &&
                parsedUrl.pathname.slice(6, 11) !== 'File:' &&
                link.href.indexOf('#') === -1) {
              const essayTitle = parsedUrl.pathname.slice(6)
              // console.log(`essayTitle=${essayTitle}`)
              link.removeAttribute('href')
              link.addEventListener('click', (e) => {
                this.$router.push(`/essay/${essayTitle}`)
              })
            }
          }
        })
      }
    }
  }
}
</script>
