<template>
  <v-app>
    <v-container fluid>
      <v-layout row wrap>

        <v-flex xs12>
          <quicklinks v-if="isUnivie" :showquicklinks="quicklinksenabled"></quicklinks>
        </v-flex>

        <v-flex xs12 md10 offset-md1 class="header">

          <v-layout row wrap>
            <v-flex xs3 text-xs-left>
              <router-link :to="'/'">
                <img v-if="isUnivie" src="./assets/Uni_Logo_2016.png" class="logo" alt="logo" />
                <img v-if="instanceconfig.baseurl === 'volare.vorarlberg.at'" src="./assets/logo_vorarlberg_land.png" class="logo" alt="logo" />
                <img v-if="instanceconfig.baseurl === 'phaidra.kug.ac.at'" src="./assets/kug_logo.gif" class="logo" alt="logo" />
                <img v-if="instanceconfig.baseurl === 'phaidra.bibliothek.uni-ak.ac.at'" src="./assets/uniak_logo.png" class="logo pt-5" alt="logo" />
                <img v-if="instanceconfig.baseurl === 'phaidra.ufg.at'" src="./assets/logo_ufg.gif" class="logo pt-5" alt="logo" />
                <img v-if="instanceconfig.baseurl === 'e-book.fwf.ac.at'" src="./assets/fwf_logo.png" class="logo pt-5 pb-4" alt="logo" />
                <img v-if="instanceconfig.baseurl === 'phaidra.fhstp.ac.at'" src="./assets/fhstp_logo.svg" class="logo" alt="logo" />
                <v-flex v-if="instanceconfig.baseurl === 'phaidra.cab.unipd.it'" style="width: 165px; height: 54px; background-color: #EB001E; margin-top: 50px;"><img src="./assets/unipd_logo.png" class="logo" alt="logo" /></v-flex>
              </router-link>
            </v-flex>

            <v-flex xs9>

              <v-layout column fill-height>
                <v-flex>
                  <v-layout row wrap >
                    <v-flex text-xs-right>
                      <router-link v-if="appconfig.enablelogin" :to="'/login'"><v-btn flat icon color="grey lighten-1" class="v-align-top top-margin-3"><icon name="material-social-person" width="24px" height="24px"></icon></v-btn></router-link>

                      <span v-if="signedin" class="subheading displayname grey--text text--lighten-1">{{ user.firstname }} {{ user.lastname }}</span>

                      <v-menu bottom transition="slide-y-transition" class="v-align-top">
                        <v-btn flat icon slot="activator" color="grey lighten-1" class="top-margin-3">
                          {{$i18n.locale}}
                          <icon name="univie-sprache" class="lang-icon"></icon>
                        </v-btn>
                        <v-list>
                          <v-list-tile @click="$i18n.locale='eng'">
                            <v-list-tile-title>English</v-list-tile-title>
                          </v-list-tile>
                          <v-list-tile @click="$i18n.locale='deu'">
                            <v-list-tile-title>Deutsch</v-list-tile-title>
                          </v-list-tile>
                          <v-list-tile @click="$i18n.locale='ita'">
                            <v-list-tile-title>Italiano</v-list-tile-title>
                          </v-list-tile>
                        </v-list>
                      </v-menu>

                      <a id="quicklinks-button" v-if="isUnivie" class="ph-button" v-on:click="quicklinksenabled = !quicklinksenabled">Quicklinks</a>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-layout >
                  <v-flex v-if="appconfig.showinstanceswitch" xs4 text-xs-left class="select-instance">
                    <v-select :items="instances" @input="switchInstance" :value="instanceconfig.baseurl" item-text="baseurl" single-line></v-select>
                  </v-flex>
                  <v-flex xs10 offset-xs1 text-xs-left v-else-if="instanceconfig.title">
                    <icon left dark name="univie-right" color="#a4a4a4" width="14px" height="14px"></icon>
                    <router-link class="subheading primary--text mx-3" :to="'/'">{{ instanceconfig.title }}</router-link>
                  </v-flex>
                </v-layout>
                <v-flex>
                  <v-toolbar flat color="white" dense>
                    <client-only placeholder="loading" placeholder-tag="span">
                      <v-toolbar-side-icon class="hidden-md-and-up">
                        <v-menu offset-y>
                          <v-btn flat icon color="grey lighten-1" slot="activator"><icon name="material-navigation-menu" width="24px" height="24px"></icon></v-btn>
                          <v-list>
                            <v-list-tile @click="$router.push('search')"><v-list-tile-title>{{ $t("Search") }}</v-list-tile-title></v-list-tile>
                            <v-list-tile v-if="signedin" @click="$router.push('submit')"><v-list-tile-title>{{ $t("Submit") }}</v-list-tile-title></v-list-tile>
                            <v-list-tile v-if="signedin" @click="$router.push('myobjects')"><v-list-tile-title>{{ $t("My objects") }}</v-list-tile-title></v-list-tile>
                            <v-list-tile v-if="signedin" @click="$router.push('bookmarks')"><v-list-tile-title>{{ $t("Bookmarks") }}</v-list-tile-title></v-list-tile>
                            <v-list-tile v-if="signedin" @click="$router.push('groups')"><v-list-tile-title>{{ $t("Groups") }}</v-list-tile-title></v-list-tile>
                            <v-list-tile v-if="signedin" @click="$router.push('templates')"><v-list-tile-title>{{ $t("Templates") }}</v-list-tile-title></v-list-tile>
                            <v-list-tile v-if="!signedin && appconfig.enablelogin" @click="$router.push('login')"><v-list-tile-title>{{ $t("Login") }}</v-list-tile-title></v-list-tile>
                            <v-list-tile v-if="signedin" @click="$router.push('/')"><v-list-tile-title>{{ $t("Logout") }}</v-list-tile-title></v-list-tile>
                          </v-list>
                        </v-menu>
                      </v-toolbar-side-icon>
                    </client-only>
                    <v-spacer></v-spacer>
                    <v-toolbar-items class="hidden-sm-and-down no-height-inherit">
                      <router-link class="ph-button" :to="{ name: 'search'}">{{ $t("Search") }}</router-link>
                      <router-link class="ph-button"  :to="'/submit'">{{ $t("Submit") }}</router-link>
                      <router-link class="ph-button" v-if="signedin" :to="'/myobjects'">{{ $t("My objects") }}</router-link>
                      <router-link class="ph-button" v-if="signedin" :to="'/bookmarks'">{{ $t("Bookmarks") }}</router-link>
                      <router-link class="ph-button" v-if="signedin" :to="'/groups'">{{ $t("Groups") }}</router-link>
                      <router-link class="ph-button" v-if="signedin" :to="'/templates'">{{ $t("Templates") }}</router-link>
                      <router-link class="ph-button" v-if="!signedin && appconfig.enablelogin" :to="'/login'">{{ $t("Login") }}</router-link>
                      <router-link class="ph-button" v-if="signedin" :to="''" @click="logout" >{{ $t("Logout") }}</router-link>
                    </v-toolbar-items>
                  </v-toolbar>
                </v-flex>
              </v-layout>

            </v-flex>
          </v-layout>

        </v-flex>

        <v-flex xs12 md10 offset-md1 class="content">
          <v-flex>
            <p-breadcrumbs :items="breadcrumbs"></p-breadcrumbs>
          </v-flex>
          <v-alert v-for="(alert, i) in alerts" :type="(alert.type === 'danger' ? 'error' : alert.type)" :value="true" transition="slide-y-transition" :key="i">
            <v-layout row><v-flex class="pa-3">{{alert.msg}}</v-flex><v-spacer></v-spacer><v-btn icon @click.native="dismiss(alert)"><v-icon>close</v-icon></v-btn></v-layout>
          </v-alert>
          <transition name="fade" mode="out-in">
            <keep-alive>
              <router-view class="mt-4 mb-3"></router-view>
            </keep-alive>
          </transition>

        </v-flex>

        <v-flex xs12 v-if="isUnivie">
          <quicklinks-footer></quicklinks-footer>
        </v-flex>

        <v-flex xs12 md10 offset-md1>
          <v-layout row wrap class="my-5">
            <v-flex text-xs-left>
              <span class="grey--text text--darken-2"><address>{{ instanceconfig.address }} | <abbr title="Telefon">T</abbr> {{ instanceconfig.phone }}</address></span>
            </v-flex>
            <v-flex text-xs-right>
              <a href="http://datamanagement.univie.ac.at/" target="_blank">{{ $t('Servicepage') }}</a> | <router-link :to="'impressum'">{{ $t('Impressum') }}</router-link>
            </v-flex>
          </v-layout>
        </v-flex>

      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import '@/assets/css/material-icons.css'
