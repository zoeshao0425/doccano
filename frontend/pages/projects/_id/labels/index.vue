<template>
  <v-card>
    <v-tabs v-if="hasMultiType" v-model="tab">
      <!-- Displays two tabs if the project has multiple label types, for intent detection and slot filling -->
      <template v-if="isIntentDetectionAndSlotFilling">
        <v-tab class="text-capitalize">Category</v-tab>
        <v-tab class="text-capitalize">Span</v-tab>
      </template>
      <!-- Displays two tabs if the project has multiple label types, for relation extraction -->
      <template v-else>
        <v-tab class="text-capitalize">Span</v-tab>
        <v-tab class="text-capitalize">Relation</v-tab>
      </template>
    </v-tabs>
    <v-card-title>
      <!-- Displays an action menu with buttons to create, upload, and download label items -->
      <action-menu
        @create="$router.push('labels/add?type=' + labelType)"
        @upload="$router.push('labels/import?type=' + labelType)"
        @download="download"
      />
      <!-- Displays a button to delete selected label items -->
      <v-btn
        class="text-capitalize ms-2"
        :disabled="!canDelete"
        outlined
        @click.stop="dialogDelete = true"
      >
        {{ $t('generic.delete') }}
      </v-btn>
      <!-- Displays a dialog box to confirm label item deletion -->
      <v-dialog v-model="dialogDelete">
        <form-delete :selected="selected" @cancel="dialogDelete = false" @remove="remove" />
      </v-dialog>
    </v-card-title>
    <!-- Displays a list of label items, with the ability to select and edit them -->
    <label-list v-model="selected" :items="items" :is-loading="isLoading" @edit="editItem" />
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import ActionMenu from '@/components/label/ActionMenu.vue'
import FormDelete from '@/components/label/FormDelete.vue'
import LabelList from '@/components/label/LabelList.vue'
import { Project } from '~/domain/models/project/project'
import { LabelDTO } from '~/services/application/label/labelData'

export default Vue.extend({
  components: {
    ActionMenu,
    FormDelete,
    LabelList
  },
  layout: 'project',

   // Validates that the project ID is a number and that the user can define labels for the project
  validate({ params, app }) {
    if (/^\d+$/.test(params.id)) {
      return app.$services.project.findById(params.id).then((res: Project) => {
        return res.canDefineLabel
      })
    }
    return false
  },

  data() {
    return {
      dialogDelete: false,
      items: [] as LabelDTO[],
      selected: [] as LabelDTO[],
      isLoading: false,
      tab: 0,
      project: {} as Project
    }
  },

  computed: {
    // Determines whether any label items are selected for deletion
    canDelete(): boolean {
      return this.selected.length > 0
    },

    // Retrieves the project ID from the URL route
    projectId(): string {
      return this.$route.params.id
    },

    // Determines whether the project has multiple label types (for intent detection and slot filling)
    hasMultiType(): boolean {
      if ('projectType' in this.project) {
        return this.isIntentDetectionAndSlotFilling || !!this.project.useRelation
      } else {
        return false
      }
    },

    // check if the project is an IntentDetectionAndSlotFilling project
    isIntentDetectionAndSlotFilling(): boolean {
      return this.project.projectType === 'IntentDetectionAndSlotFilling'
    },

    // determine the label type based on the project settings and the selected tab
    labelType(): string {
      if (this.hasMultiType) {
        if (this.isIntentDetectionAndSlotFilling) {
          return ['category', 'span'][this.tab!]
        } else {
          return ['span', 'relation'][this.tab!]
        }
      } else if (this.project.canDefineCategory) {
        return 'category'
      } else {
        return 'span'
      }
    },

    // determine the label service to use based on the project settings and the selected tab
    service(): any {
      if (!('projectType' in this.project)) {
        return
      }
      if (this.hasMultiType) {
        if (this.isIntentDetectionAndSlotFilling) {
          return [this.$services.categoryType, this.$services.spanType][this.tab!]
        } else {
          return [this.$services.spanType, this.$services.relationType][this.tab!]
        }
      } else if (this.project.canDefineCategory) {
        return this.$services.categoryType
      } else {
        return this.$services.spanType
      }
    }
  },

  watch: {
    tab() {
      this.list()
    }
  },

  async created() {
    this.project = await this.$services.project.findById(this.projectId)
    await this.list()
  },

  methods: {
    async list() {
      this.isLoading = true
      this.items = await this.service.list(this.projectId)
      this.isLoading = false
    },

    async remove() {
      await this.service.bulkDelete(this.projectId, this.selected)
      this.list()
      this.dialogDelete = false
      this.selected = []
    },

    async download() {
      await this.service.export(this.projectId)
    },

    editItem(item: LabelDTO) {
      this.$router.push(`labels/${item.id}/edit?type=${this.labelType}`)
    }
  }
})
</script>

<style scoped>
::v-deep .v-dialog {
  width: 800px;
}
</style>
