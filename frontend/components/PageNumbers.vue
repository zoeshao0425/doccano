<template>
    <div class="page-numbers">
      <div class="page-numbers-title">
        <h3>Pages in which "pain" appears:</h3>
      </div>
      <v-list-item-group v-model="selected" mandatory class="page-numbers-container">
        <v-list-item v-for="(page, i) in pageNum" :key="i"
        @click="$router.push(`/projects/${$route.params.id}/${page.link}`)">
          <v-list-item-content class="page-number-content">
            <v-list-item-title class="page-number-text">
              {{ page.id }}
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
        totalPages: 20
      }
    },

    computed: {
      pageNum() {
        const items = [
          {
            id: 1,
            text: "1",
            link: 'intent-detection-and-slot-filling/newpage/test',
            isVisible: true
          },
          {
            id: 2,
            text: "2",
            link: 'intent-detection-and-slot-filling/newpage/test',
            isVisible: true
          },
          {
            id: 3,
            text: "3",
            link: 'intent-detection-and-slot-filling/newpage/test',
            isVisible: true
          }

  
        ]
        return items.filter((item) => item.isVisible)
      }
    },
  
  }
  </script>
  
  <style scoped>
  .nav-pills>li>a {
    padding: 10px 15px;
    color: #333;
    text-decoration: none;
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
  
  