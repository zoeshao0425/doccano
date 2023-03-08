<template>
  <!-- A card component to contain the progress information -->
  <v-card>
    <!-- A title for the card -->
    <v-card-title>Member's Progress</v-card-title>
    <!-- A horizontal divider -->
    <v-divider />
    <v-card-text>
      <!-- A loop to display progress information for each member -->
      <div v-for="(item, index) in stats.progress" :key="index" class="mb-2">
        <!-- Display the member name and the number of tasks they have completed out of the total -->
        <span class="font-weight-medium">{{ item.user }}</span>
        <span class="font-weight-medium">{{ item.done }} / {{ stats.total }}</span>
        <!-- A progress bar component to display the completion rate of the member's tasks -->
        <v-progress-linear :value="rate(item.done, stats.total)" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Progress } from '~/domain/models/metrics/metrics'

export default Vue.extend({
  data() {
    // An empty object to hold the progress information of the member
    return {
      stats: {} as Progress
    }
  },

  async created() {
    // Fetch the progress information of the member from the server using the route parameter
    this.stats = await this.$repositories.metrics.fetchMemberProgress(this.$route.params.id)
  },

  methods: {
    // A method to calculate the completion rate of a member's tasks
    rate(done: number, total: number) {
      return (done / total) * 100
    }
  }
})
</script>
