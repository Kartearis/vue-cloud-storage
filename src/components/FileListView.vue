<template>
  <no-files-card class="ma-5" v-if="!(files && files.length > 0) && !(folders && folders.length > 0)"
    v-on="$listeners"
  >
  </no-files-card>
  <div v-else>
    <v-list subheader v-if="folders && folders.length > 0">
      <v-subheader>Folders</v-subheader>
      <v-list-item-group :value="selection.folder" @change="updateSelection('folder', $event)">
        <file-list-item
            v-for="folder of folders"
            :key="folder.id"
            :file="folder"
            :type="'folder'"
            v-on="$listeners"
        >
        </file-list-item>
      </v-list-item-group>
    </v-list>
    <v-divider></v-divider>
    <v-list subheader v-if="files && files.length > 0">
      <v-subheader>Files</v-subheader>
      <v-list-item-group :value="selection.file" @change="updateSelection('file', $event)">
        <file-list-item
            v-for="file of files"
            :key="file.id"
            :file="file"
            v-on="$listeners"
        >
        </file-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script>
import NoFilesCard from "@/components/NoFilesCard";
import FileListItem from "@/components/FileListItem";
import FileLayoutMixin from "@/mixins/fileLayoutMixin";

// v-on="$listeners" could be replaced with global state if more cases like this arise
export default {
  name: "FileListView",
  components: {
    NoFilesCard,
    FileListItem
  },
  mixins: [FileLayoutMixin]
}
</script>

<style scoped>

</style>