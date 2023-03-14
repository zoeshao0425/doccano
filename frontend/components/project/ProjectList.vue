<template>
  <!-- Data table component from Vuetify framework -->
  <v-data-table
    :value="value" <!-- Selected items passed as prop -->
    :headers="headers" <!-- Table headers -->
    :items="items" <!-- Items to be displayed in the table -->
    :options.sync="options" <!-- Synced with the table options, like page, per page, etc -->
    :server-items-length="total" <!-- Total number of items available in the server -->
    :search="search" <!-- Search query -->
    :loading="isLoading" <!-- Whether the table is loading or not -->
    :loading-text="$t('generic.loading')" <!-- Loading text -->
    :no-data-text="$t('vuetify.noDataAvailable')" <!-- Text to display when there's no data available -->
    :footer-props="{ 
      showFirstLastPage: true, 
      'items-per-page-options': [10, 50, 100],
      'items-per-page-text': $t('vuetify.itemsPerPageText'),
      'page-text': $t('dataset.pageText')
    }" <!-- Properties to display in the footer -->
    item-key="id" <!-- Unique identifier for each item -->
    show-select <!-- Whether to show a select column or not -->
    @input="$emit('input', $event)" <!-- Event when an item is selected -->
  >
    <!-- Slot for top elements -->
    <template #top>
      <!-- Text field component for search input -->
      <v-text-field
        v-model="search" <!-- Search query passed as prop -->
        :prepend-inner-icon="mdiMagnify" <!-- Icon for the input -->
        :label="$t('generic.search')" <!-- Label for the input -->
        single-line <!-- Makes the input a single line -->
        hide-details <!-- Hides input details -->
        filled <!-- Applies filled style to the input -->
      />
    </template>
    <!-- Slot for each item in the table -->
    <template #[`item.name`]="{ item }">
      <!-- Nuxt link component for each item's name -->
      <nuxt-link :to="localePath(`/projects/${item.id}`)">
        <span>{{ item.name }}</span>
      </nuxt-link>
    </template>
    <!-- Slot for each item's created date -->
    <template #[`item.createdAt`]="{ item }">
      <!-- Span displaying the formatted created date -->
      <span>{{
        dateFormat(dateParse(item.createdAt, 'YYYY-MM-DDTHH:mm:ss'), 'YYYY/MM/DD HH:mm')
      }}</span>
    </template>
    <!-- Slot for each item's tags -->
    <template #[`item.tags`]="{ item }">
      <!-- Vuetify chip component for each tag -->
      <v-chip v-for="tag in item.tags" :key="tag.id" outlined v-text="tag.text" />
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { mdiMagnify } from '@mdi/js'
import { dateFormat } from '@vuejs-community/vue-filter-date-format'
import { dateParse } from '@vuejs-community/vue-filter-date-parse'
import type { PropType } from 'vue'
import Vue from 'vue'
import { DataOptions } from 'vuetify/types'
import { Project } from '~/domain/models/project/project'

export default Vue.extend({
  props: {
    isLoading: {
      type: Boolean,
      default: false,
      required: true
    },
    items: {
      type: Array as PropType<Project[]>,
      default: () => [],
      required: true
    },
    value: {
      type:
 {
      type: Array as PropType<Project[]>,
      default: () => [],
      required: true
    },
    total: {
      type: Number,
      default: 0,
      required: true
    }
  },

  data() {
    return {
      search: this.$route.query.q,
      options: {} as DataOptions,
      mdiMagnify,
      dateFormat,
      dateParse
    }
  },

  computed: {
    headers(): { text: any; value: string; sortable?: boolean }[] {
      return [
        { text: this.$t('generic.name'), value: 'name' },
        { text: this.$t('generic.description'), value: 'description', sortable: false },
        { text: this.$t('generic.type'), value: 'projectType' },
        { text: 'Created', value: 'createdAt' },
        { text: 'Author', value: 'author' },
        { text: 'Tags', value: 'tags', sortable: false }
      ]
    }
  },

  watch: {
    options: {
      handler() {
        this.updateQuery({
          query: {
            limit: this.options.itemsPerPage.toString(),
            offset: ((this.options.page - 1) * this.options.itemsPerPage).toString(),
            q: this.search
          }
        })
      },
      deep: true
    },
    search() {
      this.updateQuery({
        query: {
          limit: this.options.itemsPerPage.toString(),
          offset: '0',
          q: this.search
        }
      })
      this.options.page = 1
    }
  },

  methods: {
    updateQuery(payload: any) {
      const { sortBy, sortDesc } = this.options
      if (sortBy.length === 1 && sortDesc.length === 1) {
        payload.query.sortBy = sortBy[0]
        payload.query.sortDesc = sortDesc[0]
      } else {
        payload.query.sortBy = 'createdAt'
        payload.query.sortDesc = true
      }
      this.$emit('update:query', payload)
    }
  }
})
</script>
