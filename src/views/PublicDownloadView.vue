<template>
  <v-container>
    <v-card>
      <v-card-title>Public file download</v-card-title>
      <v-card-text>
        <p>
          Your file download should have been started.
        </p>
      </v-card-text>
      <v-card-actions>
        <v-btn
          v-if="authStore.isAuthorized"
          plain
          @click="toFiles">
          Go to files
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
            plain
            color="primary"
            @click="downloadFile"
        >
          Retry
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import PublicRequestController from "@/controllers/publicRequestController";
import {useAuthStore} from "@/store/authStore";

export default {
  name: "PublicDownloadView",
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  props: {
    uuid: String
  },
  methods: {
    downloadFile: function() {
      const requestController = new PublicRequestController('http://markwebdev.ru/api/v1');
      requestController.downloadPublicFile(this.uuid);
    },
    toFiles: function() {
      if (this.authStore.isAuthorized)
        this.$router.push('/');
      else this.$router.push('/auth');
    }
  },
  mounted() {
    this.downloadFile();
  }
}
</script>

<style scoped>

</style>