<!--
This is a Vue.js component for rendering a project name text field. The component accepts a "value" prop for setting the initial value of the text field, and emits an "input" event with the updated value whenever the user types into the field.

The text field is required and has two validation rules for the project name. The validation rules are defined in the data section of the component and imported from the domain/models/project/project file. The component displays an error message for each validation rule if the user enters invalid input.
-->

<template>
  <v-text-field
    v-bind="$attrs"
    :value="value"
    :rules="projectNameRules"
    :label="$t('overview.projectName')"
    required
    @input="$emit('input', $event)"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import { validateMinLength, validateNameMaxLength } from '~/domain/models/project/project'

export default Vue.extend({
  props: {
    value: {
      type: String,
      default: '',
      required: true
    }
  },
  data() {
    return {
      projectNameRules: [
        (text: string) => validateMinLength(text) || this.$t('rules.projectName.required'),
        (text: string) => validateNameMaxLength(text) || this.$t('rules.projectName.maxLength')
      ]
    }
  }
})
</script>
