<template>
  <div class="preload-list">
    <v-skeleton-loader
      v-for="index in 10" :key="index"
      class="preload-list__loader"
      type="avatar, text@2, button">
    </v-skeleton-loader>
  </div>
</template>

<script>
export default {
  name: "PreloadListView"
}
</script>

<!--suppress CssInvalidPseudoSelector -->
<style scoped>
  .preload-list {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .preload-list__loader {
    display: grid;
    grid-template-rows: 25px 25px;
    grid-template-columns: min(80px, 20%) 1fr min(20%, 150px);
    justify-items: center;
    align-items: center;
  }

  .preload-list__loader:deep(.v-skeleton-loader__avatar) {
    grid-row: 1 / span2;
    grid-column: 1;
    border-radius: 10px;
    height: 80%;
    width: 80%;
  }

  .preload-list__loader:deep(.v-skeleton-loader__text) {
    margin: 0;
    grid-column: 2;
    height: 60%;
    width: 100%;
    align-self: center;
  }

  .preload-list__loader:deep(.v-skeleton-loader__button) {
    grid-row: 1 / span2;
    grid-column: 3;
    width: 80%;
    height: 80%;
  }
</style>