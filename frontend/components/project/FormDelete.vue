<template>
  <!-- Create a base card component with title, agree text, cancel text, and event listeners -->
  <base-card
    :title="$t('overview.deleteProjectTitle')"
    :agree-text="$t('generic.yes')"
    :cancel-text="$t('generic.cancel')"
    @agree="$emit('remove')"
    @cancel="$emit('cancel')"
  >
    <!-- Render the content of the base card component -->
    <template #content>
      <!-- Show a message for deleting the project -->
      {{ $t('overview.deleteProjectMessage') }}
      <!-- Create a dense list with v-for loop to iterate through selected project items -->
      <v-list dense>
        <v-list-item v-for="(item, i) in selected" :key="i">
          <v-list-item-content>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>
  </base-card>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import Vue from 'vue'
import BaseCard from '@/components/utils/BaseCard.vue'
import { Project } from '~/domain/models/project/project'

export default Vue.extend({
  // Import BaseCard component
  components: {
    BaseCard
  },

  props: {
    // Define selected as an array of Project objects
    selected: {
      type: Array as PropType<Project[]>,
      default: () => []
    }
  }
})
</script>
