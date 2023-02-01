<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h3>Possible Diseases</h3>
    </div>
    <v-list-item-group v-model="selected" mandatory>
      <v-list-item v-for="(item, i) in filteredItems" :key="i"
        @click="$router.push(`/projects/${$route.params.id}/${item.link}`)">
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
    }
  },

  computed: {
    filteredItems() {
      const items = [
        {
          id: 1,
          text: "Pain",
          link: '/',
          isVisible: true
        },
        {
          id: 2,
          text: "Anxiety",
          link: '/',
          isVisible: true
        }

      ]
      return items.filter((item) => item.isVisible)
    }
  },

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

