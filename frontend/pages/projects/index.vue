<!-- The page that lists all the projects -->
<template>
  <v-card>
    <!-- If the person logging in is a staff, then shows create button -->
    <v-card-title v-if="isStaff">
      <!-- Create button, link to page project/create if clicked -->
      <v-btn class="text-capitalize" color="primary" @click.stop="$router.push('projects/create')">
        {{ $t('generic.create') }}
      </v-btn>
      <!-- Delete button  -->
      <!-- Only clickable when a project is selected, pops up a delete window if clicked -->
      <v-btn
        class="text-capitalize ms-2"
        :disabled="!canDelete"
        outlined
        @click.stop="dialogDelete = true"
      >
        {{ $t('generic.delete') }}
      </v-btn>
      <!-- Pop-up window when deleting a project -->
      <v-dialog v-model="dialogDelete">
        <!-- Deletes the selected projects if clicked on yes, otherwise go back -->
        <form-delete :selected="selected" @cancel="dialogDelete = false" @remove="remove" />
      </v-dialog>
    </v-card-title>
    <!-- The list of projects -->
    <project-list
      v-model="selected"
      :items="projects.items"
      :is-loading="isLoading" 
      :total="projects.count"
      @update:query="updateQuery"
    />
  </v-card>
</template>

<script lang="ts">
import _ from 'lodash'
import Vue from 'vue'
import { mapGetters } from 'vuex'
import ProjectList from '@/components/project/ProjectList.vue'
import FormDelete from '~/components/project/FormDelete.vue'
import { Page } from '~/domain/models/page'
import { Project } from '~/domain/models/project/project'
import { SearchQueryData } from '~/services/application/project/projectApplicationService'

export default Vue.extend({
  components: {
    FormDelete,
    ProjectList
  },
  // uses projects layout 
  layout: 'projects',

  // checks that user is logged in
  middleware: ['check-auth', 'auth'],

  data() {
    return {
      dialogDelete: false, // showing delete pop-up window
      projects: {} as Page<Project>, 
      selected: [] as Project[], // a list of selected projects
      isLoading: false
    }
  },
  // make sure projects are loaded before component is mounted
  async fetch() {
    this.isLoading = true
    this.projects = await this.$services.project.list(
      this.$route.query as unknown as SearchQueryData
    )
    this.isLoading = false
  },

  computed: {
    // map 'isStaff' getter from auth module
    ...mapGetters('auth', ['isStaff']),
    // can delete a projects when at least one project is selected
    canDelete(): boolean {
      return this.selected.length > 0
    }
  },

  // watch for changes and update the page every 1 second
  watch: {
    '$route.query': _.debounce(function () {
      // @ts-ignore
      this.$fetch()
    }, 1000)
  },

  methods: {
    // removes the selected projects
    async remove() {
      await this.$services.project.bulkDelete(this.selected)
      this.$fetch()
      // clears the pop-up window
      this.dialogDelete = false
      // deselect everything
      this.selected = []
    },

    
    updateQuery(query: object) {
      this.$router.push(query)
    }
  }
})
</script>

<style scoped>
::v-deep .v-dialog {
  width: 800px;
}
</style>
