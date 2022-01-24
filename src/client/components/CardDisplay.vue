<template>
  <div id="card-display">
    <div v-if="props.cards" class="cards-container">
      <PlayingCard
        class="playing-card"
        v-for="(card, index) of props.cards"
        :style="`z-index: ${index}`"
        :key="`${card.suit},${card.value}`"
        :card="card"
        @click="selectCard(index)" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Card } from '@sqooid/big-two'
import PlayingCard from '@/client/components/PlayingCard.vue'
import { computed, ref } from 'vue'

interface Props {
  cards?: Card[]
}

const offset = ref(45)
const cardMargin = computed(() => `${offset.value - 227}px`)
const containerMargin = computed(() => `${227 - offset.value}px`)

const props = defineProps<Props>()
</script>

<style scoped>
#card-display {
  height: calc((100vh - 40px) * 0.4);
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
}
.cards-container {
  height: calc(100% - 40px);
  display: flex;
  flex-direction: row;
  margin-right: v-bind(containerMargin);
}
.playing-card {
  border-radius: 10px;
  box-shadow: var(--ideal-shadow);
  transition: all 0.1s ease-in-out;
  margin-right: v-bind(cardMargin);
}
.playing-card:hover {
  transform: translateY(-20px);
}
</style>
