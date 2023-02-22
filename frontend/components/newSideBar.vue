<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h3>Possible Diseases</h3>
    </div>
    <v-list-item-group v-model="selected" mandatory>
      <v-list-item v-for="(item, i) in filteredItems" :key="i"
        @click="selectItem(item)">
        <v-list-item-content>
          <v-list-item-title>
            {{ item.text }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
  </div>
</template>

<script>
export default {
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
      selectedItem: null,
    }
  },

  computed: {
    filteredItems() {
      const items = [
        {
          id: 1,
          text: "Pain",
          isSelected: false
        },
        {
          id: 2,
          text: "Anxiety",
          isSelected: false
        }
      ];
      return items
    }
  },
  
  methods : {
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
    
  }
}
</script>

<style scoped>
.sidebar {
  background-color: #f5f5f5;
  padding: 20px;
  width: 200px;
  
}

.sidebar-header h3 {
  margin-top: 0;
  margin-bottom: 10px;
}

.nav-pills>li>a {
  padding: 10px 15px;
  color: #333;
  text-decoration: none;
}
</style>

