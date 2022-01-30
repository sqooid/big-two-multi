<template>
  <div id="card-display">
    <div class="button-row" v-if="gameHasStarted">
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
        v-for="({ card }, index) of cardArray"
        class="playing-card"
        :data-index="index"
        :class="{ selected: cardIndexInArray(selectedCards, card) !== -1 }"
        :style="`z-index: ${index}`"
        :key="`${card.suit},${card.value}`"
        :card="card" />
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
import router from '@/client/router'
import { sendPlay, startGame } from '@/client/code/session'
import { elementLight } from 'naive-ui/lib/element/styles'
import clear from 'naive-ui/lib/_internal/clear'

const store = globalRefs.reactiveStore

// Custom order
const cardArray: { card: Card; el?: HTMLElement }[] = reactive([])

const cardRefs: HTMLElement[] = []
interface screenPos {
  x: number
  y: number
}

let cardMoved = false
const mouseDownPos = { x: 0, y: 0 }
let grabbedCardIndex = -1
const lastPos = { x: 0, y: 0 }
const deltaPos = { x: 0, y: 0 }
let lastCardPosX = 0

const getPos = (e: MouseEvent): screenPos => {
  return {
    x: e.screenX,
    y: e.screenY,
  }
}

const getGrabbedEl = (): HTMLElement | undefined => {
  return cardArray[grabbedCardIndex].el
}

const setTransform = (offsetX: number) => {
  const elem = getGrabbedEl()
  if (!elem) return
  elem.style.transform = `translate(${offsetX}px)`
  if (!elem.classList.contains('selected')) {
    elem.style.marginBottom = '40px'
  }
}

const removeTransform = () => {
  const elem = getGrabbedEl()
  if (!elem) return
  elem.style.removeProperty('transform')
  elem.style.removeProperty('margin-bottom')
}

const getIndex = (e: HTMLElement): number => {
  return cardArray.findIndex(({ card, el }) => {
    return e === el
  })
}

const onMouseDown = (e: MouseEvent) => {
  cardMoved = false
  Object.assign(mouseDownPos, getPos(e))

  const elem = e.target as HTMLElement
  if (!elem) return

  Object.assign(lastPos, getPos(e))
  lastCardPosX = lastPos.x
  deltaPos.x = 0
  deltaPos.y = 0
  grabbedCardIndex = getIndex(e.target as HTMLElement)
  setTransform(0)

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

const onMouseUp = (e: MouseEvent) => {
  if (
    Math.abs(mouseDownPos.x - getPos(e).x) < 5 &&
    Math.abs(mouseDownPos.y - getPos(e).y) < 5
  ) {
    toggleSelectCard(cardArray[grabbedCardIndex].card)
  }

  const elem = getGrabbedEl()
  if (!elem) return
  elem.style.removeProperty('transition')
  removeTransform()

  grabbedCardIndex = -1

  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
}

const onMouseMove = (e: MouseEvent) => {
  cardMoved = true

  const elem = getGrabbedEl()
  if (!elem) return

  elem.style.transition = 'none'
  const index = getIndex(elem)

  if (grabbedCardIndex !== index) return
  const currPos = getPos(e)
  const deltaX = currPos.x - lastPos.x
  const deltaY = currPos.y - lastPos.y
  Object.assign(lastPos, currPos)

  deltaPos.x += deltaX
  deltaPos.y += deltaY

  if (currPos.x - lastCardPosX < -cardSpacing.value && grabbedCardIndex > 0) {
    lastCardPosX = currPos.x
    deltaPos.x = 0
    setTransform(deltaPos.x)
    shiftCard(index, 'left')
    grabbedCardIndex--
  } else if (
    currPos.x - lastCardPosX > cardSpacing.value &&
    grabbedCardIndex < 12
  ) {
    lastCardPosX = currPos.x
    deltaPos.x = 0
    setTransform(deltaPos.x)
    shiftCard(index, 'right')
    grabbedCardIndex++
  } else {
    setTransform(deltaPos.x)
  }
}

const onMouseOver = (e: MouseEvent) => {
  // const elem = e.target as HTMLElement
  // if (grabbedCardIndex === -1) {
  //   elem.classList.add('playing-card-hover')
  //   elem.addEventListener('mouseleave', onMouseLeave)
  // }
}

const onMouseLeave = (e: MouseEvent) => {
  const elem = e.target as HTMLElement

  if (getIndex(elem) !== grabbedCardIndex) {
    elem.classList.remove('playing-card-hover')
    elem.removeEventListener('mouseleave', onMouseLeave)
  }
}

const addCardRef = (el: HTMLElement, index: number) => {
  cardArray[index].el = el
  el.addEventListener('mousedown', onMouseDown)
  el.addEventListener('mouseover', onMouseOver)
}

const shiftCard = (index: number, direction: 'left' | 'right') => {
  if (direction === 'left') {
    if (index > 0) {
      swapCardIndices(index - 1, index)
    }
  } else {
    if (index < 12) {
      swapCardIndices(index + 1, index)
    }
  }
}
const swapCardIndices = (index1: number, index2: number) => {
  const el1 = cardArray[index1].el
  const el2 = cardArray[index2].el
  if (!el1 || !el2) return

  swapIndices(cardArray, index1, index2)
}

const swapIndices = (array: any, index1: number, index2: number) => {
  const temp = array[index1]
  array[index1] = array[index2]
  array[index2] = temp
}

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

  // Setting card refs here to avoid bugginess
  addCardRef(el, Number(el.dataset.index))
}
// Leave
const beforeLeaveCards = (el: any) => {
  let pos = removedCardPosQueue.shift() as screenPos
  if (!pos) pos = el.getBoundingClientRect()
  console.log(pos)
  el.style.position = 'absolute'
  el.style.left = pos.x + 'px'
  el.style.top = pos.y + 'px'
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

// Current cards management
let lastRoundNumber: number | undefined = undefined
const clearCardArray = (round: number | undefined) => {
  if (round !== lastRoundNumber) {
    lastRoundNumber = round
    // Clear existing hand
    cardArray.length = 0
    // Clear existing chosen cards
    selectedCards.length = 0
  }
}
watch(() => store.lobby?.roundNumber, clearCardArray)

const removedCardPosQueue: { x: number; y: number }[] = [] // Store positions of removed cards before it gets messed up
const setNewCards = (newCards: Card[] | undefined) => {
  if (!newCards) return

  if (cardArray.length === 0) {
    newCards.forEach((card) => {
      cardArray.push({ card })
    })
    return
  }

  for (let i = cardArray.length - 1; i >= 0; i--) {
    const card = cardArray[i].card
    const index = newCards?.findIndex((newCard) => cardsEqual(card, newCard))
    if (index === -1) {
      const elem = cardArray.splice(i, 1)[0]
      const el = elem.el
      if (!el) continue
      removedCardPosQueue.push(el.getBoundingClientRect())
    }
  }
}
watch(() => store.lobby?.game.cards, setNewCards)
setNewCards(store.lobby?.game.cards)

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

const cardSpacing = ref(40)
const cardWidth = 178.56
const cardMargin = computed(() => `${cardSpacing.value - cardWidth}px`)
const containerMargin = computed(() => `${cardWidth - cardSpacing.value}px`)

const cardContainerWidth = computed(() => {
  const width = (cardArray.length - 1) * cardSpacing.value + cardWidth
  return width + 'px'
})
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
  width: v-bind(cardContainerWidth);
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
  margin-bottom: 10px;
}
.playing-card-hover {
  margin-bottom: 10px;
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
