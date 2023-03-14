<!--

This component renders a checkbox that allows the user to toggle the state of a boolean value indicating whether to share annotations with others or not.

Props
value (required): a boolean value representing whether annotations should be shared or not.
Events
input: emitted whenever the checkbox state changes. The new value is passed as a boolean.

-->




<template>
  <v-checkbox
    v-bind="$attrs"
    :value="value"
    :label="$t('overview.shareAnnotations')"
    @change="$emit('input', $event === true)"
  />
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    value: {
      type: Boolean,
      default: false,
      required: true
    }
  }
})
</script>
