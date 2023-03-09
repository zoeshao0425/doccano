<template>
  <v-card class="elevation-0">
    <!-- A card to display a comment -->
    <v-card-title>
      <v-list-item class="grow ps-0">
        <!-- A list item that displays the avatar, username, and timestamp of the comment -->
        <v-list-item-avatar>
          <v-icon large>
            {{ mdiAccountCircle }}
          </v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ comment.username }}</v-list-item-title>
          <v-list-item-subtitle>
            <!-- A filter to display the timestamp of the comment in a readable format -->
            {{
              comment.createdAt | dateParse('YYYY-MM-DDTHH:mm:ss') | dateFormat('DD/MM/YYYY HH:mm')
            }}
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-row align="center" justify="end">
          <!-- A menu to edit or delete the comment if the user is the owner of the comment -->
          <v-menu v-if="comment.user == userId" bottom left>
            <template #activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>{{ mdiDotsVertical }}</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item>
                <!-- A button to edit the comment -->
                <v-list-item-title @click="showEdit = true"> Edit </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <!-- A button to delete the comment -->
                <v-list-item-title @click="$emit('delete-comment', comment)">
                  Delete
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-row>
      </v-list-item>
    </v-card-title>

    <v-card-text class="body-1">
      <span v-if="!showEdit">
        <!-- Display the comment text if the edit mode is not active -->
        {{ comment.text }}
      </span>
      <v-form v-else v-model="valid">
        <!-- A form to edit the comment if the edit mode is active -->
        <v-row>
          <!-- A textarea to enter the new comment text -->
          <v-textarea v-model="editText" auto-grow rows="1" solo :rules="commentRules" />
        </v-row>
        <v-row justify="end">
          <!-- A button to cancel editing the comment -->
          <v-btn text class="text-capitalize" @click="cancel"> Cancel </v-btn>
          <!-- A button to update the comment with the new text -->
          <v-btn
            :disabled="!valid"
            color="primary"
            class="text-capitalize"
            @click="updateComment(editText)"
          >
            Update
          </v-btn>
        </v-row>
      </v-form>
    </v-card-text>
    <!-- A divider to separate comments -->
    <v-divider />
  </v-card>
</template>

<script lang="ts">
import { mdiAccountCircle, mdiDotsVertical } from '@mdi/js'
import VueFilterDateFormat from '@vuejs-community/vue-filter-date-format'
import VueFilterDateParse from '@vuejs-community/vue-filter-date-parse'
import type { PropType } from 'vue'
import Vue from 'vue'
import { CommentItem } from '~/domain/models/comment/comment'
Vue.use(VueFilterDateFormat)
Vue.use(VueFilterDateParse)

export default Vue.extend({
  props: {
    comment: {
      required: true,
      type: Object as PropType<CommentItem>
    },
    userId: {
      required: true,
      type: Number
