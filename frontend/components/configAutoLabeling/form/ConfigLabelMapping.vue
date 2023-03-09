<template>
  <!-- This is the content of the fourth step in the stepper -->
  <v-stepper-content step="4">
    <v-card>
      <v-card-text class="pa-0">
        <!-- Configure label mappings -->
        <h4 class="text-h6">Configure label mappings</h4>
        <p class="font-weight-regular body-1">
          <!-- Explanation of what needs to be done -->
          Once you fetch the API response, you need to convert the label in the response into the
          one which you defined at the label page.
        </p>
        <!-- Response section -->
        <h4 class="text-h6">Response</h4>
        <v-sheet :dark="!$vuetify.theme.dark" :light="$vuetify.theme.dark" class="mb-5 pa-5">
          <!-- JSON representation of the API response -->
          <pre>{{ JSON.stringify(response, null, 4) }}</pre>
        </v-sheet>
        <!-- Label mapping component -->
        <label-mapping v-model="mapping" />
        <!-- Error messages -->
        <v-alert v-for="(error, index) in errorMessages" :key="index" prominent type="error">
          <v-row align="center">
            <v-col class="grow">
              <!-- Display error message -->
              {{ error }}
            </v-col>
          </v-row>
        </v-alert>
        <!-- Result section -->
        <h4 class="text-h6">Result</h4>
        <v-sheet :dark="!$vuetify.theme.dark" :light="$vuetify.theme.dark" class="mb-5 pa-5">
          <!-- JSON representation of the result after label mapping -->
          <pre>{{ JSON.stringify(result, null, 4) }}</pre>
        </v-sheet>
      </v-card-text>
      <v-card-actions class="pa-0">
        <v-spacer />
        <!-- Button to go to the previous step -->
        <v-btn text class="text-capitalize" @click="$emit('prev')"> Prev </v-btn>
        <!-- Button to test the label mappings -->
        <v-btn v-show="!isPassed" color="primary" class="text-capitalize" @click="$emit('onTest')">
          Test
        </v-btn>
        <!-- Button to finish the stepper -->
        <v-btn v-show="isPassed" color="success" class="text-capitalize" @click="$emit('next')">
          Finish
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-stepper-content>
</template>

<script lang="ts">
import Vue from 'vue'
import LabelMapping from './LabelMapping.vue'

export default Vue.extend({
  components: {
    LabelMapping
  },

  props: {
    // The selected label mappings
    value: {
      type: Array,
      default: () => [],
      required: true
    },
    // Error messages related to label mappings
    errorMessages: {
      type: Array,
      default: () => [],
      required: true
    },
    // Boolean value to check if label mappings have passed the test
    isPassed: {
      type: Boolean,
      default: false,
      required: true
    },
    // The API response in string, object or array format
    response: {
      type: [String, Object, Array],
      default: () => [],
      required: true
    },
    // The result after label mapping
    result: {
      type: Array,
      default: () => [],
      required: true
    }
  },

  computed: {
    mapping: {
      get() {
        // @ts-ignore
        return this.value
      },
      set(newVal) {
        // @ts-ignore
        this.$emit('input', newVal)
      }
    }
  }
})
</script>
