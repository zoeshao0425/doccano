<!--

This is a Vue.js component that displays a combobox for selecting and displaying tags. The selected values are bound to the value prop and emitted when changed using the @change event.

Component Props
value: The array of tags to display and select. It is of type Array<string> and has a default value of an empty array. It is a required prop.
Component Attributes
v-bind="$attrs": This allows any attributes not explicitly defined in the props or template to be passed through to the underlying input element.
:value="value": This binds the selected tag values to the value prop.
:items="value": This binds the list of available tag options to the value prop.
label="Tags": This sets the label text for the combobox to "Tags".
multiple: This enables multiple tag selection.
chips: This displays selected tags as chips.
deletable-chips: This allows the selected tags to be removed by clicking on the chip.
hide-selected: This hides the selected tags from the available tag options.
hide-details: This hides the combobox's details (e.g., helper text and counter).

-->

<template>
  <v-combobox
    v-bind="$attrs"
    :value="value"
    :items="value"
    label="Tags"
    multiple
    chips
    deletable-chips
    hide-selected
    hide-details
    @change="$emit('input', $event)"
  />
</template>

<script lang="ts">
import type { PropType } from 'vue'
import Vue from 'vue'
export default Vue.extend({
  props: {
    value: {
      type: Array as PropType<string[]>,
      default: () => [],
      required: true
    }
  }
})
</script>
