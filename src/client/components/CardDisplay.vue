<template>
  <div id="card-display">
    <div class="button-row" v-if="gameHasStarted">
      <div class="sorting-switch-group">
        <n-switch v-model:value="sortBySuits" class="sorting-switch" />
        <span>Group by suit</span>
      </div>
      <div v-if="isTurn">
        <n-button
          @click="makePlay"
          class="play-button"
          v-if="selectedCards.length > 0"
          :disabled="!validHand"
          round
          type="primary">
          {{ selectedCards.length ? 'Play selected cards' : 'Pass' }}
        </n-button>
        <n-button @click="makePlayPass" round secondary type="warning">
          Pass
        </n-button>
      </div>
    </div>

    <!-- <transition-group tag="div" name="cards" class="cards-container"> -->
    <div class="cards-container" :class="{ sorting: isSortingCards }">
      <playing-card
        v-for="(card, index) of sortedCardCopies"
        class="playing-card"
        :class="{ selected: selectedCards.indexOf(card) !== -1 }"
        :style="`z-index: ${index}`"
        :key="`${card.suit},${card.value}`"
        :card="card"
        @click="toggleSelectCard(card)" />
    </div>
    <!-- </transition-group> -->
  </div>
</template>

<script lang="ts" setup>
import {
  BoardPlay,
  Card,
  findPlay,
  sortCards,
  validPlay,
} from '@sqooid/big-two'
import PlayingCard from '@/client/components/PlayingCard.vue'
import { computed, reactive, ref, watch, watchEffect } from 'vue'
import { NButton, NTooltip, NSwitch, NH5 } from 'naive-ui'
import { globalRefs } from '@/client/code/global-refs'
import { ClientGame } from '@/interfaces/client-interfaces'
import router from '@/client/router'
import { sendPlay } from '@/client/code/session'

const store = globalRefs.reactiveStore

// Attempted transition fix
// let cardRefs = []
// const cardAddRef = (el: any) => {
//   if (el) {
//     cardRefs.push(el)
//     const cardRoot = el.rootNode as HTMLElement
//     cardRoot.addEventListener('mouseover', () => {
//       cardRoot.style.transform = 'translateY(-60px)'
//     })
//   }
// }
// watch(sortedCardCopies, () => {
//   cardRefs = []
// })

const isTurn = computed(() => {
  return store.lobby?.game.currentPlayerIndex === store.lobby?.game.playerIndex
})

const gameHasStarted = computed(() => {
  return store.lobby?.game.turn !== 0
})

if (store.lobby?.game === undefined) {
  router.push({ name: 'home' })
}

const sortBySuits = ref(false)
const sortedCardCopies = reactive<Card[]>([])

watchEffect(() => {
  sortedCardCopies.splice(0, Infinity, ...(store.lobby?.game.cards ?? []))
})

// Sorting
const isSortingCards = ref(false)
watch(sortBySuits, (value) => {
  isSortingCards.value = true
  setTimeout(() => {
    if (value) sortCards(sortedCardCopies, true)
    else sortCards(sortedCardCopies)
    setTimeout(() => {
      isSortingCards.value = false
    }, 50)
  }, 50)
})

const sortedCards = computed(() => {
  const cards = store.lobby?.game.cards || []
  if (cards.length === 0) return []
  if (sortBySuits.value) {
    return sortCards(cards, true)
  } else {
    return sortCards(cards)
  }
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

const validHand = computed(() => {
  if (selectedCards.length === 0) return true
  const play = findPlay(selectedCards)
  const playerIndex = store.lobby?.game.playerIndex as number
  if (!play || playerIndex === undefined) return false
  const prevPlay = store.lobby?.game.board[store.lobby?.game.board.length - 1]
  return validPlay(
    {
      playerIndex,
      play,
    },
    prevPlay,
  )
})

const makePlay = () => {
  if (selectedCards.length === 0) {
    sendPlay()
    return
  }
  const play = findPlay(selectedCards)
  sendPlay(play)
  selectedCards.splice(0, Infinity)
}
const makePlayPass = () => {
  sendPlay()
}

const offset = ref(60)
const cardWidth = 200
const cardMargin = computed(() => `${offset.value - cardWidth}px`)
const containerMargin = computed(() => `${cardWidth - offset.value}px`)
</script>

<style scoped>
#card-display {
  max-height: calc((100vh - 40px) * 0.4);
  height: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
}
.cards-container {
  height: calc(100% - 80px);
  display: flex;
  flex-direction: row;
  margin-right: v-bind(containerMargin);
  transition: all 0.05s linear;
}
.playing-card {
  cursor: pointer;
  border-radius: 10px;
  box-shadow: var(--ideal-shadow);
  transition: all 0.1s ease-in-out;
  margin-right: v-bind(cardMargin);
}
.playing-card:not(.selected):hover {
  transform: translateY(-10px);
}
.selected {
  transform: translateY(-40px);
  border: 0.1px dashed green;
}
.button-row {
  width: 100%;
  margin-bottom: 45px;
  position: relative;
  display: flex;
  justify-content: center;
}
.play-button {
  margin-right: 10px;
}
.sorting-switch-group {
  position: absolute;
  left: 0;
}
.sorting-switch {
  margin-right: 10px;
}
.sorting {
  opacity: 0;
}
</style>
