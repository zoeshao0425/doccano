<template>
  <v-card>
    <v-card-title>
      <!-- Delete button that opens a dialog when clicked -->
      <v-btn
        class="text-capitalize ms-2"
        :disabled="!canDelete"
        outlined
        @click.stop="dialogDelete = true"
      >
        {{ $t('generic.delete') }}
      </v-btn>
      <!-- Dialog for confirming deletion of comments -->
      <v-dialog v-model="dialogDelete">
        <form-delete :selected="selected" @cancel="dialogDelete = false" @remove="remove" />
      </v-dialog>
    </v-card-title>

    <!-- List of comments -->
    <comment-list
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
import CommentList from '@/components/comment/CommentList.vue'
import FormDelete from '~/components/comment/FormDelete.vue'
import { CommentItem } from '~/domain/models/comment/comment'
import { Page } from '~/domain/models/page'
import { Project } from '~/domain/models/project/project'
import { getLinkToAnnotationPage } from '~/presenter/linkToAnnotationPage'

export default Vue.extend({
  components: {
    CommentList,
    FormDelete
  },
  layout: 'project',

  // Validation to check if the parameter passed in the URL is a number
  validate({ params }) {
    return /^\d+$/.test(params.id)
  },

  data() {
    return {
      dialogDelete: false,
      project: {} as Project,
      item: {} as Page<CommentItem>,
      selected: [] as CommentItem[],
      isLoading: false
    }
  },

  // Fetches the list of comments and the project details
  async fetch() {
    this.isLoading = true
    this.project = await this.$services.project.findById(this.projectId)
    this.item = await this.$repositories.comment.listAll(this.projectId, this.$route.query)
    this.isLoading = false
  },

  computed: {
    // Checks if any comments are selected for deletion
    canDelete(): boolean {
      return this.selected.length > 0
    },

    // Retrieves the project ID from the URL parameter
    projectId() {
      return this.$route.params.id
    }
  },

  watch: {
    // Debounces the fetching of comments when query parameters change
    '$route.query': _.debounce(function () {
      // @ts-ignore
      this.$fetch()
    }, 1000)
  },

  methods: {
    // Deletes the selected comments in bulk and updates the list of comments
    async remove() {
      await this.$repositories.comment.deleteBulk(this.projectId, this.selected)
      this.$fetch()
      this.dialogDelete = false
      this.selected = []
    },

    // Updates the query parameters in the URL
    updateQuery(query: object) {
      this.$router.push(query)
    },

    // Redirects to the annotation page with updated query parameters
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
