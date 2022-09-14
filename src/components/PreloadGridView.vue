<template>
  <div class="preload-grid">
    <v-skeleton-loader
        v-for="index in 10" :key="index"
        class=""
        type="card, actions">
    </v-skeleton-loader>
  </div>
</template>

<script>
export default {
  name: "PreloadGridView"
}
</script>

<style scoped>
.preload-grid {
  --columns: 1;
  display: grid;
  grid-template-columns: repeat(var(--columns), 1fr);
  gap: 32px;
  padding-top: 16px;
}

@media (min-width: 600px) {
  .preload-grid {
    --columns: 2;
  }
}

@media (min-width: 960px) {
  .preload-grid {
    --columns: 3;
  }
}

@media (min-width: 1264px) {
  .preload-grid {
    --columns: 4;
  }
}
</style>