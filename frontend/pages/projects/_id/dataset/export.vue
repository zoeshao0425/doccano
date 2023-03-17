<template>
  <v-card>
    <v-card-title>
      {{ $t('dataset.exportDataTitle') }}
    </v-card-title>
    <v-card-text>
      <!-- A progress spinner is displayed while the download request is being processed -->
      <v-overlay :value="isProcessing">
        <v-progress-circular indeterminate size="64" />
      </v-overlay>
      <!-- a form with a select dropdown for choosing the file format -->
      <v-form ref="form" v-model="valid">
        <v-select
          v-model="selectedFormat"
          :items="formats"
          hide-details="auto"
          item-text="name"
          label="File format"
          outlined
          :rules="fileFormatRules($t('rules.fileFormatRules'))"
        />
        <!-- an example of the selected format is displayed in a preformatted sheet -->
        <v-sheet
          v-if="selectedFormat"
          :dark="!$vuetify.theme.dark"
          :light="$vuetify.theme.dark"
          class="mt-2 pa-5"
        >
          <pre>{{ example }}</pre>
        </v-sheet>
        <!-- a checkbox for exporting only approved documents -->
        <v-checkbox v-model="exportApproved" label="Export only approved documents" hide-details />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <!-- a button for initiating the download request -->
      <v-btn class="text-capitalize ms-2 primary" :disabled="!valid" @click="downloadRequest">
        {{ $t('generic.export') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { fileFormatRules } from '@/rules/index'
import { Format } from '~/domain/models/download/format'

export default Vue.extend({
  layout: 'project',

  // Validate that the project ID is a string of digits
  validate({ params }) {
    return /^\d+$/.test(params.id)
  },

  // Initialize component data
  data() {
    return {
      exportApproved: false,
      file: null,
      fileFormatRules,
      formats: [] as Format[],
      isProcessing: false,
      polling: null,
      selectedFormat: null as any,
      taskId: '',
      valid: false
    }
  },

  computed: {
    // Get the project ID from the route params
    projectId() {
      return this.$route.params.id
    },

    // Get the example string for the selected format
    example(): string {
      const item = this.formats.find((item: Format) => item.name === this.selectedFormat)
      return item!.example.trim()
    }
  },

  // Load the list of available download formats on component creation
  async created() {
    this.formats = await this.$repositories.downloadFormat.list(this.projectId)
  },

  // Clear the polling interval when the component is destroyed
  beforeDestroy() {
    // @ts-ignore
    clearInterval(this.polling)
  },

  methods: {
    // Reset the form data and download task ID
    reset() {
      ;(this.$refs.form as HTMLFormElement).reset()
      this.taskId = ''
      this.exportApproved = false
      this.selectedFormat = null
      this.isProcessing = false
    },

    // Initiate a download request and start polling for the download status
    async downloadRequest() {
      this.isProcessing = true
      this.taskId = await this.$repositories.download.prepare(
        this.projectId,
        this.selectedFormat,
        this.exportApproved
      )
      this.pollData()
    },

    pollData() {
      // @ts-ignore
      this.polling = setInterval(async () => {
        if (this.taskId) {
          const res = await this.$repositories.taskStatus.get(this.taskId)
          if (res.ready) {
            this.$repositories.download.download(this.projectId, this.taskId)
            this.reset()
          }
        }
      }, 1000)
    }
  }
})
</script>
