<template>
    <div class="sidebar">
      <div class="sidebar-header">
        <h3>Possible Diseases</h3>
      </div>
      <v-list-item-group v-model="selected" mandatory>
        <v-list-item
        v-for="item in items" :key="item.id"
        @click="$router.push(localePath(`/projects/${$route.params.id}/${item.link}`))"
       >
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
    data() {
      return {
        items: [
          { id: 1, text: "Anxiety", link: "/intent-detection-and-slot-filling/newPage",},
          { id: 2, text: "Pain", link: "/" },
          { id: 3, text: "Something else", link: "/" }
        ]
      };
    }
  };
</script>

<style scoped>
.sidebar {
  background-color: #f5f5f5;
  padding: 20px;
  width: 200px;
}
.sidebar-header h3 {
  margin-top: 0;
}
.nav-pills>li>a {
  padding: 10px 15px;
  color: #333;
  text-decoration: none;
}
</style>
  
  