<template>
  <v-container fill-height>
    <v-row align="center" justify="center">
      <v-col cols="6">
        <v-card>
          <v-card-title>Register</v-card-title>
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
                  v-model="name"
                  label="User name"
                  :rules="validation.fieldRules"
                  required
                  autocomplete="login"
              >
              </v-text-field>
              <v-text-field
                  class="input--fix-autofill"
                  v-model="email"
                  label="Email"
                  :rules="validation.emailRules"
                  required
                  autocomplete="email"
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
                  autocomplete="password"
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
                @click="register"
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

// TODO: Reduce duplicated code
export default {
  name: "RegisterView",
  computed: {
    ...mapStores(useAuthStore)
  },
  data: () => ({
    valid: false,
    passwordVisible: false,
    name: "",
    email: "",
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
    register: async function() {
      this.loading = true;
      const result = await this.authStore.register(this.email, this.password, this.name);
      if (result.success) {
        this.alert = result;
        const secRes = await this.authStore.authenticate(this.email, this.password);
        if (secRes.success)
        {
          this.alert = null;
          this.$router.push('/');
        }
        else this.alert = {success: false, errors: ['Autologin failed', ...secRes.errors]};
      }
      else this.alert = result;
      this.loading = false;
    },
  },
  // Ugly fix for overlap of labels and autofill (https://stackoverflow.com/a/73633659/8244160)
  // TODO: replace with one based on animation event
  mounted() {
    setTimeout(() => {
      const els = document.querySelectorAll("input:-webkit-autofill")
      els.forEach((el) => {
        const label = el.parentElement.querySelector("label")
        label.classList.add("v-label--active")
      })
    }, 100)
  },
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
</style>