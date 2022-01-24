<template>
  <div id="card-display">
    <div v-if="props.cards" class="cards-container">
      <PlayingCard
        class="playing-card"
        :class="{ selected: selectedCards.indexOf(card) !== -1 }"
        v-for="(card, index) of sortedCards"
        :style="`z-index: ${index}`"
        :key="`${card.suit},${card.value}`"
        :card="card"
        @click="toggleSelectCard(card)" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Card, sortCards } from '@sqooid/big-two'
import PlayingCard from '@/client/components/PlayingCard.vue'
import { computed, reactive, ref } from 'vue'

interface Props {
  cards?: Card[]
  sortBySuits?: boolean
}
const props = defineProps<Props>()

const cardsCopy = [...(props.cards ?? [])]
const sortedCards = computed(() => {
  if (!props.cards) return []
  if (props.sortBySuits) return sortCards(cardsCopy, true)
  else return sortCards(cardsCopy)
})

const selectedCards = reactive<Card[]>([])

const toggleSelectCard = (card: Card) => {
  const cardIndex = selectedCards.indexOf(card)
  if (cardIndex === -1) {
    selectedCards.splice(0, 0, card)
  } else {
    selectedCards.splice(cardIndex, 1)
  }
}

const offset = ref(60)
const cardMargin = computed(() => `${offset.value - 227}px`)
const containerMargin = computed(() => `${227 - offset.value}px`)
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
  cursor: pointer;
  border-radius: 10px;
  box-shadow: var(--ideal-shadow);
  transition: all 0.1s ease-in-out;
  margin-right: v-bind(cardMargin);
}
.playing-card:not(.selected):hover {
  transform: translateY(-20px);
}
.selected {
  transform: translateY(-40px);
  border: 0.1px dashed green;
}
</style>
