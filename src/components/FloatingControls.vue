<template>
  <v-speed-dial v-if="actions.length > 1"
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
  <v-fab-transition v-else>
    <v-btn
        :color="actions[0].color"
        fixed
        bottom
        right
        dark
        fab
        @click="$emit(actions[0].event)"
    >
      <v-icon v-text="actions[0].icon">
      </v-icon>
    </v-btn>
  </v-fab-transition>
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
      required: true,
      validator: function (value) {
        return value.length > 0;
      }
    }
  }
}
</script>

<style scoped>

</style>