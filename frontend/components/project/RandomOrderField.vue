<!--
This is a Vue component that represents a checkbox used for toggling a boolean value. It accepts a boolean value as a prop and emits an input event with a boolean value when its state changes. The component uses the Vue Checkbox component and binds its props to the value prop passed to this component.

Props
value: A boolean value that is used to set the initial state of the checkbox. This prop is required.
Events
input: This event is emitted when the checkbox state changes. It contains a boolean value indicating whether the checkbox is checked or unchecked.

-->


<template>
  <v-checkbox
    v-bind="$attrs"
    :value="value"
    :label="$t('overview.randomizeDocOrder')"
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
