<template>
  <n-card
    class="player-card"
    hoverable
    :class="{
      'is-turn': props.isTurn && !props.isYou,
      'is-your-turn': props.isTurn && props.isYou,
      'is-winner': props.isWinner,
    }">
    <n-h3 class="name">
      <n-text depth="3">{{ props.index + 1 }} -</n-text>
      {{ props.player.name }}{{ props.isYou ? ' (You)' : '' }}
    </n-h3>
    <template #action v-if="props.cards !== undefined">
      <n-p>{{ cards }} cards left</n-p>
    </template>
  </n-card>
</template>

<script lang="ts" setup>
import { ClientUser } from '@/interfaces/client-interfaces'
import { NCard, NH3, NP, useThemeVars, NText } from 'naive-ui'
import { computed } from 'vue'

interface Props {
  player: ClientUser
  index: number
  cards?: number
  isTurn?: boolean
  isWinner?: boolean
  isYou?: boolean
}

const isTurnBorder = `1px solid ${useThemeVars().value.infoColor}`
const isYourTurnBorder = `3px solid ${useThemeVars().value.successColor}`
const isWinnerBorder = `1px solid ${useThemeVars().value.warningColor}`
const props = defineProps<Props>()
</script>

<style scoped>
.player-card {
  width: fit-content;
  transition: border 0.1s linear;
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
.is-your-turn {
  border: v-bind(isYourTurnBorder);
}
</style>
