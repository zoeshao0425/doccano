<template>
  <!-- Define a Vuetify card component -->
  <v-card>
    <!-- Define a toolbar component for the card's header -->
    <v-toolbar color="primary white--text" flat>
      <!-- Display the title of the card in the toolbar -->
      <v-toolbar-title>{{ title }}</v-toolbar-title>
    </v-toolbar>
    <!-- Define the main content of the card -->
    <v-card-text class="text--primary mt-3 pl-4">
      <!-- Define a slot named "content" where child components can provide their own content -->
      <slot name="content" />
    </v-card-text>
    <!-- Define the card's actions section -->
    <v-card-actions>
      <!-- Use a spacer to push the buttons to the right -->
      <v-spacer />
      <!-- Define a button with the text provided in the "cancelText" prop, which emits a "cancel" event when clicked -->
      <v-btn
        v-if="cancelText"
        class="text-capitalize"
        text
        color="primary"
        data-test="cancel-button"
        @click="cancel"
      >
        {{ cancelText }}
      </v-btn>
      <!-- Define a button with the text provided in the "agreeText" prop, which emits an "agree" event when clicked -->
      <v-btn
        v-if="agreeText"
        :disabled="disabled"
        class="text-none"
        text
        data-test="delete-button"
        @click="agree"
      >
        {{ agreeText }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    // Define a required "title" prop of type String, which is used for the card's header
    title: {
      type: String,
      default: '',
      required: true
    },
    // Define an optional "cancelText" prop of type String, which is used for the "cancel" button text
    cancelText: {
      type: String,
      default: ''
    },
    // Define an optional "agreeText" prop of type String, which is used for the "agree" button text
    agreeText: {
      type: String,
      default: ''
    },
    // Define an optional "disabled" prop of type Boolean, which is used to disable the "agree" button
    disabled: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    // Define a method that emits an "agree" event when the "agree" button is clicked
    agree() {
      this.$emit('agree')
    },
    // Define a method that emits a "cancel" event when the "cancel" button is clicked
    cancel() {
      this.$emit('cancel')
    }
  }
})
</script>
