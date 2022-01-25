<template>
  <lobby-settings-menu />
  <n-divider />
  <client-settings-menu />
</template>

<script lang="ts" setup>
import LobbySettingsMenu from '@/client/components/LobbySettingsMenu.vue'
import ClientSettingsMenu from '@/client/components/ClientSettingsMenu.vue'
import { NDivider } from 'naive-ui'
</script>

<style scoped>
.spacer {
  height: 20px;
}
</style>
