<template>
  <v-layout>
    <v-flex>
      <div :ref="$options.name" v-html="essay"/>
    </v-flex>
  </v-layout>
</template>

<script>
import Mixin from '../mixin'

export default {
  name: 'essay',
  mixins: [ Mixin ],
  mounted() {
    window.scrollTo(0, 0)
    this.getEssay(`${this.mwSite}/wiki/${this.$route.params.pathMatch}`)
  }
}
</script>
