<template>
  <n-card
    class="player-card"
    hoverable
    :class="{
      'is-turn': props.info.isTurn && !props.info.isYou,
      'is-your-turn': props.info.isTurn && props.info.isYou,
      'is-winner': props.info.isWinner,
    }">
    <n-h3 class="name-group">
      <div class="name">
        <n-text depth="3">{{ props.info.index + 1 + ' - ' }}</n-text>
        <n-text>{{ props.info.user.name }}</n-text>
      </div>
      <n-text v-if="props.info.isYou" depth="3">(You)</n-text>
    </n-h3>
    <template #action v-if="props.info.remainingCards !== undefined">
      <n-p>{{ props.info.remainingCards }} cards left</n-p>
    </template>
  </n-card>
</template>

<script lang="ts" setup>
import { ClientUser, PlayerCardInfo } from '@/interfaces/client-interfaces'
import { NCard, NH3, NP, useThemeVars, NText } from 'naive-ui'
import { computed } from 'vue'

interface Props {
  info: PlayerCardInfo
}

const isTurnBorder = `1px solid ${useThemeVars().value.infoColor}`
const isYourTurnBorder = `3px solid ${useThemeVars().value.successColor}`
const isWinnerBorder = `3px solid ${useThemeVars().value.warningColor}`
const props = defineProps<Props>()
</script>

<style scoped>
.player-card {
  width: 40ex;
  cursor: pointer;
  max-width: 100%;
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
