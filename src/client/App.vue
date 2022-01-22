<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <n-global-style />
    <router-view v-slot="{ Component }">
      <transition name="fade-left" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </n-config-provider>
</template>

<script lang="ts" setup>
import './styles.css'

import {
  darkTheme,
  GlobalThemeOverrides,
  NConfigProvider,
  NGlobalStyle,
} from 'naive-ui'

import { computed, reactive } from 'vue'
import { store } from '@/client/code/store'

const themeOverrides: GlobalThemeOverrides = {}

const clienSettings = reactive(store.clientSettings)

// Theme management
const theme = computed(() => {
  if (clienSettings.theme === 'light') return null
  return darkTheme
})
</script>

<style scoped></style>
