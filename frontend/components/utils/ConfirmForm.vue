<template>
  <!-- render a BaseCard component with the following props and listeners -->
  <base-card
    :title="title"
    :agree-text="buttonTrueText"
    :cancel-text="buttonFalseText"
    @agree="ok"
    @cancel="cancel"
  >
    <template #content>
      <!-- display the message passed as a prop -->
      {{ message }}
      <!-- if "items" prop is provided, render a list of items with "itemKey" as the key -->
      <v-list dense v-if="items.length">
        <v-list-item v-for="(item, i) in items" :key="i">
          <v-list-item-content>
            <v-list-item-title>{{ item[itemKey] }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>
  </base-card>
</template>

<script lang="ts">
import Vue from 'vue'
import BaseCard from './BaseCard.vue'

export default Vue.extend({
  components: {
    BaseCard
  },

  props: {
    title: {
      type: String,
      default: '',
      required: true
    },
    message: {
      type: String,
      default: '',
      required: true
    },
    items: {
      type: Array,
      default: () => [],
      required: false
    },
    itemKey: {
      type: String,
      default: '',
      required: false
    },
    buttonTrueText: {
      type: String,
      default: 'Yes'
    },
    buttonFalseText: {
      type: String,
      default: 'Cancel'
    }
  },

  methods: {
    ok() {
      // emit the "ok" event to the parent component
      this.$emit('ok')
    },
    cancel() {
      // emit the "cancel" event to the parent component
      this.$emit('cancel')
    }
  }
})
</script>
