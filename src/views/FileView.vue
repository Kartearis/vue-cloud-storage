<template>
  <div>
    <v-toolbar>
      <v-toolbar-title v-text="currentFolder.name"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-chip v-text="formattedFolderSize"></v-chip>
    </v-toolbar>
    <preload-list-view v-if="!loaded"></preload-list-view>
    <file-list-view
        v-else
        :files="files"
        :folders="folders"
        @delete_file="deleteFile($event)"
        @download_file="downloadFile($event)"
        @open_folder="openFolder($event)"
    >
    </file-list-view>
    <file-upload-dialog
        v-model="uploadDialogShown"
        :folder-id="folderId ? parseInt(folderId) : -1"
        @new_file="processNewFile"
    ></file-upload-dialog>
    <v-fab-transition>
      <v-btn
          color="primary"
          fixed
          bottom
          right
          fab
          @click="uploadDialogShown = true"
      >
        <v-icon>
          mdi-plus
        </v-icon>
      </v-btn>
    </v-fab-transition>
    <v-snackbar
        v-model="error.shown"
        timeout="2000"
    >
      {{ error.text }}

      <template v-slot:action="{ attrs }">
        <v-btn
            color="primary"
            text
            v-bind="attrs"
            @click="error.shown = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import FileListView from "@/components/FileListView";
import {useAuthStore, fileSizeFormatter} from "@/store/authStore";
import PreloadListView from "@/components/PreloadListView";
import FileUploadDialog from "@/components/FileUploadDialog";
/**
 * Loads data from server and links concrete file views to controls
 */
export default {
  name: 'FileView',
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  props: {
    folderId: {
      type: String,
      default: "-1"
    }
  },
  data: () => ({
    loaded: false,
    uploadDialogShown: false,
    currentFolder: {
      name: "/",
      size: 0
    },
    error: {
      shown: false,
      text: ""
    },
    files: [],
    folders: []
  }),
  computed: {
    formattedFolderSize: function() {
      return fileSizeFormatter(this.currentFolder.size);
    }
  },
  methods: {
    deleteFile: async function(file) {
      if (file.is_downloading) return;
      const answer = await this.$confirm(`Do you really want to delete ${file.name}?`, {
        title: 'Delete file',
        color: 'primary',
        icon: 'mdi-help'
      });
      if (answer === true)
        try {
          await this.authStore.userRequestController.deleteFile(file.id);
          this.removeFileFromView(file);
        } catch(error) {
          this.error.text = error.toString();
          this.error.shown = true;
          this.removeFileFromView(file);
        }
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
      }).catch((error) => {
        this.error.text = error.toString();
        this.error.shown = true;
        this.removeFileFromView(file);
      });
    },
    openFolder: function(folder) {
      this.$router.push(`/${folder.id}`);
    },
    processNewFile: function(file) {
      this.files.push(file);
      this.transformFile(this.files[this.files.length - 1]);
      this.updateStorage(file.size);
    },
    updateStorage: function(amount) {
      this.authStore.updateStorageTaken(amount);
      if (this.folderId !== -1)
        this.currentFolder.size += amount;
    },
    removeFileFromView: function(file) {
      this.files = this.files.filter((f) => f.id !== file.id);
      this.updateStorage(-file.size);
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
    },
    loadData: async function(folderId) {
      if (folderId !== '-1') {
        try {
          this.currentFolder = await this.authStore.userRequestController.getFolder(folderId);
        } catch (e) {
          // If unknown folder id encountered navigate to root
          this.$router.push('/');
          return;
        }
      }
      else {
        this.currentFolder = {
          name: '/',
          size: this.authStore.user.storageInUse.value
        }
      }

      [this.files, this.folders] = await Promise.all([
        this.authStore.userRequestController.getFiles(folderId),
        Number(folderId) === -1 ? this.authStore.userRequestController.getFolders() : [{
          id: -1,
          name: ".."
        }]
      ]);
      this.files.forEach(this.transformFile);
      this.folders.forEach(this.transformFolder);
      this.loaded = true;
    }
  },
  components: {
    FileUploadDialog,
    PreloadListView,
    FileListView
  },
  beforeMount: async function () {
    await this.loadData(this.folderId);
  },
  beforeRouteUpdate: async function(to, from, next) {
    if (to.name === from.name && to.params.folderId !== from.params.folderId){
      await this.loadData(to.params.folderId ?? "-1");
      next();
    }
    else next();
  }
}
</script>
