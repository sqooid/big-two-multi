<template>
  <n-card class="other-player" hoverable :content-style="conditionalStyles">
    <n-h3 class="name">{{ props.player.name }}</n-h3>
    <template #action v-if="props.cards">
      <n-p>{{ cards }} cards left</n-p>
    </template>
  </n-card>
</template>

<script lang="ts" setup>
import { ClientUser } from '@/interfaces/client-interfaces'
import { NCard, NH3, NP, useThemeVars } from 'naive-ui'
import { computed } from 'vue'

interface Props {
  player: ClientUser
  cards?: number
  isTurn?: boolean
}

const conditionalStyles = computed(() => {
  return props.isTurn
    ? `background-color:${
        useThemeVars().value.infoColor
      };border-top-left-radius:3px;border-top-right-radius:3px;`
    : ''
})
const props = defineProps<Props>()
</script>

<style scoped>
.name {
  margin-bottom: 0;
}
</style>
