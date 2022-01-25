<template>
  <div class="play-item">
    <n-h5 class="combo-description">{{ comboDescription }}</n-h5>
    <n-p class="player-description">{{ playerDescription }}</n-p>
    <div class="cards-container">
      <playing-card
        v-for="card of props.play.play.cards"
        :card="card"
        class="play-item-card" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { BoardPlay, getCardName, getComboName } from '@sqooid/big-two'
import PlayingCard from './PlayingCard.vue'
import { NH5, NP } from 'naive-ui'
import { computed } from 'vue'

interface Props {
  play: BoardPlay
  playerName: string
}
const props = defineProps<Props>()

const comboDescription = computed(() => {
  return `${getComboName(props.play.play.combo)} - ${getCardName(
    props.play.play.comboValue,
  )}`
})

const playerDescription = computed(() => {
  return `Played by ${props.playerName}`
})
</script>

<style scoped>
.play-item {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.combo-description {
  margin: 0;
}
.player-description {
  margin: 0;
}
.cards-container {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  height: calc(100% - 80px);
}
.play-item-card {
  box-shadow: var(--ideal-shadow);
  border-radius: 10px;
  margin-right: 20px;
}
.play-item-card:last-child {
  margin-right: 0;
}
</style>
