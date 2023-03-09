<!-- The following code is a Vue.js component that renders a confirmation form for removing comments -->
<template>
  <!-- The confirm-form component is used to render the confirmation form -->
  <confirm-form
    :items="selected"
    :title="$t('comments.removeComment')"
    :message="$t('comments.removePrompt')"
    item-key="text"
    @ok="$emit('remove')" <!-- The 'ok' event is emitted when the user confirms the action -->
    @cancel="$emit('cancel')" <!-- The 'cancel' event is emitted when the user cancels the action -->
  />
</template>
<script lang="ts">
import Vue from 'vue'
import ConfirmForm from '@/components/utils/ConfirmForm.vue'

export default Vue.extend({
  components: {
    ConfirmForm
  },

  props: {
    // The selected prop is an array of selected comment items to be removed
    selected: {
      type: Array,
      default: () => []
    }
  }
})
</script>