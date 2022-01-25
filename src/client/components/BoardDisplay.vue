<template>
  <div id="board-display">
    <div v-if="!gameHasStarted">
      <n-button v-if="isHost" type="primary" round @click="onStartGame">
        Start game
      </n-button>
      <n-button v-else type="primary" round disabled>
        Wait for host to start game
      </n-button>
    </div>
    <n-carousel v-else draggable :loop="false" show-arrow class="carousel">
      <play-item v-for="play of previousPlays" :play="play" />
    </n-carousel>
  </div>
</template>

<script lang="ts" setup>
import { startGame } from '@/client/code/session'
import { globalRefs } from '@/client/code/global-refs'
import { NButton, NCarousel } from 'naive-ui'
import { computed } from 'vue'
import PlayItem from '@/client/components/PlayItem.vue'
import PlayingCard from './PlayingCard.vue'
import { newCard } from '@sqooid/big-two'

const store = globalRefs.reactiveStore

const isHost = computed(() => {
  return store.lobby?.host.socketId === store.socket?.id
})
const gameHasStarted = computed(() => {
  return store.lobby?.game.turn ?? 0 > 0
})

const previousPlays = computed(() => {
  return store.lobby?.game.board || []
})

const onStartGame = () => {
  startGame()
}
</script>

<style scoped>
#board-display {
  height: 350px;
  max-height: calc((100vh - 40px) * 0.4);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card {
  width: 100px;
}
.thing {
  width: 100px;
  height: 100px;
}
.carousel-container {
  max-width: 100%;
}
</style>
