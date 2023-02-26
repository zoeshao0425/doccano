<template>
  <v-card>
    <div class="top-container">
      <v-card-title>
        {{ $t('projectHome.welcome') }}
      </v-card-title>
      <nuxt-link :to="localePath(`/projects/${$route.params.id}/dataset`)">
        <button class="my-button">Next</button>
      </nuxt-link>
    </div>

    <img src="~/assets/example.png">
    <!-- <v-stepper v-model="e6" vertical non-linear>
      <div v-for="(item, index) in items" :key="index">
        <v-stepper-step :complete="e6 > index + 1" :step="index + 1" editable>
          {{ item.title }}
        </v-stepper-step>
        <v-stepper-content :step="index + 1">
          <v-card v-if="e6 === index + 1" class="mb-12" width="560" height="315">
            <youtube ref="youtube" :video-id="item.videoId" />
          </v-card>
          <v-btn color="primary mt-5" @click="next">
            {{ $t('generic.continue') }}
          </v-btn>
          <v-btn class="mt-5" text @click="prev">
            {{ $t('generic.cancel') }}
          </v-btn>
        </v-stepper-content>
      </div>
    </v-stepper> -->
  </v-card>
</template>

<script>
export default {
  layout: 'project',

  validate({ params }) {
    return /^\d+$/.test(params.id)
  },

  data() {
    return {
      e6: 1,
      
    }
  },

  computed: {
    projectId() {
      return this.$route.params.id
    },
    item() {
      if (_.isEmpty(this.items) || this.items.items.length === 0) {
        return {}
      } else {
        return this.items.items[0]
      }
    }
  },


  methods: {
    next() {
      this.e6 = Math.max(1, (this.e6 + 1) % (this.items.length + 1))
    },
    prev() {
      this.e6 = Math.max(1, this.e6 - 1)
    }
  }
}
</script>

<style>

  .top-container {
    display: flex;
    align-items: center;
  }
  .my-button {
  background-color: rgb(25,118,210);
  border: none;
  color: white;
  padding: 8px 22px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 20px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 5px;
  }
</style>