<template>
  <v-speed-dial
      :value="controlsExpanded"
      @input="$emit('input', $event)"
      transition="slide-y-reverse-transition"
      fixed
      bottom
      right
      direction="top"
  >
    <template v-slot:activator>
      <v-fab-transition>
        <v-btn
            color="primary"
            bottom
            right
            fab
        >
          <v-icon v-if="!controlsExpanded">
            mdi-plus
          </v-icon>
          <v-icon v-else>
            mdi-close
          </v-icon>
        </v-btn>
      </v-fab-transition>
    </template>
    <v-btn
        v-for="action of actions"
        :key="action.name"
        fab
        dark
        small
        :color="action.color"
        @click="$emit(action.event)"
    >
      <v-icon v-text="action.icon">
      </v-icon>
    </v-btn>
  </v-speed-dial>
</template>

<script>
export default {
  name: "FloatingControls",
  model: {
    prop: 'controlsExpanded'
  },
  props: {
    controlsExpanded: Boolean,
    actions: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>

</style>