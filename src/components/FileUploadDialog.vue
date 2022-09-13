<template>
  <v-dialog :value="isShown" @input="$emit('toggleVisibility', $event)">
    <v-card>
      <v-card-title>Upload file</v-card-title>
      <v-card-text>
        <v-alert
            v-for="(alert, i) of alerts"
            :key="i"
            color="warning"
            v-text="alert"
        ></v-alert>
        <v-form
          v-model="valid">
          <v-file-input
              show-size
              label="File to upload"
              v-model="file"
              :rules="rules"
              required
          ></v-file-input>
          <v-checkbox
              v-model="fileExpires"
              label="Temporary file"
          >
          </v-checkbox>
          <template v-if="fileExpires">
            <date-input
                v-model="expire.date"
                :min="new Date()"
            >
            </date-input>
            <time-input
              v-model="expire.time">
            </time-input>
          </template>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            plain
            @click.stop="closeDialog"
        >
          Cancel
        </v-btn>
        <v-btn
            plain
            color="primary"
            @click.stop="uploadFile"
            :disabled="!valid"
        >
          Upload
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
// TODO: refactor
import DateInput from "@/components/DateInput";
import TimeInput from "@/components/TimeInput";
function getExtension(file) {
  const parts = file.split('.');
  if (parts.length > 1)
    return parts.pop();
  return "";
}
export default {
  name: "FileUploadDialog",
  components: {TimeInput, DateInput},
  model: {
    prop: 'isShown',
    event: 'toggleVisibility'
  },
  props: {
    isShown: Boolean
  },
  data: () => ({
    rules: [
        value => !!value || 'File must be selected',
        value => !value || value.size < 20 * 1000 * 1000 || 'File size must not exceed 20MB!',
        value => !value || getExtension(value.name) !== 'php' || 'File must not be .php'
    ],
    valid: false,
    file: null,
    fileExpires: false,
    alerts: [],
    expire: {
      date: new Date(),
      time: new Date()
    }
  }),
  methods: {
    uploadFile: function() {
      this.alerts = [];
      if (this.fileExpires && !this.validateExpireTime())
        this.alerts.push('File cannot expire before upload. Please select different date-time.');

      this.reset();
    },
    closeDialog: function() {
      this.reset();
      this.$emit('toggleVisibility', false);
    },
    reset: function() {
      this.file = null;
      this.fileExpires = false;
    },
    validateExpireTime: function() {
      const dt = new Date(this.expire.date)
      dt.setHours(this.expire.time.getHours());
      dt.setMinutes(this.expire.time.getMinutes());
      return dt > new Date();
    }
  }
}
</script>

<style scoped>

</style>