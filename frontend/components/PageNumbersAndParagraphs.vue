<template>
  <div class="pages">
    <div class="page-numbers">
      <div class="page-numbers-title">
        <h3>Pages in which "pain" appears:</h3>
      </div>
      <v-list-item-group v-model="selected" mandatory class="page-numbers-container">
        <v-list-item v-for="(page, i) in pageNum" :key="i" 
          @click="selectItem(page)">
          <v-list-item-content class="page-number-content">
            <v-list-item-title class="page-number-text">
              {{ page.id }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </div>

    <div v-if="selectedItem">
      <div>
        <h3>Annotation:</h3>
      </div>
      <div class="annotation-text pa-4">
        <entity-editor 
          :dark="$vuetify.theme.dark" 
          :rtl="isRTL"  
          :text="selectedItem.passage"
          :entities="pans"
          :entity-labels="spanTypes" 
          @addEntity="addSpan" 
          @click:entity="updateSpan" 
          @contextmenu:entity="deleteSpan" />
      </div>

    </div>
  </div>
</template>

<script>
import EntityEditor from '@/components/tasks/sequenceLabeling/EntityEditor.vue'

export default {
  components: {
    EntityEditor
  },

  props: {
    isProjectAdmin: {
      type: Boolean,
      default: false,
      required: true
    },
    project: {
      type: Object,
      default: () => { },
      required: true
    }
  },
  data() {
    return {
      // The selected page
      // a page item if an item is clicked. Display that item's passage
      // null if no page is selected. Display nothing
      selectedItem: null,

      docs: [],
      spans: [],
      categories: [],
      spanTypes: [],
      categoryTypes: [],
      exclusive: false,
      enableAutoLabeling: false,
      progress: {},
    };
  },
  computed: {
    pageNum() {
      const items = [
        {
          id: 1,
          text: "1",
          link: "intent-detection-and-slot-filling/newpage/test",
          isSelected: false,
          passage: "Tension-type headache, unspecified, intractable details; onset was approximately 2 months ago. The location is primarily left and right occipital and behind the eyes. The pain radiates to the left, right, and posterior neck, left and right eye, and bilateral ears. Ms. Williams denies having significant prior headaches. She characterizes it as severe."
        },
        {
          id: 2,
          text: "2",
          link: "intent-detection-and-slot-filling/newpage/test",
          isSelected: false,
          passage: "2"
        },
        {
          id: 3,
          text: "3",
          link: "intent-detection-and-slot-filling/newpage/test",
          isSelected: false,
          passage: "3"
        }
      ];
      return items;
    }
  },
  methods: {
    selectItem(item) {
      // If clicked on a new item without unclicking the old item, set 
      // isSelected = false for the old item
      if (this.selectedItem != null && this.selectedItem !== item) {
        this.selectedItem.isSelected = false
      }
      
      item.isSelected = !item.isSelected

      // update the selected item
      if (item.isSelected) {
        this.selectedItem = item
      } else {
        this.selectedItem = null
      }
    },

    async listSpan(docId) {
      const spans = await this.$services.sequenceLabeling.list(this.projectId, docId)
      this.spans = spans
    },

    async deleteSpan(id) {
      await this.$services.sequenceLabeling.delete(this.projectId, this.doc.id, id)
      await this.listSpan(this.doc.id)
    },

    async addSpan(startOffset, endOffset, labelId) {
      await this.$services.sequenceLabeling.create(
        this.projectId,
        this.doc.id,
        labelId,
        startOffset,
        endOffset
      )
      await this.listSpan(this.doc.id)
    },

    async updateSpan(annotationId, labelId) {
      await this.$services.sequenceLabeling.changeLabel(
        this.projectId,
        this.doc.id,
        annotationId,
        labelId
      )
      await this.listSpan(this.doc.id)
    },

    async listCategory(id) {
      this.categories = await this.$services.textClassification.list(this.projectId, id)
    },

    async removeCategory(id) {
      await this.$services.textClassification.delete(this.projectId, this.doc.id, id)
      await this.listCategory(this.doc.id)
    },

    async addCategory(labelId) {
      await this.$services.textClassification.create(this.projectId, this.doc.id, labelId)
      await this.listCategory(this.doc.id)
    },

    async addOrRemoveCategory(event) {
      const labelId = parseInt(event.srcKey, 10)
      const category = this.categories.find((item) => item.label === labelId)
      if (category) {
        await this.removeCategory(category.id)
      } else {
        await this.addCategory(labelId)
      }
    },

    async clear() {
      await this.$services.sequenceLabeling.clear(this.projectId, this.doc.id)
      await this.listSpan(this.doc.id)
    },

    async autoLabel(docId) {
      try {
        await this.$services.sequenceLabeling.autoLabel(this.projectId, docId)
      } catch (e) {
        console.log(e.response.data.detail)
      }
    },

    async updateProgress() {
      this.progress = await this.$services.metrics.fetchMyProgress(this.projectId)
    },

    async confirm() {
      await this.$services.example.confirm(this.projectId, this.doc.id)
      await this.$fetch()
      this.updateProgress()
    }
  }
}
</script>

<style scoped>
.annotation-text {
  font-size: 1.25rem !important;
  font-weight: 500;
  line-height: 2rem;
  font-family: 'Roboto', sans-serif !important;
  opacity: 0.6;
  flex: 1;
}

.nav-pills>li>a {
  padding: 10px 15px;
  color: #333;
  text-decoration: none;
}

.page-numbers {
  margin-bottom: 15px;
}

.page-numbers-title {
  margin-bottom: 10px;
}

.page-numbers-container {
  display: grid;
  grid-template-columns: repeat(15, 36px);
  row-gap: 10px;
  list-style: none;
}

.page-number-content {
  padding: 0 0;
}

.page-number-text {
  color: rgb(25, 118, 210);
  display: flex;
  justify-content: center;
  font-size: 16px;
}

.v-list-item {
  padding: 0 0;
  min-height: 36px;
}
</style>

