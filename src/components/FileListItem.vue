<template>
  <v-list-item>
    <v-list-item-avatar>
      <v-icon>mdi-folder</v-icon>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title v-text="file.name"></v-list-item-title>
      <v-list-item-subtitle v-text="file.updated_at"></v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action>
      <v-btn icon>
        <v-icon color="grey lighten-1">mdi-information</v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
export default {
  name: "FileListItem",
  props: {
    type: {
      type: String,
      default: 'file'
    },
    file: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

</style>