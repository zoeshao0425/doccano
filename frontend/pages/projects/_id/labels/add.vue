<template>
  <form-create v-slot="slotProps" v-bind.sync="editedItem" :items="items">
    <!-- A button to save the form data. It is disabled if the form is not valid. -->
    <v-btn :disabled="!slotProps.valid" color="primary" class="text-capitalize" @click="save">
      Save
    </v-btn>

    <!-- A button to save the form data and reset the form fields with default values-->
    <v-btn
      :disabled="!slotProps.valid"
      color="primary"
      style="text-transform: none"
      outlined
      @click="saveAndAnother"
    >
      Save and add another
    </v-btn>
  </form-create>
</template>

<script lang="ts">
import Vue from 'vue'
import FormCreate from '~/components/label/FormCreate.vue'
import { Project } from '~/domain/models/project/project'
import { LabelDTO } from '~/services/application/label/labelData'

export default Vue.extend({
  components: {
    FormCreate
  },

  layout: 'project',

  /**
   * A method to validate the route before entering it.
   * It only allows to access the route if the query type is 'category', 'span', or 'relation',
   * and if the project id in the route params is valid and the user has the permission to define labels.
   * @param {Object} context - The context object containing the route information and the app instance.
   * @return {Promise<Boolean>} - A promise that resolves to a boolean value indicating whether the route is allowed or not.
   */
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
      editedItem: {
        text: '',
        prefixKey: null,
        suffixKey: null,
        backgroundColor: '#73D8FF',
        textColor: '#ffffff'
      } as LabelDTO,
      defaultItem: {
        text: '',
        prefixKey: null,
        suffixKey: null,
        backgroundColor: '#73D8FF',
        textColor: '#ffffff'
      } as LabelDTO,
      items: [] as LabelDTO[]
    }
  },

  computed: {
    // A computed property that returns the project id from the route params.
    projectId(): string {
      return this.$route.params.id
    },

    // A computed property that returns the service to use based on the query type from the route.
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

  // A lifecycle hook that runs after the component is created.
  async created() {
    this.items = await this.service.list(this.projectId)
  },

  methods: {
    // A method to save the edited item to the service and redirect to the labels list page.
    async save() {
      await this.service.create(this.projectId, this.editedItem)
      this.$router.push(`/projects/${this.projectId}/labels`)
    },

    async saveAndAnother() {
      await this.service.create(this.projectId, this.editedItem)
      this.editedItem = Object.assign({}, this.defaultItem)
      this.items = await this.service.list(this.projectId)
    }
  }
})
</script>
