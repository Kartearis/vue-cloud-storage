<template>
  <v-app>
    <top-bar>
<!--      Disabled due to side-bar disability   -->
<!--      <template v-slot:nav>-->
<!--        <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>-->
<!--      </template>-->
    </top-bar>
<!--    Side bar is disabled temporarily  -->
<!--    <side-bar-->
<!--      v-model="navDrawerShown"-->
<!--    ></side-bar>-->
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import  { RouterView } from 'vue-router';
// import SideBar from "@/components/SideBar";
import TopBar from "@/components/TopBar";

export default {
  name: 'App',

  components: {
    TopBar,
    RouterView,
    // SideBar
  },

  methods: {
    toggleDrawer: function() {
      this.navDrawerShown = !this.navDrawerShown;
    }
  },

  data: () => ({
    // Set to null so actual starting value defaults on scren size at app launch
    navDrawerShown: null
  }),
};
</script>
