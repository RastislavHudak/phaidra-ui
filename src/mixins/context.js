import PBreadcrumbs from '@/components/PBreadcrumbs'

export const context = {
  components: {
    PBreadcrumbs
  },
  methods: {
    signedin () {
      return this.$store.state.user.token ? 1 : 0
    },
    user () {
      return this.$store.state.user
    },
    getRootBreadcrumbs: function () {
      return [
        {
          text: this.$t(this.$store.state.instanceconfig.institution),
          disabled: false,
          external: true,
          to: 'https://www.univie.ac.at'
        },
        {
          text: this.$t(this.$store.state.instanceconfig.title),
          disabled: false,
          to: '/'
        }
      ]
    }
  },
  data () {
    return {
      breadcrumbs: []
    }
  }
}