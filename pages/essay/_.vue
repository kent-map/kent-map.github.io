<template>
  <v-layout>
    <v-flex>
      <div id="main" v-html="essay"/>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from 'axios'
import ResizeSensor from 'resize-sensor'

const baseURL = process.env.deployEnv === 'DEV'
    ? 'http://localhost:5000'
    : 'https://us-central1-visual-essay.cloudfunctions.net'

const api = axios.create({
  baseURL
})

export default {
  name: 'essay',
  data: () => ({
    essay: undefined
  }),
  mounted() {
    this.getEssay(this.$route.query.src)
  },
  methods: {
    getEssay(src) {
      api.get(`/essay?src=${src}&nocss`)
        .then(resp => resp.data)
        .then((html) => {
          this.essay = html
          this.$nextTick(() => {
            const element = document.getElementById('essay')
            const _this = this
            new ResizeSensor(element, function() {
              const essaySpacer = document.getElementById('essay-spacer')
              _this.$store.dispatch('setSpacerHeight', essaySpacer ? essaySpacer.clientHeight : 0)
            })
          })
        })
    }
  }
}
</script>
