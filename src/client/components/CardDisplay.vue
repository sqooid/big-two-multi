<template>
  <div id="card-display">
    <div class="button-row" v-if="gameHasStarted">
      <div class="sorting-switch-group">
        <n-switch v-model:value="sortBySuits" class="sorting-switch" />
        <span>Group by suit</span>
      </div>
      <div v-if="gameIsEnded">
        <transition name="expand">
          <n-button @click="startGame" :disabled="!isHost" round type="primary">
            {{ isHost ? 'Start new game' : 'Wait for host to restart' }}
          </n-button>
        </transition>
      </div>
      <div v-if="isTurn && !gameIsEnded">
        <transition-group tag="div" name="expand">
          <n-button
            v-if="selectedCards.length > 0"
            @click="makePlay"
            class="play-button"
            :disabled="!validHand"
            round
            type="primary">
            Play selected cards
          </n-button>
          <n-button
            @click="makePlayPass"
            round
            secondary
            key="pass-button-key"
            type="warning">
            Pass
          </n-button>
        </transition-group>
      </div>
    </div>

    <transition-group
      name="drop-down"
      tag="div"
      class="cards-container"
      @before-enter="beforeEnterCards"
      @enter="enterCards"
      @after-enter="afterEnterCards"
      @before-leave="beforeLeaveCards"
      @leave="leaveCards">
      <playing-card
        v-for="(card, index) of sortedCardCopies"
        class="playing-card"
        :data-index="index"
        :class="{ selected: cardIndexInArray(selectedCards, card) !== -1 }"
        :style="`z-index: ${index}`"
        :key="`${card.suit},${card.value}`"
        :card="card"
        @click="toggleSelectCard(card)" />
    </transition-group>
  </div>
</template>

<script lang="ts" setup>
import {
  BoardPlay,
  Card,
  cardsEqual,
  findPlay,
  sortCards,
  validPlay,
} from '@sqooid/big-two'
import PlayingCard from '@/client/components/PlayingCard.vue'
import {
  computed,
  onMounted,
  onUpdated,
  reactive,
  ref,
  watch,
  watchEffect,
} from 'vue'
import { NButton, NTooltip, NSwitch, NH5 } from 'naive-ui'
import { globalRefs } from '@/client/code/global-refs'
import { ClientGame } from '@/interfaces/client-interfaces'
import router from '@/client/router'
import { sendPlay, startGame } from '@/client/code/session'
import { FlipTracker } from '@/client/code/flip'

// Animations (WIP)
// Enter
const beforeEnterCards = (el: any) => {
  el.style.opacity = 0
}
const enterCards = (el: any, done: () => void) => {
  const animation = el.animate(
    [
      {
        transform: 'translateY(-80px)',
        opacity: '0',
      },
      {
        transform: 'none',
        opacity: '1',
        animationDelay: 0,
      },
    ],
    {
      duration: 300,
      delay: el.dataset.index * 100,
      fill: 'none',
    },
  )
  animation.onfinish = done
}
const afterEnterCards = (el: any) => {
  el.style.removeProperty('opacity')
}
// Leave
const beforeLeaveCards = (el: any) => {
  const pos = el.getBoundingClientRect()
  el.style.position = 'fixed'
  el.style.left = pos.left + 'px'
  el.style.top = pos.top + 'px'
}
const leaveCards = (el: any, done: () => void) => {
  const animation = el.animate(
    [
      {
        transform: 'none',
        opacity: '1',
      },
      {
        transform: 'translateY(-80px)',
        opacity: '0',
      },
    ],
    {
      duration: 300,
    },
  )
  animation.onfinish = done
}

const store = globalRefs.reactiveStore

const gameIsEnded = computed(() => {
  return store.lobby?.game.winnerIndex !== -1
})

const isHost = computed(() => {
  return store.lobby?.host.socketId === store.socket?.id
})

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
watch(sortBySuits, (value) => {
  if (value) sortCards(sortedCardCopies, true)
  else sortCards(sortedCardCopies)
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

// Selected cards
const selectedCards = reactive<Card[]>([])

const cardIndexInArray = (array: Card[], card: Card): number => {
  return array.findIndex((cardInArray) => {
    return cardsEqual(cardInArray, card)
  })
}

const toggleSelectCard = (card: Card) => {
  globalRefs.flipping.read()
  const cardIndex = cardIndexInArray(selectedCards, card)
  if (cardIndex === -1) {
    selectedCards.splice(0, 0, card)
  } else {
    selectedCards.splice(cardIndex, 1)
  }
  setTimeout(() => {
    globalRefs.flipping.flip()
  }, 20)
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
  /* Vars */
  --selected-raise-height: 40px;
}
.cards-container {
  height: calc(var(--card-height) + var(--selected-raise-height));
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  transition: all 0.05s linear;
}
.playing-card {
  cursor: pointer;
  height: var(--card-height);
  max-height: var(--card-height);
  border-radius: 10px;
  box-shadow: var(--ideal-shadow);
  transition: all 0.1s ease-in-out;
  margin-right: v-bind(cardMargin);
}
.playing-card:last-child {
  margin-right: 0;
}
.playing-card:not(.selected):hover {
  transform: translateY(-10px);
}
.selected {
  /* transform: translateY(-40px); */
  border: 0.1px dashed green;
  margin-bottom: var(--selected-raise-height);
}
.button-row {
  height: 34px;
  width: 100%;
  margin-bottom: 25px;
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
@keyframes expand-anim {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
.expand {
  animation-name: expand-anim;
  animation-fill-mode: both;
  animation-duration: 0.2s;
  animation-iteration-count: 1;
}
</style>
