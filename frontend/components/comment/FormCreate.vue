<!-- The following code is a Vue.js component for a comment input form -->
<template>
  <!-- The v-form element represents a form that can validate user input -->
  <v-form v-model="valid">
    <!-- The v-textarea element is a multi-line input for the comment message -->
    <v-textarea
      v-model="message"
      auto-grow
      hide-details
      outlined
      rows="1"
      name="CommentInput"
      :label="$t('comments.message')"
      :rules="commentRules"
    />
    <!-- The v-btn element is a button that triggers the addComment method when clicked -->
    <v-btn
      class="white--text text-capitalize mt-3"
      color="primary"
      depressed
      :disabled="!valid"
      @click="addComment"
    >
      {{ $t('comments.send') }}
    </v-btn>
  </v-form>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    // The commentRules array defines a validation rule for the comment message
    return {
      commentRules: [(v: string) => !!v.trim() || 'Comment is required'],
      message: '', // The message variable holds the value of the comment message input
      valid: false // The valid variable indicates if the form is valid or not
    }
  },

  methods: {
    // The addComment method emits an event with the comment message and resets the input
    addComment() {
      this.$emit('add-comment', this.message)
      this.message = ''
    }
  }
})
</script> 
