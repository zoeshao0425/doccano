<!-- The main page -->
<template>
  <v-main>
    <!-- The top banner containing big logo, Title, Get Started -->
    <the-top-banner />
    <!-- The three features -->
    <feature-cards />
    <!-- The bottom banner containing the demo -->
    <the-bottom-banner />
  </v-main>
</template>

<script>
// Importing the three components
import FeatureCards from '@/components/layout/FeatureCards'
import TheTopBanner from '@/components/layout/TheTopBanner'
import TheBottomBanner from '@/components/layout/TheBottomBanner'

// Exporting the three components
export default {
  components: {
    FeatureCards,
    TheTopBanner,
    TheBottomBanner
  }
}
</script>
