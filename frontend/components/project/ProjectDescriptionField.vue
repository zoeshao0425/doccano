<template>
  <!-- Render a v-text-field component -->
  <v-text-field
    v-bind="$attrs"     <!-- Pass all unspecified attributes to the v-text-field component-->
    :value="value"      <!-- Bind the 'value' prop to the input value -->
    :rules="descriptionRules"  <!-- Bind the 'descriptionRules' data property to the validation rules -->
    :label="$t('generic.description')"  <!-- Set the label of the input to 'Description' -->
    required            <!-- Mark the input as required -->
    @input="$emit('input', $event)"  <!-- Emit an 'input' event with the current value when the input changes -->
  />
</template>

<script lang="ts">
import Vue from 'vue'
import { validateMinLength } from '~/domain/models/project/project'

export default Vue.extend({
  props: {
    value: {
      type: String,
      default: '',
      required: true  <!-- Require a non-empty string as the 'value' prop -->
    }
  },
  data() {
    return {
      descriptionRules: [
        // Define a validation rule that requires the input value to have at least the minimum length
        (text: string) => validateMinLength(text) || this.$t('rules.description.required')
      ]
    }
  }
})
</script>
