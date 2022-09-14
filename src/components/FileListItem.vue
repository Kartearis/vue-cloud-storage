<template>
  <v-list-item>
    <v-list-item-avatar>
      <v-icon>{{ fileType.icon }}</v-icon>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title class="file-list-item__title">
        {{ file.name }}
          <v-chip v-if="file.public_url"
                  color="primary"
                  x-small
          >
            Public
          </v-chip>
          <v-chip v-if="file.expires_at"
                  color="warning"
                  x-small
          >
            Temp
          </v-chip>
        </v-list-item-title>
      <v-list-item-subtitle v-if="!file.is_downloading">
        {{ date }}
      </v-list-item-subtitle>
      <v-list-item-subtitle v-else><v-progress-linear :value="progress"></v-progress-linear></v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action class="file-list-item__actions">
      <!-- temporarily disabled -->
<!--      <v-btn-->
<!--          v-if="fileType.type === 'Folder' && file.id !== -1"-->
<!--          icon-->
<!--          @click.stop="showInformation"-->
<!--      >-->
<!--        <v-icon color="grey lighten-1">mdi-information</v-icon>-->
<!--      </v-btn>-->
      <v-btn
          v-if="fileType.type !== 'Folder'"
          icon
          @click.stop="download"
          :disabled="file.is_downloading"
      >
        <v-icon color="grey lighten-1">mdi-download</v-icon>
      </v-btn>
      <v-btn
          v-if="fileType.type !== 'Folder'"
          icon
          @click.stop="renameFile"
      >
        <v-icon color="grey lighten-1">mdi-pencil</v-icon>
      </v-btn>
      <v-btn
          v-if="fileType.type !== 'Folder'"
          icon
          @click.stop="publishFile"
      >
        <v-icon color="grey lighten-1">mdi-share-variant</v-icon>
      </v-btn>
      <v-btn
          v-if="fileType.type !== 'Folder'"
          icon
          @click.stop="deleteFile"
          :disabled="file.is_downloading"
      >
        <v-icon color="red lighten-2">mdi-delete</v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<script>

import FileItemMixin from "@/mixins/fileItemMixin";

export default {
  name: "FileListItem",
  mixins: [FileItemMixin]
}
</script>

<style scoped>
  .file-list-item__actions {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .file-list-item__title {
    display: flex;
    flex-direction: row;
    gap: 5px;
    align-items: center;
  }
</style>