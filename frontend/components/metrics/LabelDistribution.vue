<template>
  <!-- A card to contain the label distributions -->
  <v-card>
    <!-- The title of the card, set to the value of the "title" prop -->
    <v-card-title v-text="title" />
    <!-- A divider to separate the title from the tabs -->
    <v-divider />
    <!-- Tabs to display each user's label distribution -->
    <v-tabs show-arrows>
      <!-- For each user, create a tab with their name -->
      <v-tab v-for="(value, user) in chartJSFormat" :key="user" class="text-capitalize">
        {{ user }}
      </v-tab>
      <!-- For each user, create a tab item with the bar chart -->
      <v-tab-item v-for="(value, user) in chartJSFormat" :key="user">
        <v-card-text>
          <!-- Render the bar chart with the data in the "value" object -->
          <bar-chart :chart-data="value" />
        </v-card-text>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import Vue from 'vue'
import BarChart from '@/components/metrics/ChartBar.vue'
import { Distribution } from '~/domain/models/metrics/metrics'
import { LabelDTO } from '~/services/application/label/labelData'

export default Vue.extend({
  components: {
    BarChart
  },

  // Define the props that this component expects
  props: {
    // The title of the card
    title: {
      type: String,
      required: true,
      default: 'Distribution'
    },
    // The label distribution data for each user
    distribution: {
      type: Object as PropType<Distribution>,
      required: true
    },
    // An array of LabelDTO objects for setting the colors of the chart
    labelTypes: {
      type: Array as PropType<LabelDTO[]>,
      default: () => [],
      required: true
    }
  },

  computed: {
    // A mapping of label text to label background color
    colorMapping(): { [text: string]: string } {
      return Object.fromEntries(
        this.labelTypes.map((labelType) => [labelType.text, labelType.backgroundColor])
      )
    },

    // The label distribution data formatted for use by the BarChart component
    chartJSFormat(): any {
      // Create an empty object to hold the formatted data for each user
      const data: { [user: string]: { labels: string[]; datasets: any[] } } = {}
      // For each user in the distribution data, format the data for use in the bar chart
      for (const user in this.distribution) {
        // Get the labels for the current user, sort them alphabetically
        const labels = Object.keys(this.distribution[user])
        labels.sort()
        // Get the counts for each label, corresponding to the sorted labels
        const counts = labels.map((label) => this.distribution[user][label])
        // Get the colors for each label, using the colorMapping computed property
        const colors = labels.map((label) =>
          label in this.colorMapping ? this.colorMapping[label] : '#00d1b2'
        )
        // Add the formatted data for the current user to the data object
        data[user] = {
          labels,
          datasets: [
            {
              // Set the title of the bar chart to the title prop
              title: this.title,
              backgroundColor: colors,
              data: counts
            }
          ]
        }
      }
      return data
    }
  }
})
</script>
