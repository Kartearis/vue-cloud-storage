<template>
  <no-files-card class="ma-5" v-if="!(files && files.length > 0) && !(folders && folders.length > 0)"
                 v-on="$listeners"
  >
  </no-files-card>
  <div v-else class="file-grid-view">
    <file-grid-item
        v-for="folder of folders" :key="folder.id"
        :file="folder"
        :type="'folder'"
        v-on="$listeners"
    >
    </file-grid-item>
    <file-grid-item
        v-for="file of files"
        :key="file.id"
        :file="file"
        v-on="$listeners"
    >
    </file-grid-item>
  </div>
</template>

<script>
import FileGridItem from "@/components/FileGridItem";
import NoFilesCard from "@/components/NoFilesCard";
import fileLayoutMixin from "@/mixins/fileLayoutMixin";
export default {
  name: "FileGridView",
  mixins: [fileLayoutMixin],
  components: {
    FileGridItem,
    NoFilesCard
  }
}
</script>

<style scoped>
  .file-grid-view {
    --columns: 1;
    display: grid;
    grid-template-columns: repeat(var(--columns), 1fr);
    gap: 32px;
    padding-top: 16px;
  }
  
  @media (min-width: 600px) {
    .file-grid-view {
      --columns: 2;
    }
  }

  @media (min-width: 960px) {
    .file-grid-view {
      --columns: 3;
    }
  }

  @media (min-width: 1264px) {
    .file-grid-view {
      --columns: 4;
    }
  }
</style>