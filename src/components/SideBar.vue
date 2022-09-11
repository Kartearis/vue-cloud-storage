<template>
  <v-navigation-drawer app
        :value="drawer"
        @input="updateDrawer"
  >
    <app-navigation
      :items="navItems"
    ></app-navigation>
  </v-navigation-drawer>
</template>

<script>
import AppNavigation from "@/components/Navigation";
export default {
  name: "SideBar",
  components: {AppNavigation},
  model: {
    prop: "drawer"
  },
  props: {
    drawer: {
      type: Boolean,
      default: null,
    }
  },
  methods: {
    updateDrawer: function(event) {
      this.$emit('input', event);
    }
  },
  data: () => ({
    navItems: [
      {
        icon: 'mdi-folder',
        text: '/'
      }
    ]
  })
}
</script>

<style scoped>

</style>