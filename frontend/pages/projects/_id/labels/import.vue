<template>
  <!-- Import form component with error message and event listeners -->
  <form-import :error-message="errorMessage" @clear="clearErrorMessage" @upload="upload" />
</template>

<script lang="ts">
import Vue from 'vue'
import FormImport from '~/components/label/FormImport.vue'
import { Project } from '~/domain/models/project/project'

export default Vue.extend({
  components: {
    FormImport
  },

  layout: 'project',

  // Validation function to check if user can define label
  validate({ params, query, app }) {
    if (!['category', 'span', 'relation'].includes(query.type as string)) {
      return false
    }
    if (/^\d+$/.test(params.id)) {
      return app.$services.project.findById(params.id).then((res: Project) => {
        return res.canDefineLabel
      })
    }
    return false
  },

  data() {
    return {
      errorMessage: ''
    }
  },

  computed: {
    // Get project id from route params
    projectId(): string {
      return this.$route.params.id
    },

    // Get appropriate service based on the query type
    service(): any {
      const type = this.$route.query.type
      if (type === 'category') {
        return this.$services.categoryType
      } else if (type === 'span') {
        return this.$services.spanType
      } else {
        return this.$services.relationType
      }
    }
  },

  methods: {
    // Upload file to server and redirect to label list page
    async upload(file: File) {
      try {
        await this.service.upload(this.projectId, file)
        this.$router.push(`/projects/${this.projectId}/labels`)
      } catch (e) {
        this.errorMessage = e.message
      }
    },

    // Clear error message
    clearErrorMessage() {
      this.errorMessage = ''
    }
  }
})
</script>
