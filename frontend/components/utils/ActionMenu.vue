<template>
  <!-- Render a Vuetify menu with a button that displays a dropdown of actions -->
  <v-menu offset-y open-on-hover>
    <template #activator="{ on }">
      <!-- Render a Vuetify button that displays the text prop and a dropdown icon -->
      <v-btn color="primary text-capitalize" v-on="on">
        {{ text }}
        <v-icon>{{ mdiMenuDown }}</v-icon>
      </v-btn>
    </template>
    <!-- Render a Vuetify list of items, where each item has an icon, title, and event to emit on click -->
    <v-list>
      <v-list-item v-for="(item, index) in items" :key="index" @click="$emit(item.event)">
        <v-list-item-icon>
          <!-- Render a Vuetify icon based on the item's icon prop -->
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue'
import { mdiMenuDown } from '@mdi/js'

export default Vue.extend({
  props: {
    // The text to display in the button that opens the dropdown menu
    text: {
      type: String,
      default: 'Actions'
    },
    // An array of objects that define each item in the dropdown menu
    items: {
      type: Array,
      default: () => [],
      required: true
    }
  },

  data() {
    return {
      // A reference to the mdiMenuDown icon from the @mdi/js package
      mdiMenuDown
    }
  }
})
</script>
