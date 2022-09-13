<template>
  <v-menu
      offset-y
      v-model="menu"
      :close-on-content-click="false"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
          label="Expire time"
          prepend-icon="mdi-clock-time-four-outline"
          :value="value.toLocaleTimeString()"
          v-bind="attrs"
          v-on="on"
          readonly
      ></v-text-field>
    </template>
    <v-time-picker
        v-if="menu"
        no-title
        format="24hr"
        :value="time"
        @input="emitTime"
        @click:minute="menu = false"
    >
    </v-time-picker>
  </v-menu>
</template>

<script>
export default {
  name: "TimeInput",
  props: {
    value: Date
  },
  data: () => ({
    menu: false,
    innerTime: new Date(0)
  }),
  computed: {
    time: function () {
      return `${this.value.getHours().toString().padStart(2,'0')}:${this.value.getMinutes().toString().padStart(2, '0')}`;
    }
  },
  methods: {
    emitTime: function (time) {
      const [hours, minutes] = time.split(':').map((part) => parseInt(part));
      // Create new object so Vue reactivity works
      const newDate = new Date(this.innerTime.getTime());
      if (!Number.isNaN(hours))
        newDate.setHours(hours);
      if (!Number.isNaN(minutes))
        newDate.setMinutes(minutes);
      this.$emit('input', newDate);
    }
  }
}
</script>

<style scoped>

</style>