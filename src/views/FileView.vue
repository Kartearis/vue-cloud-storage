<template>
  <div>
    <v-toolbar></v-toolbar>
    <preload-list-view v-if="!loaded"></preload-list-view>
    <file-list-view
        v-else
        :files="files"
        :folders="folders"
        @delete_file="deleteFile($event)"
        @download_file="downloadFile($event)"
    >
    </file-list-view>
<!--    <v-dialog v-model="dialogShown">-->
<!--      <v-card>-->
<!--        <v-card-title>Are you sure?</v-card-title>-->
<!--        <v-card-text>You are about to delete a file. Proceed?</v-card-text>-->
<!--        <v-card-actions>-->
<!--          <v-btn plain color="primary">-->
<!--            Delete-->
<!--          </v-btn>-->
<!--          <v-btn plain>-->
<!--            Cansel-->
<!--          </v-btn>-->
<!--        </v-card-actions>-->
<!--      </v-card>-->
<!--    </v-dialog>-->
  </div>
</template>

<script>
import FileListView from "@/components/FileListView";
import {useAuthStore} from "@/store/authStore";
import PreloadListView from "@/components/PreloadListView";
/**
 * Loads data from server and links concrete file views to controls
 */
export default {
  name: 'FileView',
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data: () => ({
    loaded: false,
    dialogShown: false,
    files: [],
    folders: []
  }),
  methods: {
    deleteFile: function(file) {
      if (file.is_downloading) return;
      this.authStore.userRequestController.deleteFile(file.id)
        .then(() => this.files = this.files.filter((f) => f.id !== file.id))
        .catch((error) => console.debug(error));
    },
    downloadFile: function(file) {
      // Prevent additional downloads
      if (file.is_downloading) return;
      file.is_downloading = true;
      this.authStore.userRequestController.downloadFile(
          file,
          (event) => {
            file.download_progress = event.loaded;
            file.download_total = event.total;
          }
      ).then(() => {
        file.is_downloading = false;
        file.download_total = 0;
        file.download_progress = 0;
      });
    },
    transformFile: function(file) {
      file.expires_at = new Date(file.expires_at);
      file.created_at = new Date(file.created_at);
      file.updated_at = new Date(file.updated_at);
      this.$set(file, 'is_downloading', false);
      this.$set(file, 'download_progress', 0);
      this.$set(file, 'download_total', 0);
    },
    transformFolder: function(folder) {
      folder.created_at = new Date(folder.created_at);
    }
  },
  components: {
    PreloadListView,
    FileListView
  },
  beforeMount: async function () {
    [this.files, this.folders] = await Promise.all([
        this.authStore.userRequestController.getFiles(),
        this.authStore.userRequestController.getFolders()
    ]);
    this.files.forEach(this.transformFile);
    this.folders.forEach(this.transformFolder);
    this.loaded = true;
  }
}
</script>
