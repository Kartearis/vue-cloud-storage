<template>
  <no-files-card class="ma-5" v-if="!(files && files.length > 0) && !(folders && folders.length > 0)">
  </no-files-card>
  <div v-else>
    <v-list subheader v-if="folders && folders.length > 0">
      <v-subheader>Folders</v-subheader>
      <v-list-item-group :value="selection.folder" @change="updateSelection('folder', $event)">
        <file-list-item v-for="folder of folders" :key="folder.id" :file="folder" :type="'folder'">
        </file-list-item>
      </v-list-item-group>
    </v-list>
    <v-divider></v-divider>
    <v-list subheader v-if="files && files.length > 0">
      <v-subheader>Files</v-subheader>
      <v-list-item-group :value="selection.file" @change="updateSelection('file', $event)">
        <file-list-item v-for="file of files" :key="file.id" :file="file">
        </file-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script>
import NoFilesCard from "@/components/NoFilesCard";
import FileListItem from "@/components/FileListItem";

export default {
  name: "FileListView",
  components: {
    NoFilesCard,
    FileListItem
  },
  data: () => ({
    selection: {
      folder: null,
      file: null
    }
  }),
  props: {
    files: Array,
    folders: Array
  },
  methods: {
    updateSelection: function(key, value) {
      Object.keys(this.selection)
        .filter((k) => k !== key)
        .forEach((k) => this.selection[k] = null);
      this.selection[key] = value;
    }
  }
}
</script>

<style scoped>

</style>