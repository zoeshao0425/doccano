<!-- page that displays all the datasets -->
<template>
  <v-card>
    <!-- if the user is project admin, then show the following -->
    <v-card-title v-if="isProjectAdmin">
      <!-- the action button, with options of exporting and importing -->
      <action-menu
        @upload="$router.push('dataset/import')"
        @download="$router.push('dataset/export')"
      />
      <!-- delete button, clickable when selected at least one item-->
      <!-- pop-up window shown when clicked -->
      <v-btn
        class="text-capitalize ms-2"
        :disabled="!canDelete"
        outlined
        @click.stop="dialogDelete = true"
      >
        {{ $t('generic.delete') }}
      </v-btn>
      <v-spacer />
      <!-- delete all button -->
      <!-- pop-up window shown when clicked -->
      <v-btn
        :disabled="!item.count"
        class="text-capitalize"
        color="error"
        @click="dialogDeleteAll = true"
      >
        {{ $t('generic.deleteAll') }}
      </v-btn>
      <!-- pop-up window for delete -->
      <v-dialog v-model="dialogDelete">
        <form-delete
          :selected="selected"
          :item-key="itemKey"
          @cancel="dialogDelete = false"
          @remove="remove"
        />
      </v-dialog>
      <!-- pop-up window for deleteAll -->
      <v-dialog v-model="dialogDeleteAll">
        <form-delete-bulk @cancel="dialogDeleteAll = false" @remove="removeAll" />
      </v-dialog>
    </v-card-title>
    <!-- the datasets for projects using images -->
    <image-list
      v-if="isImageTask"
      v-model="selected"
      :items="item.items"
      :is-loading="isLoading"
      :total="item.count"
      @update:query="updateQuery"
      @click:labeling="movePage"
    />
    <!-- the datasets for projects using audios -->
    <audio-list
      v-else-if="isAudioTask"
      v-model="selected"
      :items="item.items"
      :is-loading="isLoading"
      :total="item.count"
      @update:query="updateQuery"
      @click:labeling="movePage"
    />
    <!-- the datasets for projects using documents -->
    <document-list
      v-else
      v-model="selected"
      :items="item.items"
      :is-loading="isLoading"
      :total="item.count"
      @update:query="updateQuery"
      @click:labeling="movePage"
    />
  </v-card>
</template>

<script lang="ts">
import _ from 'lodash'
import Vue from 'vue'
import DocumentList from '@/components/example/DocumentList.vue'
import FormDelete from '@/components/example/FormDelete.vue'
import FormDeleteBulk from '@/components/example/FormDeleteBulk.vue'
import ActionMenu from '~/components/example/ActionMenu.vue'
import AudioList from '~/components/example/AudioList.vue'
import ImageList from '~/components/example/ImageList.vue'
import { Project } from '~/domain/models/project/project'
import { getLinkToAnnotationPage } from '~/presenter/linkToAnnotationPage'
import { ExampleDTO, ExampleListDTO } from '~/services/application/example/exampleData'

export default Vue.extend({
  components: {
    ActionMenu,
    AudioList,
    DocumentList,
    ImageList,
    FormDelete,
    FormDeleteBulk
  },

  // uses the layout for a single project
  layout: 'project',


  validate({ params, query }) {
    // @ts-ignore
    return /^\d+$/.test(params.id) && /^\d+|$/.test(query.limit) && /^\d+|$/.test(query.offset)
  },

  data() {
    return {
      dialogDelete: false,  // shows pop-up window for deleting selected datasets
      dialogDeleteAll: false, // shows pop-up window for deleting all datasets
      project: {} as Project, // current projects
      item: {} as ExampleListDTO,
      selected: [] as ExampleDTO[],
      isLoading: false,
      isProjectAdmin: false
    }
  },

  async fetch() {
    this.isLoading = true
    this.item = await this.$services.example.list(this.projectId, this.$route.query)
    this.isLoading = false
  },

  computed: {
    // returned true if at least one dataset is selected
    canDelete(): boolean {
      return this.selected.length > 0
    },

    // returns the current project's id
    projectId(): string {
      return this.$route.params.id
    },

    // returns true if the project is on images
    isImageTask(): boolean {
      const imageTasks = ['ImageClassification', 'ImageCaptioning', 'BoundingBox', 'Segmentation']
      return imageTasks.includes(this.project.projectType)
    },

    // returns true if the project is on audios
    isAudioTask(): boolean {
      return this.project.projectType === 'Speech2text'
    },


    itemKey(): string {
      if (this.isImageTask || this.isAudioTask) {
        return 'filename'
      } else {
        return 'text'
      }
    }
  },

  // watch for changes and update every second
  watch: {
    '$route.query': _.debounce(function () {
      // @ts-ignore
      this.$fetch()
    }, 1000)
  },


  async created() {
    this.project = await this.$services.project.findById(this.projectId)
    const member = await this.$repositories.member.fetchMyRole(this.projectId)
    this.isProjectAdmin = member.isProjectAdmin
  },

  methods: {
    // delete selected datesets
    async remove() {
      await this.$services.example.bulkDelete(this.projectId, this.selected)
      this.$fetch()
      this.dialogDelete = false
      this.selected = []
    },

    // delete all datasets
    async removeAll() {
      await this.$services.example.bulkDelete(this.projectId, [])
      this.$fetch()
      this.dialogDeleteAll = false
      this.selected = []
    },

    updateQuery(query: object) {
      this.$router.push(query)
    },

    // go to the annotating page
    movePage(query: object) {
      const link = getLinkToAnnotationPage(this.projectId, this.project.projectType)
      this.updateQuery({
        path: this.localePath(link),
        query
      })
    }
  }
})
</script>

<style scoped>
::v-deep .v-dialog {
  width: 800px;
}
</style>
