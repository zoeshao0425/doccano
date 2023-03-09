<!-- Create Project Page -->
<template>
  <v-card>
    <v-card-title>{{ $t('overview.createProjectTitle') }}</v-card-title>
    <v-card-text>
      <v-form v-model="valid">
        <!-- selecting the type of project -->
        <project-type-field v-model="editedItem.projectType" />
        <!-- input box to enter project name -->
        <project-name-field v-model="editedItem.name" outlined autofocus />
        <!-- input box to enter project description -->
        <project-description-field v-model="editedItem.description" outlined />
        <!-- input box to add tags -->
        <tag-list v-model="editedItem.tags" outlined />

        <!-- if showExclusiveCategories is true, show the checkbox for allow single label -->
        <v-checkbox
          v-if="showExclusiveCategories"
          v-model="editedItem.exclusiveCategories"
          :label="$t('overview.allowSingleLabel')"
        />

        <!-- if sequency labeling project is selected, display the following checkboxes -->
        <template v-if="isSequenceLabelingProject">
          <v-checkbox v-model="editedItem.allowOverlappingSpans" label="Allow overlapping spans" />
          <v-img
            :src="require('~/assets/project/creation.gif')"
            height="200"
            position="left"
            contain
          />
          <v-checkbox v-model="editedItem.useRelation" label="Use relation labeling" />
          <v-checkbox v-model="editedItem.enableGraphemeMode">
            <template #label>
              <div>
                Count
                <v-tooltip bottom>
                  <template #activator="{ on }">
                    <a
                      target="_blank"
                      href="https://unicode.org/reports/tr29/"
                      @click.stop
                      v-on="on"
                    >
                      grapheme clusters
                    </a>
                  </template>
                  Like emoji(🌷, 💩, and 👍), CRLF(\r\n), and so on.
                </v-tooltip>
                as one character
              </div>
            </template>
          </v-checkbox>
        </template>
        <!-- two checkboxes that applies for all project types -->
        <random-order-field v-model="editedItem.enableRandomOrder" />
        <sharing-mode-field v-model="editedItem.enableSharingMode" />
      </v-form>
    </v-card-text>
    <!-- create button, create this project when clicked -->
    <v-card-actions class="ps-4">
      <v-btn
        :disabled="!valid"
        color="primary"
        style="text-transform: none"
        outlined
        @click="create"
        v-text="$t('generic.create')"
      />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import ProjectDescriptionField from '~/components/project/ProjectDescriptionField.vue'
import ProjectNameField from '~/components/project/ProjectNameField.vue'
import ProjectTypeField from '~/components/project/ProjectTypeField.vue'
import RandomOrderField from '~/components/project/RandomOrderField.vue'
import SharingModeField from '~/components/project/SharingModeField.vue'
import TagList from '~/components/project/TagList.vue'
import {
  DocumentClassification,
  ImageClassification,
  SequenceLabeling
} from '~/domain/models/project/project'

// the default settings for a new project
const initializeProject = () => {
  return {
    name: '',
    description: '',
    projectType: DocumentClassification,
    enableRandomOrder: false,
    enableSharingMode: false,
    exclusiveCategories: false,
    allowOverlappingSpans: false,
    enableGraphemeMode: false,
    useRelation: false,
    tags: [] as string[],
    guideline: ''
  }
}

export default Vue.extend({
  components: {
    ProjectTypeField,
    ProjectNameField,
    ProjectDescriptionField,
    RandomOrderField,
    SharingModeField,
    TagList
  },

  // uses the projects layout
  layout: 'projects',

  // checks that user is logged in
  middleware: ['check-auth', 'auth'],

  data() {
    return {
      // true if the form is completed and valid
      valid: false,
      // the project currently editing
      editedItem: initializeProject()
    }
  },

  computed: {
    // return true if doc classification or image classfication is selected
    showExclusiveCategories(): boolean {
      return [DocumentClassification, ImageClassification].includes(this.editedItem.projectType)
    },
    // returns true if sequencing labeling project is selected
    isSequenceLabelingProject(): boolean {
      return this.editedItem.projectType === SequenceLabeling
    }
  },

  methods: {
    // creates a project
    async create() {
      const project = await this.$services.project.create(this.editedItem)
      this.$router.push(`/projects/${project.id}`)
      // reset to original state with the default settings
      this.$nextTick(() => {
        this.editedItem = initializeProject()
      })
    }
  }
})
</script>
