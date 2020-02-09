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
    name: 'help',
    mixins: [ Mixin ]
  }
</script>