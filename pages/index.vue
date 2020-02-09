<template>
  <v-layout>
    <v-flex>
      <div :ref="$options.name" v-html="html"/>
    </v-flex>
  </v-layout>
</template>

<script>
  import Mixin from './mixin'

  export default {
    name: 'index',
    mixins: [ Mixin ],
    mounted() {
      // Reset banner and title to defaults
      this.$store.dispatch('setTitle', process.env.site_title)
      this.$store.dispatch('setBanner', process.env.banner_image)
    }
  }
</script>
