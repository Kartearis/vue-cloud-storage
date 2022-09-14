<template>
  <v-container>
    <v-toolbar>
      <v-toolbar-title v-text="currentFolder.name"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn-toggle
        v-model="viewMode"
        group
        mandatory
      >
        <v-btn>
          <v-icon>
            mdi-format-list-bulleted
          </v-icon>
        </v-btn>
        <v-btn>
          <v-icon>
            mdi-dots-grid
          </v-icon>
        </v-btn>
      </v-btn-toggle >
      <v-chip class="ml-4"
          v-text="formattedFolderSize"></v-chip>
    </v-toolbar>
    <component v-bind:is="selectedPreload" v-if="!loaded"></component>
    <component v-bind:is="selectedViewLayout"
        v-else
        :files="files"
        :folders="folders"
        @delete_file="deleteFile($event)"
        @download_file="downloadFile($event)"
        @open_folder="openFolder($event)"
        @rename_file="renameFile($event)"
        @publish_file="publishFile($event)"
        @show_file_dialog="uploadDialogShown = true"
    >
    </component>
    <file-upload-dialog
        v-model="uploadDialogShown"
        :folder-id="folderId ? parseInt(folderId) : -1"
        @new_file="processNewFile"
    ></file-upload-dialog>
    <folder-creation-dialog
      v-model="creationDialogShown"
      @new_folder="processNewFolder"
    >
    </folder-creation-dialog>
    <one-field-dialog
      v-model="auxDialog.shown"
      :on-accept="auxDialog.action"
      :accept-action-title="auxDialog.actionTitle"
      :field-label="auxDialog.fieldLabel"
      :title="auxDialog.title"
      :placeholder="auxDialog.placeholder"
      :readonly="auxDialog.readonly"
      :on-show="auxDialog.onShow"
      :autofocus="auxDialog.autofocus"
    >
    </one-field-dialog>
    <floating-controls
        v-model="controlsExpanded"
        :actions="restrictedControlsActions"
        @show_file_dialog="uploadDialogShown = true"
        @show_folder_dialog="creationDialogShown = true"
    ></floating-controls>

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
  </v-container>
</template>

<script>
import FileListView from "@/components/FileListView";
import FileGridView from "@/components/FileGridView";
import {useAuthStore, fileSizeFormatter} from "@/store/authStore";
import PreloadListView from "@/components/PreloadListView";
import PreloadGridView from "@/components/PreloadGridView";
import FileUploadDialog from "@/components/FileUploadDialog";
import FloatingControls from "@/components/FloatingControls";
import FolderCreationDialog from "@/components/FolderCreationDialog";
import OneFieldDialog from "@/components/OneFieldDialog";

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
    creationDialogShown: false,
    viewMode: null,
    auxDialog: {
      shown: false,
      action: undefined,
      onShow: undefined,
      readonly: false,
      actionTitle: undefined,
      fieldLabel: "",
      title: "",
      placeholder: "",
      autofocus: true
    },
    currentFolder: {
      name: "/",
      size: 0
    },
    error: {
      shown: false,
      text: ""
    },
    controlsExpanded: false,
    controlsActions: [
      {
        name: 'uploadFile',
        icon: 'mdi-file-plus',
        event: 'show_file_dialog',
        color: 'green'
      },
      {
        name: 'createFolder',
        icon: 'mdi-folder-plus',
        event: 'show_folder_dialog',
        color: 'blue'
      }
    ],
    files: [],
    folders: [],
  }),
  computed: {
    selectedViewLayout: function() {
      const layouts = ['FileListView', 'FileGridView'];
      this.authStore.setPreferredFileLayout(this.viewMode);
      return layouts[this.viewMode];
    },
    selectedPreload: function() {
      const preloads = ['PreloadListView', 'PreloadGridView'];
      return preloads[this.viewMode];
    },
    formattedFolderSize: function() {
      return fileSizeFormatter(this.currentFolder.size);
    },
    restrictedControlsActions: function() {
      if (parseInt(this.folderId) === -1)
        return this.controlsActions;
      else return [this.controlsActions.find((a) => a.name === 'uploadFile')];
    }
  },
  methods: {
    renameFile: function(file) {
      this.auxDialog.actionTitle = "Rename";
      this.auxDialog.fieldLabel = "New name";
      this.auxDialog.placeholder = file.name;
      this.auxDialog.readonly = false;
      this.auxDialog.onShow = undefined;
      this.auxDialog.title = "Rename file";
      this.auxDialog.action = async (newName, alerts, closeDialog) => {
        console.log(newName);
        try {
          const result = await this.authStore.userRequestController.renameFile(file.id, newName);
          file.name = result.name;
          file.full_name = result.full_name;
          closeDialog();
        } catch (e) {
          if (Array.isArray(e))
            alerts.push(...e);
          else throw "Unknown error encountered during renaming file";
        }
      };
      this.auxDialog.shown = true;
    },
    publishFile: function(file) {
      this.auxDialog.actionTitle = "Ok";
      this.auxDialog.fieldLabel = "Share link"
      this.auxDialog.placeholder = "";
      this.auxDialog.action = undefined;
      this.auxDialog.readonly = true;
      this.auxDialog.title = "Your public file link:";
      this.auxDialog.onShow = async (dialog) => {
        dialog.progress.inProgress = true;
        try {
          let proxyLink = null;
          if (!file.public_url) {
            const link = await this.authStore.userRequestController.publishFile(file.id);
            proxyLink = this.buildProxyLink(link.link);
            file.public_url = proxyLink;
          }
          dialog.fieldValue = file.public_url;
        } catch (e) {
          dialog.alerts.push(...e);
        }
        dialog.progress.inProgress = false;
      }
      this.auxDialog.shown = true;
    },
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
    processNewFolder: function(folder) {
      this.folders.push(folder);
      this.transformFolder(this.folders[this.folders.length - 1]);
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
      if (file.public_url)
        file.public_url = this.buildProxyLink(file.public_url);
      this.$set(file, 'is_downloading', false);
      this.$set(file, 'download_progress', 0);
      this.$set(file, 'download_total', 0);
    },
    transformFolder: function(folder) {
      folder.created_at = new Date(folder.created_at);
    },
    buildProxyLink: function(publicLink) {
      // Depends on current link format
      const uuid = publicLink.split('/').pop();
      const targetRoute = this.$router.resolve(`/download/${uuid}`);
      const host = `${window.location.protocol}//${window.location.host}`;
      return `${host}/${targetRoute.href}`;
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
    OneFieldDialog,
    FolderCreationDialog,
    FloatingControls,
    FileUploadDialog,
    PreloadListView,
    PreloadGridView,
    FileGridView,
    FileListView
  },
  beforeMount: async function () {
    if (this.authStore.user.preferredFileLayout)
      this.viewMode = this.authStore.user.preferredFileLayout.value;
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
