<template>
  <!-- This is the stepper header -->
  <v-stepper-header>
    <!-- Step 1: Select a template -->
    <v-stepper-step :complete="step > 1" step="1"> Select a template </v-stepper-step>
    <v-divider />
    <!-- Step 2: Set parameters -->
    <v-stepper-step :complete="step > 2" step="2"> Set parameters </v-stepper-step>
    <v-divider />
    <!-- Step 3: Set a template -->
    <v-stepper-step :complete="step > 3" step="3"> Set a template </v-stepper-step>
    <v-divider />
    <!-- Step 4: Set mappings -->
    <v-stepper-step :complete="step > 4" step="4"> Set mappings </v-stepper-step>
  </v-stepper-header>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    // The current step of the stepper
    step: {
      type: Number,
      default: 1,
      required: true
    }
  }
})
</script>
