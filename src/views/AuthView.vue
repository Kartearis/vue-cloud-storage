<template>
  <v-container>
    <v-card>
      <v-card-title>Log in</v-card-title>
      <v-card-text>
        <v-form
            ref="form"
            v-model="valid"
        >
          <v-text-field
              class="input--fix-autofill"
              v-model="login"
              label="Login"
              required
          >
          </v-text-field>
          <v-text-field
              class="input--fix-autofill"
              v-model="password"
              label="Password"
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
          plain
          color="primary"
          :disabled="!valid"
          @click="authenticate"
        >
          Log in
        </v-btn>
        <v-btn
          plain
          @click="navigateToRegistration"
        >
          Register
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "AuthView",
  data: () => ({
    valid: false,
    passwordVisible: false,
    login: "",
    password: ""
  }),
  methods: {
    authenticate: function() {
      console.log('Register as ', this.login, this.password);
    },
    navigateToRegistration: function() {
      this.$router.push('/register');
    }
  }
}
</script>

<style scoped>
  /* Fix bg color on autocomplete */
  .input--fix-autofill >>> input:-webkit-autofill,
  .input--fix-autofill >>> input:-webkit-autofill:hover,
  .input--fix-autofill >>> input:-webkit-autofill:focus,
  .input--fix-autofill >>> input:-webkit-autofill:active {
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