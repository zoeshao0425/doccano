<template>
  <v-card>
    <!-- Show the form only if a project has been passed in -->
    <v-card-text v-if="!!project">
      <!-- Create a form and bind its validity to the `valid` property -->
      <v-form ref="form" v-model="valid" :disabled="!isEditing">
        <!-- Create a row with a column for each input -->
        <v-row>
          <v-col cols="12" sm="12" md="6" lg="6" xl="6">
            <!-- Custom components for input fields -->
            <project-name-field v-model="project.name" />
            <project-description-field v-model="project.description" />
            <tag-list v-model="tags" />
            <random-order-field v-model="project.enableRandomOrder" />
            <sharing-mode-field v-model="project.enableSharingMode" />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <!-- Actions for saving or canceling changes -->
    <v-card-actions class="ps-4 pt-0">
      <!-- Show "Edit" button if not currently editing -->
      <v-btn
        v-if="!isEditing"
        color="primary"
        class="text-capitalize"
        @click="isEditing = true"
        v-text="`Edit`"
      />
      <!-- Show "Save" button if currently editing -->
      <v-btn
        v-show="isEditing"
        color="primary"
        :disabled="!valid || isUpdating"
        class="mr-4 text-capitalize"
        @click="save"
        v-text="$t('generic.save')"
      />
      <!-- Show "Cancel" button if currently editing -->
      <v-btn
        v-show="isEditing"
        :disabled="isUpdating"
        class="text-capitalize"
        @click="cancel"
        v-text="$t('generic.cancel')"
      />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import ProjectDescriptionField from './ProjectDescriptionField.vue'
import ProjectNameField from './ProjectNameField.vue'
import RandomOrderField from './RandomOrderField.vue'
import SharingModeField from './SharingModeField.vue'
import TagList from './TagList.vue'
import { Project } from '~/domain/models/project/project'

export default Vue.extend({
  components: {
    ProjectNameField,
    ProjectDescriptionField,
    RandomOrderField,
    SharingModeField,
    TagList
  },

  data() {
    // Set initial data properties
    return {
      project: {} as Project,
      tags: [] as string[],
      valid: false,
      isEditing: false,
      isUpdating: false
    }
  },

  async fetch() {
    // Fetch the project with the given ID from the server
    const projectId = this.$route.params.id
    this.project = await this.$services.project.findById(projectId)
    // Set the tags to the project's current tags
    this.tags = this.project.tags.map((item) => item.text)
    // Reset the form to view mode
    this.isEditing = false
  },

  methods: {
    // Reload the project and reset the form
    cancel() {
      this.$fetch()
    },

    // Save changes to the project and tags
    async save() {
      this.isUpdating = true
      await this.$services.project.update(this.project.id, this.project)
      await this.$services.tag.bulkUpdate(this.project.id, this.tags)
      // Reload the project and reset the form
      this.$fetch()
      this.isUpdating = false
    }
  }
})
</script>
