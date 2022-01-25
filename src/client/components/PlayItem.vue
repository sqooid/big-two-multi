<template>
  <div class="play-item">
    <n-h5>{{ comboDescription }}</n-h5>
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
import { NH5 } from 'naive-ui'
import { computed } from 'vue'

interface Props {
  play: BoardPlay
}
const props = defineProps<Props>()

const comboDescription = computed(() => {
  return `${getComboName(props.play.play.combo)} - ${getCardName(
    props.play.play.comboValue,
  )}`
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
.cards-container {
  display: flex;
  flex-direction: row;
  height: calc(100% - 80px);
}
.play-item-card {
  box-shadow: var(--ideal-shadow);
  border-radius: 10px;
  margin-right: 20px;
}
</style>
