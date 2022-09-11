<template>
  <v-list
      nav
  >
    <v-subheader>Navigation</v-subheader>
    <v-list-item-group
        v-model="selectedItem"
        color="primary"
    >
      <v-list-item
          v-for="(item, i) in items"
          :key="i"
      >
        <v-list-item-icon>
          <v-icon v-text="item.icon"></v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="item.text"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
export default {
  name: "AppNavigation",
  props: {
    items: {
      type: Array,
      default: () => ([])
    }
  },
  data: () => ({
    selectedItem: null
  })
}
</script>

<style scoped>

</style>