import Quicklinks from '@/components/Quicklinks'
import QuicklinksFooter from '@/components/QuicklinksFooter'
import '@/compiled-icons/material-social-person'
import '@/compiled-icons/material-navigation-menu'
import '@/compiled-icons/univie-sprache'
import ClientOnly from 'vue-client-only'
import { context } from '@/mixins/context'
import { config } from '@/mixins/config'

export default {
  name: 'app',
  mixins: [ context, config ],
  components: {
    Quicklinks,
    QuicklinksFooter,
    ClientOnly
  },
  data () {
    return {
      quicklinksenabled: 0
    }
  },
  computed: {
    breadcrumbs () {
      return this.$store.state.breadcrumbs
    },
    alerts () {
      return this.$store.state.alerts
    },
    instances () {
      return Object.keys(this.$store.state.config.instances)
    },
    isUnivie () {
      switch (this.instanceconfig.baseurl) {
        case 'phaidra.univie.ac.at':
        case 'phaidra-sandbox.univie.ac.at':
        case 'phaidra-entw.univie.ac.at':
          return true
        default:
          return false
      }
    }
  },
  methods: {
    logout: function () {
      this.$store.dispatch('logout')
    },
    getCookie: function (name) {
      var value = '; ' + document.cookie
      var parts = value.split('; ' + name + '=')
      if (parts.length === 2) {
        var val = parts.pop().split(';').shift()
        return val === ' ' ? null : val
      }
    },
    dismiss: function (alert) {
      this.$store.commit('clearAlert', alert)
    },
    switchInstance: function (e) {
      this.$store.dispatch('switchInstance', e).then(() => {
        this.$store.commit('clearStore')
        this.$router.push('/search')
        this.$store.dispatch('search')
        this.$vuetify.theme.primary = this.$store.state.instanceconfig.primary
      })
    }
  },
  mounted: function () {
    var token = this.getCookie('X-XSRF-TOKEN')
    if (token) {
      this.$store.commit('setToken', token)
    }
  },
  created: function () {
    this.$vuetify.theme.primary = this.$store.state.instanceconfig.primary
  }
}
</script>

