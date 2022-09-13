<template>
  <v-menu
      offset-y
      v-model="menu"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
          label="Expire date"
          prepend-icon="mdi-calendar"
          :value="value.toLocaleDateString()"
          v-bind="attrs"
          v-on="on"
          readonly
      ></v-text-field>
    </template>
    <v-date-picker
        no-title
        :min="min ? min.toISOString() : undefined"
        :max="max ? max.toISOString() : undefined"
        :value="value.toISOString()"
        @input="$emit('input', new Date($event))"
    >
    </v-date-picker>
  </v-menu>
</template>

<script>
export default {
  name: "DateInput",
  props: {
    value: Date,
    min: Date,
    max: Date
  },
  data: () => ({
    menu: false
  })
}
</script>

<style scoped>

</style>