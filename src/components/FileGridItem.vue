<template>
  <v-card
      class="file-grid-item"
      @click="$emit('click')"
  >
    <v-icon size="100">
      {{ fileType.icon }}
    </v-icon>
    <v-card-title class="file-grid-item__title">
      {{shortenedName}}
      <v-chip-group>
        <v-chip
            v-if="file.public_url"
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
      </v-chip-group>
    </v-card-title>
    <v-card-text v-if="!file.is_downloading" class="file-grid-item__text">
      {{ date }}
    </v-card-text>
    <v-card-text v-else>
      <v-progress-linear :value="progress">
      </v-progress-linear>
    </v-card-text>
    <v-spacer></v-spacer>
    <v-card-actions>
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
    </v-card-actions>
  </v-card>
</template>

<script>
import fileItemMixin from "@/mixins/fileItemMixin";

export default {
  name: "FileGridItem",
  mixins: [fileItemMixin],
  computed: {
    shortenedName: function() {
      let cut = this.file.name.slice(0, 30);
      if (cut.length < this.file.name.length)
        cut += "...";
      return cut;
    }
  }
}
</script>

<style scoped>
  .file-grid-item {
    display: flex;
    padding: 10px;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  .file-grid-item__title {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }

  .file-grid-item__text {
    text-align: center;
  }
</style>