<template>
  <!-- Renders a reusable BaseCard component for user login form -->
  <base-card
    :disabled="!valid"
    :title="$t('user.login')"
    :agree-text="$t('user.login')"
    @agree="tryLogin"
  >
    <template #content>
      <!-- Renders a Vue form component for user login input fields -->
      <v-form v-model="valid">
        <!-- Renders a Vue alert component for error messages -->
        <v-alert v-show="showError" v-model="showError" type="error" dismissible>
          {{ $t('errors.invalidUserOrPass') }}
        </v-alert>
        <!-- Renders a Vue text-field component for username input -->
        <v-text-field
          v-model="username"
          :rules="userNameRules($t('rules.userNameRules'))"
          :label="$t('user.username')"
          name="username"
          :prepend-icon="mdiAccount"
          type="text"
          autofocus
          @keyup.enter="tryLogin"
        />
        <!-- Renders a Vue text-field component for password input -->
        <v-text-field
          id="password"
          v-model="password"
          :rules="passwordRules($t('rules.passwordRules'))"
          :label="$t('user.password')"
          name="password"
          :prepend-icon="mdiLock"
          type="password"
          @keyup.enter="tryLogin"
        />
      </v-form>
    </template>
  </base-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mdiAccount, mdiLock } from '@mdi/js'
import { userNameRules, passwordRules } from '@/rules/index'
import BaseCard from '@/components/utils/BaseCard.vue'

export default Vue.extend({
  components: {
    BaseCard
  },

  props: {
    login: {
      type: Function,
      default: () => Promise
    }
  },

  data() {
    // Defines data properties for user login form component
    return {
      valid: false,
      username: '',
      password: '',
      userNameRules,
      passwordRules,
      showError: false,
      mdiAccount,
      mdiLock
    }
  },

  methods: {
    // Method to handle user login attempt
    async tryLogin() {
      try {
        // Calls login prop function with user credentials and redirects to projects page on success
        await this.login({
          username: this.username,
          password: this.password
        })
        this.$router.push(this.localePath('/projects'))
      } catch {
        // Sets showError data property to true on login failure
        this.showError = true
      }
    }
  }
})
</script>
