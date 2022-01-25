<template>
  <n-card
    class="player-card"
    hoverable
    :class="{ 'is-turn': props.isTurn, 'is-winner': props.isWinner }">
    <n-h3 class="name">{{ props.player.name }}</n-h3>
    <template #action v-if="props.cards !== undefined">
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
  isWinner?: boolean
}

const isTurnBorder = `1px solid ${useThemeVars().value.infoColor}`
const isWinnerBorder = `1px solid ${useThemeVars().value.warningColor}`
const props = defineProps<Props>()
</script>

<style scoped>
.player-card {
  width: fit-content;
}
.name {
  margin-bottom: 0;
}
.is-turn {
  border: v-bind(isTurnBorder);
}
.is-winner {
  border: v-bind(isWinnerBorder);
}
</style>
