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
import { rstore, State, store } from '@/client/code/store'
import { SyncEvent } from '@/client/code/synchronisation'

// Setting up store
const reactiveStore = reactive(store)
rstore.store = reactiveStore as State
console.log(rstore.store)

const themeOverrides: GlobalThemeOverrides = {}

const theme = computed(() => {
  if (rstore.store?.clientSettings.theme === 'dark') return darkTheme
  return null
})
</script>

<style scoped></style>
