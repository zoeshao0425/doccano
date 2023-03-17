<template>
  <layout-text v-if="image.id">
    <template #header>
      <!-- The toolbar that appears in the header -->
      <toolbar-laptop
        :doc-id="image.id"
        :enable-auto-labeling.sync="enableAutoLabeling"
        :guideline-text="project.guideline"
        :is-reviewd="image.isConfirmed"
        :total="images.count"
        class="d-none d-sm-block"
        @click:clear-label="clear"
        @click:review="confirm"
      >
        <!-- Button group that toggles between displaying labels and a dropdown to select labels -->
        <v-btn-toggle v-model="labelOption" mandatory class="ms-2">
          <v-btn icon>
            <v-icon>{{ mdiFormatListBulleted }}</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>{{ mdiText }}</v-icon>
          </v-btn>
        </v-btn-toggle>
      </toolbar-laptop>
       <!--toolbar on mobile devices -->
      <toolbar-mobile :total="images.count" class="d-flex d-sm-none" />
    </template>
    <template #content>
      <v-card v-shortkey="shortKeys" @shortkey="addOrRemove">
        <v-card-title>
          <!-- A component that displays a group of labels to select from -->
          <label-group
            v-if="labelOption === 0"
            :labels="labels"
            :annotations="annotations"
            :single-label="project.exclusiveCategories"
            @add="add"
            @remove="remove"
          />
          <!-- A component that displays a dropdown to select a label from -->
          <label-select
            v-else
            :labels="labels"
            :annotations="annotations"
            :single-label="project.exclusiveCategories"
            @add="add"
            @remove="remove"
          />
        </v-card-title>
        <v-divider />
        <!-- The image that is being labeled -->
        <v-img contain :src="image.url" :max-height="imageSize.height" class="grey lighten-2" />
      </v-card>
    </template>
    <template #sidebar>
      <!-- displays the user's progress in the task  -->
      <annotation-progress :progress="progress" />
      <!-- displays metadata about the image-->
      <list-metadata :metadata="image.meta" class="mt-4" />
    </template>
  </layout-text>
</template>

<script>
import { mdiFormatListBulleted, mdiText } from '@mdi/js'
import { toRefs, useContext } from '@nuxtjs/composition-api'
import _ from 'lodash'
import LayoutText from '@/components/tasks/layout/LayoutText'
import ListMetadata from '@/components/tasks/metadata/ListMetadata'
import AnnotationProgress from '@/components/tasks/sidebar/AnnotationProgress.vue'
import LabelGroup from '@/components/tasks/textClassification/LabelGroup'
import LabelSelect from '@/components/tasks/textClassification/LabelSelect'
import ToolbarLaptop from '@/components/tasks/toolbar/ToolbarLaptop'
import ToolbarMobile from '@/components/tasks/toolbar/ToolbarMobile'
import { useLabelList } from '@/composables/useLabelList'
import { Category } from '~/domain/models/tasks/category'

export default {
  components: {
    AnnotationProgress,
    LabelGroup,
    LabelSelect,
    LayoutText,
    ListMetadata,
    ToolbarLaptop,
    ToolbarMobile
  },
  layout: 'workspace',

  // validate whether the parameters and query strings are in the correct format
  validate({ params, query }) {
    return /^\d+$/.test(params.id) && /^\d+$/.test(query.page)
  },

  // initializes state variables and methods used by the component
  setup() {
    const { app } = useContext()
    const { state, getLabelList, shortKeys } = useLabelList(app.$services.categoryType)

    return {
      ...toRefs(state),
      getLabelList,
      shortKeys
    }
  },

  data() {
    return {
      annotations: [],
      images: [],
      project: {},
      enableAutoLabeling: false,
      labelOption: 0,
      imageSize: {
        height: 0,
        width: 0
      },
      mdiText,
      mdiFormatListBulleted,
      progress: {}
    }
  },

  // fetches the data needed for the component from the server
  async fetch() {
    this.images = await this.$services.example.fetchOne(
      this.projectId,
      this.$route.query.page,
      this.$route.query.q,
      this.$route.query.isChecked,
      this.$route.query.ordering
    )
    const image = this.images.items[0]
    this.setImageSize(image)
    if (this.enableAutoLabeling) {
      await this.autoLabel(image.id)
    }
    await this.list(image.id)
  },

  computed: {
    // gets the project ID from the route parameters
    projectId() {
      return this.$route.params.id
    },

    // gets the first image in the list of images fetched from the server
    image() {
      if (_.isEmpty(this.images) || this.images.items.length === 0) {
        return {}
      } else {
        return this.images.items[0]
      }
    }
  },

  // watches for changes to the query parameters and enables auto labeling if necessary
  watch: {
    '$route.query': '$fetch',
    async enableAutoLabeling(val) {
      if (val && !this.image.isConfirmed) {
        await this.autoLabel(this.image.id)
        await this.list(this.image.id)
      }
    }
  },

  // fetches the label list and project information when the component is created
  async created() {
    this.getLabelList(this.projectId)
    this.project = await this.$services.project.findById(this.projectId)
    this.progress = await this.$repositories.metrics.fetchMyProgress(this.projectId)
  },

  methods: {
    // retrieves the list of annotations for the current image from the server
    async list(imageId) {
      this.annotations = await this.$repositories.category.list(this.projectId, imageId)
    },

    // removes the specified annotation from the current image on the server
    async remove(id) {
      await this.$repositories.category.delete(this.projectId, this.image.id, id)
      await this.list(this.image.id)
    },

    // adds the specified label to the current image as an annotation on the server

    async add(labelId) {
      const category = Category.create(labelId)
      await this.$repositories.category.create(this.projectId, this.image.id, category)
      await this.list(this.image.id)
    },

    // adds or removes the specified label from the current image depending on whether it is already present or not
    async addOrRemove(event) {
      const labelId = parseInt(event.srcKey, 10)
      const annotation = this.annotations.find((item) => item.label === labelId)
      if (annotation) {
        await this.remove(annotation.id)
      } else {
        await this.add(labelId)
      }
    },
    
    // sets the height and width of the image so that it fits within the available space
    async clear() {
      await this.$repositories.category.clear(this.projectId, this.image.id)
      await this.list(this.image.id)
    },

    async autoLabel(imageId) {
      try {
        await this.$repositories.category.autoLabel(this.projectId, imageId)
      } catch (e) {
        console.log(e.response.data.detail)
      }
    },

    async updateProgress() {
      this.progress = await this.$repositories.metrics.fetchMyProgress(this.projectId)
    },

    async confirm() {
      await this.$services.example.confirm(this.projectId, this.image.id)
      await this.$fetch()
      this.updateProgress()
    },

    setImageSize(val) {
      const img = new Image()
      const self = this
      img.onload = function () {
        self.imageSize.height = this.height
        self.imageSize.width = this.width
      }
      img.src = val.url
    }
  }
}
</script>

<style scoped>
.text-pre-wrap {
  white-space: pre-wrap !important;
}
</style>
