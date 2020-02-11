<template>
  <v-layout>
    <v-flex>
      <div :ref="$options.name" v-html="essay"/>
    </v-flex>
  </v-layout>
</template>

<script>
import Mixin from './mixin'

export default {
  name: 'index',
  mixins: [ Mixin ],
  mounted() {
    this.getEssay(`${this.mwSite}/wiki/${process.env.root_essay}`)  
  }
}
</script>
