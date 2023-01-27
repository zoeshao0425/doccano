<template>
    <div class="sidebar">
      <div class="sidebar-header">
        <h3>Possible Diseases</h3>
      </div>
      <ul class="nav nav-pills nav-stacked">
        <li v-for="item in items" :key="item.id">
          <a :href="item.link">{{ item.text }}</a >
        </li>
      </ul>
    </div>
  </template>

<script>
  export default {
    data() {
      return {
        items: [
          { id: 1, text: "Anxiety", link: "/",},
          { id: 2, text: "Pain", link: "/" },
          { id: 3, text: "Something", link: "/" }
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
  
  