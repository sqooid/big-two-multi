<template>
  <n-button circle class="lobby-settings-button">
    <template #icon>
      <n-icon>
        <settings-round />
      </n-icon>
    </template>
  </n-button>
</template>

<script lang="ts" setup>
import { NButton, NIcon } from 'naive-ui'
import { SettingsRound } from '@vicons/material'
</script>

<style scoped>
.lobby-settings-button {
  position: fixed;
  top: 20px;
  left: 20px;
}
</style>
