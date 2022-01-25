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
import {
  globalRefs,
  State,
  ThemeSetting,
  unreactiveStore,
} from '@/client/code/global-refs'
import { SyncEvent } from '@/client/code/synchronisation'
import { getKey, StorageKeys } from '@/client/code/storage'

// Setting up store
const reactiveStore = reactive(unreactiveStore)
globalRefs.reactiveStore = reactiveStore as State
const store = globalRefs.reactiveStore // For consistency

const themeOverrides: GlobalThemeOverrides = {}

const theme = computed(() => {
  if (store?.clientSettings.theme === 'dark') return darkTheme
  return null
})

// Loading default client settings
store.clientSettings.theme = getKey(StorageKeys.DEFAULT_THEME) as ThemeSetting
store.clientSettings.name = getKey(StorageKeys.DEFAULT_NAME)
</script>

<style scoped></style>
