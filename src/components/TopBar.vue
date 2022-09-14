<template>
  <v-app-bar app
             color="primary"
             dark
  >
    <slot name="nav"></slot>
    <div class="d-flex align-center">
      <v-img
          alt="Vue logo"
          class="shrink mr-2"
          contain
          :src="require('../assets/logo.svg')"
          transition="scale-transition"
          width="35"
      />

      <v-toolbar-title class="text-h6 text-md-h4 text-xl-h3">Vue cloud storage</v-toolbar-title>
    </div>
<!--    <nav>-->
<!--      <router-link to="/">Home</router-link> |-->
<!--      <router-link to="/about">About</router-link>-->
<!--    </nav>-->

    <v-spacer></v-spacer>
    <user-menu></user-menu>
  </v-app-bar>
</template>

<script>
import UserMenu from "@/components/UserMenu";

export default {
  name: "TopBar",
  components: {UserMenu}
}
</script>

<style scoped>

</style>