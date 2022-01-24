<template>
  <n-button circle>
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

<style scoped></style>
