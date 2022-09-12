<template>
  <div>
    <v-toolbar></v-toolbar>
    <preload-list-view v-if="!loaded"></preload-list-view>
    <file-list-view v-else :files="files" :folders="folders"></file-list-view>
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
    files: [],
    folders: []
  }),
  methods: {

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
    this.loaded = true;
  }
}
</script>