<template>
  <div class="lobby-settings">
    <n-form :disabled="!isHost || !props.settings">
      <n-form-item label="Redeal on 4 two's">
        <n-switch v-model:value="settings.deal.fourTwos"></n-switch>
      </n-form-item>
      <n-form-item label="Redeal on no faces">
        <n-switch v-model:value="settings.deal.noFaces"></n-switch>
      </n-form-item>
      <n-form-item label="Deal all (when less than 4 players)">
        <n-switch v-model:value="settings.deal.distributeAll"></n-switch>
      </n-form-item>
      <n-form-item label="Winner starts">
        <n-switch v-model:value="settings.deal.randomHands"></n-switch>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
import { LobbySettings } from '@/interfaces/client-interfaces'
import { NForm, NFormItem, NSwitch } from 'naive-ui'
import { toRefs } from 'vue'

interface Props {
  isHost: boolean
  settings: LobbySettings
}
const props = defineProps<Props>()

const settings = toRefs(props.settings)
</script>

<style scoped>
.lobby-settings {
  height: 100%;
}
</style>
