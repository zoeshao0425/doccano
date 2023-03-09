<!-- The welcome page for a project -->
<template>
  <v-card>
    <!-- Welcome message -->
    <v-card-title>
      {{ $t('projectHome.welcome') }}
    </v-card-title>
    <!-- Steps of a tutorial of how to use doccano -->
    <v-stepper v-model="e6" vertical non-linear>
      <!-- Iterate through all the steps -->
      <div v-for="(item, index) in items" :key="index">
        <!-- Shows index and title -->
        <v-stepper-step :complete="e6 > index + 1" :step="index + 1" editable>
          {{ item.title }}
        </v-stepper-step>
        <!-- The content of each step -->
        <v-stepper-content :step="index + 1">
          <!-- Youtube video -->
          <v-card v-if="e6 === index + 1" class="mb-12" width="560" height="315">
            <youtube ref="youtube" :video-id="item.videoId" />
          </v-card>
          <!-- continue button, go to next step is clicked -->
          <v-btn color="primary mt-5" @click="next">
            {{ $t('generic.continue') }}
          </v-btn>
          <!-- cancel button, go to previous step is clicked -->
          <v-btn class="mt-5" text @click="prev">
            {{ $t('generic.cancel') }}
          </v-btn>
        </v-stepper-content>
      </div>
    </v-stepper>
  </v-card>
</template>

<script>
export default {
  // Uses the layout for a single project
  layout: 'project',

  // checks that 'id' in the route is a valid numeric value
  validate({ params }) {
    return /^\d+$/.test(params.id)
  },

  data() {
    return {
      e6: 1,
      // the list of steps of the tutorial
      items: [
        { title: this.$t('projectHome.importData'), videoId: 'dA4ID1DSxCE' },
        { title: this.$t('projectHome.createLabels'), videoId: '1bSML270quU' },
        { title: this.$t('projectHome.addMembers'), videoId: 'NI09dcBz-qA' },
        {
          title: this.$t('projectHome.defineGuideline'),
          videoId: 'AvvX3Xs32nA'
        },
        {
          title: this.$t('projectHome.annotateDataset'),
          videoId: 'F3XoSdyiMhA'
        },
        {
          title: this.$t('projectHome.viewStatistics'),
          videoId: 'kfRpa0mNQMY'
        },
        { title: this.$t('projectHome.exportDataset'), videoId: 'Pfy_QcHEeQ4' }
      ]
    }
  },

  methods: {
    // go to next step
    next() {
      this.e6 = Math.max(1, (this.e6 + 1) % (this.items.length + 1))
    },
    // go to previous step
    prev() {
      this.e6 = Math.max(1, this.e6 - 1)
    }
  }
}
</script>
