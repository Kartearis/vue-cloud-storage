<template>
  <v-dialog
      :value="isShown"
      @input="$emit('toggleVisibility', $event)"
      :persistent="locked"
  >
    <v-card>
      <v-card-title>Create folder</v-card-title>
      <v-card-text>
        <v-form
            v-model="valid"
        >
          <v-alert
              v-for="(alert, i) of alerts"
              :key="i"
              color="warning"
              v-text="alert"
          ></v-alert>
          <v-text-field
              :label="fieldLabel"
              :rules="rules"
              :placeholder="placeholder"
              v-model="fieldValue"
              required
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            plain
            @click.stop="closeDialog"
            :disabled="locked"
        >
          Cancel
        </v-btn>
        <v-btn
            plain
            color="primary"
            @click.stop="() => onAccept(fieldValue, alerts, closeDialog)"
            :disabled="locked || !valid"
            v-text="acceptActionTitle ?? 'Accept'"
        >
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {useAuthStore} from "@/store/authStore";

export default {
  name: "OneFieldDialog",
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  model: {
    prop: 'isShown',
    event: 'toggleVisibility'
  },
  props: {
    isShown: {
      type: Boolean,
      required: true
    },
    onAccept: {
      type: Function,
      required: true
    },
    acceptActionTitle: String,
    fieldLabel: String,
    placeholder: String
  },
  data: () => ({
    rules: [
      value => !!value
    ],
    valid: false,
    alerts: [],
    fieldValue: "",
    locked: false
  }),
  methods: {
    closeDialog: function() {
      this.reset();
      this.$emit('toggleVisibility', false);
    },
    reset: function () {
      this.locked = false;
      this.alerts = [];
      this.fieldValue = "";
    }
  }
}
</script>

<style scoped>

</style>