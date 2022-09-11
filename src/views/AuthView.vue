<template>
  <v-container fill-height>
    <v-row align="center" justify="center">
      <v-col cols="6">
        <v-card>
          <v-card-title>Log in</v-card-title>
          <v-card-text>
            <v-form
                ref="form"
                v-model="valid"
            >
              <template v-if="alert">
                <v-alert dense v-for="(error, i) of alert.errors" :key="i" :type="alert.success ? 'success' : 'warning'">
                  {{error}}
                </v-alert>
              </template>
              <v-text-field
                  class="input--fix-autofill"
                  v-model="login"
                  label="Email"
                  :rules="validation.emailRules"
                  required
              >
              </v-text-field>
              <v-text-field
                  class="input--fix-autofill"
                  v-model="password"
                  label="Password"
                  :rules="validation.fieldRules"
                  :append-icon="passwordVisible ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="passwordVisible ? 'text' : 'password'"
                  @click:append="passwordVisible = !passwordVisible"
                  required
              >
              </v-text-field>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-btn
                :loading="loading"
                plain
                color="primary"
                :disabled="!valid"
                @click="authenticate"
            >
              Log in
            </v-btn>
            <v-btn
                :loading="loading"
                ref="regBtn"
                plain
                @click="navigateToRegistration"
            >
              Register
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapStores } from 'pinia';
import {useAuthStore} from "@/store/authStore";

export default {
  name: "AuthView",
  computed: {
    ...mapStores(useAuthStore)
  },
  data: () => ({
    valid: false,
    passwordVisible: false,
    login: "",
    password: "",
    alert: null,
    loading: false,
    validation: {
      fieldRules: [v => !!v || 'Field is required'],
      emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      ]
    }
  }),
  methods: {
    authenticate: async function() {
      this.loading = true;
      const result = await this.authStore.authenticate(this.login, this.password);
      this.loading = false;
      if (result.success) {
        this.alert = null;
        this.$router.push('/');
      }
      else this.alert = result;
    },
    navigateToRegistration: function() {
      this.$router.push('/register');
    }
  }
}
</script>

<!--suppress CssInvalidPseudoSelector -->
<style scoped>

  /* Fix bg color on autocomplete. deep selector allows styles to be applied to inputs inside v-text-field */
  .input--fix-autofill:deep(input:-webkit-autofill),
  .input--fix-autofill:deep(input:-webkit-autofill:hover),
  .input--fix-autofill:deep(input:-webkit-autofill:focus),
  .input--fix-autofill:deep(input:-webkit-autofill:active) {
    transition: background-color 0s ease-in-out 500000s;
  }

  /* Alternative variant with solid background */
  /*input:-webkit-autofill,*/
  /*input:-webkit-autofill:hover,*/
  /*input:-webkit-autofill:focus,*/
  /*input:-webkit-autofill:active{*/
  /*  -webkit-box-shadow: 0 0 0 30px white inset !important;*/
  /*}*/
</style>