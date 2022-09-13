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
              label="Folder name"
              :rules="rules"
              v-model="folderName"
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
            @click.stop="createFolder"
            :disabled="locked || !valid"
        >
          Create
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {useAuthStore} from "@/store/authStore";

export default {
  name: "FolderCreationDialog",
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
      value => !!value
    ],
    valid: false,
    alerts: [],
    folderName: "",
    locked: false
  }),
  methods: {
    closeDialog: function() {
      this.reset();
      this.$emit('toggleVisibility', false);
    },
    createFolder: async function() {
      this.locked = true;
      this.alerts = [];
      try{
        const data = await this.authStore.userRequestController.createFolder(this.folderName)
        this.$emit('new_folder', data);
        this.closeDialog();
      } catch (e) {
        if (Array.isArray(e))
          this.alerts.push(...e);
        else throw "An unexpected error occured while handling folder creation errors";
      } finally {
        this.locked = false;
      }
    },
    reset: function () {
      this.folderName = "";
    }
  }
}
</script>

<style scoped>

</style>