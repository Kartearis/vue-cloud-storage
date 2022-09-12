<template>
  <v-menu left offset-x>
    <template v-slot:activator="{on, attrs}">
      <v-btn icon
        v-bind="attrs"
        v-on="on"
      >
        <v-icon aria-hidden="false">
          {{authStore.isAuthorized ? 'mdi-account' : 'mdi-login-variant'}}
        </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        {{authStore.isAuthorized ? "Profile" : "Authorization"}}
      </v-card-title>
      <v-card-text>
        <v-list subheader>
          <v-subheader>Info</v-subheader>
          <template v-if="authStore.isAuthorized">
            <v-list-item
                v-for="(value, field) of authStore.user"
                :key="field">
              <v-list-item-content v-if="value.displayable === undefined || value.displayable === true">
                <v-list-item-title v-text="value.label">
                </v-list-item-title>
                <v-list-item-subtitle v-text="value.formatter !== undefined ? value.formatter(value.value) : value.value">
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
          <v-list-item v-else>
            You are currently not authorized. Please log in or register.
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list subheader>
          <v-subheader>Actions</v-subheader>
          <v-list-item-group>
            <v-list-item
                v-for="action of actions"
                :key="action.title"
                @click="action.action"
            >
              <v-list-item-icon>
                <v-icon aria-hidden="true" v-text="action.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-title v-text="action.title"></v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
import {useAuthStore} from "@/store/authStore";
export default {
  name: "UserMenu",
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  methods: {
    deduplicatedNavigation: function(path) {
      if (this.$router.currentRoute.path !== path)
        this.$router.push(path);
    }
  },
  computed: {
    actions: function() {
      let actions = null;
      if (this.authStore.isAuthorized) {
        actions = [
          {
            title: 'Logout',
            icon: 'mdi-logout',
            action: () => { this.authStore.logout().then(() => {
                this.deduplicatedNavigation('/auth')
              })
            }
          }
        ]
      }
      else {
        actions = [
          {
            title: 'Login',
            icon: 'mdi-login',
            action: () => { this.deduplicatedNavigation('/auth') }
          },
          {
            title: 'Register',
            icon: 'mdi-account-plus',
            action: () => { this.deduplicatedNavigation('/register') }
          }
        ]
      }
      return actions;
    }
  }
}
</script>

<style scoped>

</style>