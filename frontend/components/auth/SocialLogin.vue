<template>
  <div>
    <!-- Render a button for each item in social array -->
    <v-btn
      v-for="item in social"
      :key="item.provider"
      block
      elevation="2"
      color="secondary"
      :href="item.href"
      class="mt-5"
    >
      <!-- Use translation to render text on the button -->
      {{ $t('user.socialLogin', { provider: item.provider }) }}
    </v-btn>
  </div>
</template>
<script lang="ts">
import type { PropType } from 'vue'
import Vue from 'vue'

export default Vue.extend({
  props: {
    // Function that fetches social links
    fetchSocialLink: {
      type: Function as PropType<() => Promise<any>>,
      required: true
    }
  },
  data() {
    // Social array used to render buttons
    return {
      social: {} as any
    }
  },
  async mounted() {
    try {
      // Fetch social links
      const response = await this.fetchSocialLink()
      // Transform the response object into an array of objects with provider and value properties
      this.social = Object.entries(response)
        .map(([key, value]: any) => ({
          provider: key,
          value
        }))
        // Filter out items without an authorize_url property
        .filter((item) => !!item.value?.authorize_url)
        // Transform each item's authorize_url into an href property with the redirect_uri parameter
        .map((item: any) => ({
          ...item,
          href: `${item.value.authorize_url}&redirect_uri=${location.origin}${item.value.redirect_path}`
        }))
    } catch (e) {
      console.error(e)
    }
  }
})
</script>