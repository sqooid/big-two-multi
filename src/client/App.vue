<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <n-global-style />
    <router-view v-slot="{ Component }">
      <n-message-provider>
        <n-loading-bar-provider>
          <transition name="fade-left" mode="out-in">
            <component :is="Component" />
          </transition>
        </n-loading-bar-provider>
      </n-message-provider>
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
  NMessageProvider,
  NLoadingBarProvider,
} from 'naive-ui'

import { computed, reactive, ref } from 'vue'
import { store } from '@/client/code/store'
import { SyncEvent } from '@/client/code/synchronisation'

const themeOverrides: GlobalThemeOverrides = {}

const theme = ref<any>(null)

// Theme management
document.addEventListener(SyncEvent.SETTINGS, () => {
  if (store.clientSettings.theme === 'dark') theme.value = darkTheme
  else theme.value = null
})
</script>

<style scoped></style>
