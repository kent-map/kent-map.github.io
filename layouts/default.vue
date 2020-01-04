<template>
  <v-app>

    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list dense>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>    
            <nuxt-link to="/">
              <v-list-item-title>Home</v-list-item-title>
            </nuxt-link>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-contact-mail</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Contact</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

  <v-card tile class="overflow-hidden">
    <v-app-bar
      app
      prominent
      :height="bannerHeight"
      elevate-on-scroll
      absolute
      dark
      shrink-on-scroll
      src="https://kg.jstor.org/w/images/1/19/Pegwel_bay_kent.jpg"
      scroll-target="#scrollableContent"
    >
      <template v-slot:img="{ props }">
        <!-- <v-img
          v-bind="props"
          gradient="to top right, rgba(19,84,122,.5), rgba(128,208,199,.8)"
        /> -->
        <v-img v-bind="props"/>
      </template>

      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

      <v-toolbar-title>Kent Maps</v-toolbar-title>

      <v-spacer></v-spacer>

    </v-app-bar>

    <v-sheet
      id="scrollableContent"
      class="overflow-y-auto"
    >
      <v-container ref="contentContainer" :style="`margin-top: ${essayTopMargin}px; height: ${height}px;`">
        <nuxt/>
      </v-container>

    </v-sheet>
 
    <v-footer ref="footer" :fixed="fixed" app>
      <v-flex class="text-xs-left">
        <span>&nbsp;v{{ version }}</span>
      </v-flex>
    </v-footer>

    <v-snackbar
      v-if="logLevel"
      v-model="snackbar"
      :bottom="y === 'bottom'"
      :left="x === 'left'"
      :multi-line="true"
      :right="x === 'right'"
      :timeout="timeout"
      :top="y === 'top'"
      :vertical="false"
    >
      <v-chip :color="loggingConfig[logLevel].color">{{ logMessages[logLevel].length }}</v-chip>
      <span class="log-message">{{ logMessages[logLevel][0] }}</span>
      <v-icon color="red" @click="dismiss">delete</v-icon>
      <v-icon color="white" @click="snackbar = false">close</v-icon>
    </v-snackbar>

  </v-card>
  </v-app>
</template>

<script>

  export default {
    data () {
      return {
        version: process.env.APP_VERSION,
        clipped: true,
        drawer: false,
        fixed: false,
        miniVariant: false,
        height: 600,
        bannerHeight: 600,
        essayTopMargin: 140,
        title: 'Visual Essays',

        snackbar: false,
        y: 'bottom',
        x: null,
        timeout: 0,

        logLevel: null,
        logMenuCount: 0,
        logMenuColor: null,
        loggingConfig: {
          error: { label: 'Error', color: 'red' },
          warning: { label: 'Warning', color: 'yellow' },
          info: { label: 'Info', color: 'teal' },
          debug: { label: 'Debug', color: 'gray' }
        }
      }
    },
    computed: {
      logMessages() { return this.$store.getters.logMessages },
      viewport() { return this.$store.getters.viewport },
      spacerHeight() { return this.$store.getters.spacerHeight }
    },
    mounted() {
      this.bannerHeight = this.viewport.height * .25 
      this.essayTopMargin = this.bannerHeight
      this.height = this.viewport.height - this.bannerHeight - this.spacerHeight - 36
    },
    methods: {
      showLogMessages(level) {
        this.logLevel = level
        this.snackbar = true
      },
      dismiss() {
        if (this.logMessages[this.logLevel].length === 1) {
          this.snackbar = false
          this.logLevel = null
        }
        this.$store.dispatch('popLogMessage', this.logLevel)
      },
    },
    watch: {
      logMessages() {
        this.logMenuCount = 0
        this.logMenuColor = null;
        ['error', 'warning', 'info', 'debug'].forEach((level) => {
          if (this.logMenuCount === 0) {
            if (this.logMessages[level].length > 0) {
              this.logMenuCount = this.logMessages[level].length
              this.logMenuColor = this.loggingConfig[level].color
             }
           }
         })
      },
      viewport: {
        handler: function (viewport) {
          if (viewport) {
            this.bannerHeight = this.viewport.height * .25 
            this.essayTopMargin = this.bannerHeight
            this.height = this.viewport.height - this.bannerHeight - this.spacerHeight - 36
          }
        },
        immediate: true
      }
    }
  }
</script>

<style>
  #keep .v-navigation-drawer__border {
    display: none
  }
  .v-toolbar__title {
    font-size: 24px !important;
    font-weight: bold;
  }
</style>