<style lang="stylus">
  @require './stylus/main'
</style>

<style>

.no-padding {
  padding: 0px;
}

.svg-icon {
  fill: currentColor;
}

.ie-fixMinHeight {
    display:flex;
}

html, body{
    height:100%;
}

section { overflow: auto; }

#app {
  font-family: "Roboto", sans-serif, Arial, Helvetica, sans-serif;
  font-size: 11.5pt;
  line-height: 1.42857143;
  color: black;
  background-color: white;
  font-weight: 300;
  text-rendering: optimizeLegibility;
}

a {
  text-decoration: none;
}

.logo {
  height: auto;
  width: auto;
  max-width: 250px;
  max-height: 150px;
}

.header {
  -webkit-box-shadow: 48px 0 0 0 white, -48px 0 0 0 white, 0 8px 40px -6px rgba(70, 70, 70, 0.4);
  box-shadow: 48px 0 0 0 white, -48px 0 0 0 white, 0 8px 40px -6px rgba(70, 70, 70, 0.4);
  background-color: white;
  z-index: 1;
}

address {
  font-style: normal;
}

.v-align-top {
  vertical-align: top;
}

.top-margin-3 {
  margin-top: 3px;
}

.lang-icon {
  margin-left: 5px;
}

.displayname {
  vertical-align: top;
  display: inline-block;
  margin-top: 10px;
}

.ph-button  {
  background-color: #909090;
  color: white !important;
  box-sizing: border-box;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  position: relative;
  outline: 0;
  border: 0;
  border-radius: 0px;
  display: inline-block;
  -ms-flex-align: center;
  align-items: center;
  padding: 0 6px;
  margin: 6px 1px 6px 0px;
  height: 30px;
  line-height: 30px;
  min-height: 30px;
  white-space: nowrap;
  min-width: 88px;
  text-align: center;
  font-weight: 300;
  font-size: 14px;
  font-style: inherit;
  font-variant: inherit;
  font-family: inherit;
  text-decoration: none;
  cursor: pointer;
  overflow: hidden;
  letter-spacing: .010em;
  font-weight: 400;
}

.ph-button:hover {
  background-color: #267ab3;
  text-decoration: none;
  color: white;
  font-weight: 400;
}

#quicklinks-button {
  background-color: #1a74b0;
  text-decoration: none;
  color: white;
  margin-top: 0px;
  width: 263px;
}

#quicklinks-button:hover {
  color: white;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.1s
}
.fade-enter, .fade-leave-to {
  opacity: 0
}

.select-instance {
  max-width: 300px;
}

.border-bottom {
  border-bottom: 1px solid #bdbdbd;
}

.border-top {
  border-top: 1px solid #bdbdbd;
}

#app .v-btn {
  text-transform: none;
}
#app .v-tabs__div {
  text-transform: none;
  font-weight: 300;
}
</style>

<style scoped>
.content {
  min-height: 800px;
}

.container {
  padding: 0px;
}

.no-height-inherit {
  height: unset;
}
</style>
