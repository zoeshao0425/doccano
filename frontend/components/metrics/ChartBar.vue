<script>
// Importing necessary modules from Vue Chart.js library
import { HorizontalBar, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

// Exporting Vue.js component
export default {
  // Extending the HorizontalBar class from Vue Chart.js library
  extends: HorizontalBar,
  // Using the reactiveProp mixin to enable reactivity for props
  mixins: [reactiveProp],
  // Defining props for the component
  props: {
    // chartData prop is an object and is required
    chartData: {
      type: Object,
      default: () => {},
      required: true
    }
  },

  // Defining the data for the component
  data() {
    // options object defines the chart options for the component
    return {
      options: {
        scales: {
          yAxes: [
            {
              barPercentage: 0.3 // bar width as a percentage of available space
            }
          ],
          xAxes: [
            {
              ticks: {
                beginAtZero: true, // start x-axis from zero
                min: 0 // minimum value for x-axis
              }
            }
          ]
        },
        maintainAspectRatio: false, // maintain aspect ratio of the chart
        legend: {
          display: false // hide the legend
        }
      }
    }
  },

  // When the component is mounted, render the chart with the chart data and options
  mounted() {
    this.renderChart(this.chartData, this.options)
  }
}
</script>
