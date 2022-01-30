<template>
  <n-card
    class="player-card"
    hoverable
    :class="{
      'is-turn': props.isTurn && !props.isYou,
      'is-your-turn': props.isTurn && props.isYou,
      'is-winner': props.isWinner,
    }">
    <n-h3 class="name-group">
      <div class="name">
        <n-text depth="3">{{ props.index + 1 + ' - ' }}</n-text>
        <n-text>{{ props.player.name }}</n-text>
      </div>
      <n-text v-if="props.isYou" depth="3">(You)</n-text>
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
const isWinnerBorder = `3px solid ${useThemeVars().value.warningColor}`
const props = defineProps<Props>()
</script>

<style scoped>
.player-card {
  width: 40ex;
  max-width: 20%;
  transition: all 0.1s linear;
}
.name-group {
  margin-bottom: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.name {
  text-overflow: ellipsis;
  overflow-x: hidden;
  white-space: nowrap;
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
