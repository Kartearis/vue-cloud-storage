<template>
  <v-dialog
      :value="isShown"
      @input="$emit('toggleVisibility', $event)"
      :persistent="locked"
  >
    <v-card>
      <v-progress-linear
          v-if="upload.inProgress"
          absolute
          top
          :value="uploadProgress"
          color="primary"
      ></v-progress-linear>
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
            :disabled="locked"
        >
          Cancel
        </v-btn>
        <v-btn
            plain
            color="primary"
            @click.stop="uploadFile"
            :disabled="locked || !valid"
        >
          Upload
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import DateInput from "@/components/DateInput";
import TimeInput from "@/components/TimeInput";
import {useAuthStore} from "@/store/authStore";
// TODO: refactor
function getExtension(file) {
  const parts = file.split('.');
  if (parts.length > 1)
    return parts.pop();
  return "";
}
// TODO: refactor common download/upload progress features
export default {
  name: "FileUploadDialog",
  components: {TimeInput, DateInput},
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  model: {
    prop: 'isShown',
    event: 'toggleVisibility'
  },
  props: {
    isShown: Boolean,
    folderId: Number
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
    },
    locked: false,
    upload: {
      inProgress: false,
      progress: 0,
      total: 0
    }
  }),
  methods: {
    uploadFile: async function() {
      this.alerts = [];
      if (this.fileExpires && !this.validateExpireTime())
      {
        this.alerts.push('File cannot expire before upload. Please select different date-time.');
        return;
      }
      if (!this.file) {
        this.alerts.push('File must be selected.');
      }
      this.locked = true;
      this.upload.inProgress = true;
      try {
        const newFile = await this.authStore
            .userRequestController
            .uploadFile(
                this.file,
                this.folderId,
                this.fileExpires ? this.expireDateTime : null,
                (progress) => {
                  this.upload.progress = progress.loaded;
                  this.upload.total = progress.total;
                }
            );
        this.$emit('new_file', newFile);
        this.closeDialog();
      } catch (e) {
        console.log(e);
        if (Array.isArray(e))
          this.alerts.push(...e);
        else throw "An unexpected error occured while handling upload errors";
      } finally {
        this.upload.inProgress = false;
        this.locked = false;
      }
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
      return this.expireDateTime > new Date();
    }
  },
  computed: {
    expireDateTime: function() {
      const dt = new Date(this.expire.date)
      dt.setHours(this.expire.time.getHours());
      dt.setMinutes(this.expire.time.getMinutes());
      return dt;
    },
    uploadProgress: function() {
      if (this.upload.inProgress)
        return Math.round(this.upload.progress / this.upload.total * 100);
      return 0;
    }
  }
}
</script>

<style scoped>

</style>