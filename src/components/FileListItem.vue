<template>
  <v-list-item>
    <v-list-item-avatar>
      <v-icon>{{ fileType.icon }}</v-icon>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title v-text="file.name"></v-list-item-title>
      <v-list-item-subtitle v-text="file.updated_at.toLocaleString()"></v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action>
      <v-btn icon>
        <v-icon color="grey lighten-1">mdi-information</v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<script>

const fileTypes = [
  {
    type: 'Image',
    regex: /jpe?g|a?png|kra|gif|psd|tiff|avif|webp|bmp|ico/i,
    icon: 'mdi-file-image'
  },
  {
    type: 'Video',
    regex: /avi|mpe?g|mkv|m4v/i,
    icon: 'mdi-file-video'
  },
  {
    type: 'Audio',
    regex: /mp3|m4a|flac|alac|wav/i,
    icon: 'mdi-file-music'
  },
  {
    type: 'Archive',
    regex: /zipp?|rar|tar|gz/i,
    icon: 'mdi-zip-box'
  },
  {
    type: 'Text',
    regex: /txt|rtf|md/i,
    icon: 'mdi-file-document-outline'
  },
  {
    type: 'Document',
    regex: /docx?|odf|odt|pages/i,
    icon: 'mdi-file-document'
  },
  {
    type: 'PDF',
    regex: /pdf/i,
    icon: 'mdi-file-pdf-box'
  },
  {
    type: 'Table',
    regex: /xlsx?|ods|csv/i,
    icon: 'mdi-file-table'
  },
  {
    type: 'Code',
    regex: /c(pp)?|h(pp)?|jsx?|tsx?|pyc?/i,
    icon: 'mdi-file-code'
  },
  {
    type: 'Folder',
    regex: /folder/i,
    icon: 'mdi-folder'
  },
  {
    type: 'Unknown',
    regex: /.*/i,
    icon: 'mdi-document-question'
  }
];

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
  },
  methods: {
    getExtension: function(file) {
      const parts = file.split('.');
      if (parts.length > 1)
        return parts.pop();
      return "";
    }
  },
  computed: {
    fileType: function() {
      const fileExtension = this.type === 'folder' ? 'folder' : this.getExtension(this.file.full_name);
      return fileTypes.find((type) => type.regex.test(fileExtension));
    }
  }
}
</script>

<style scoped>

</style>