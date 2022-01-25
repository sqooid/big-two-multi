<template>
  <div id="board-display">
    <div v-if="globalRefs.reactiveStore.lobby?.game.turn === 0">
      <n-button type="primary" round @click="onStartGame">Start game</n-button>
    </div>
    <div v-else>Board Display</div>
  </div>
</template>

<script lang="ts" setup>
import { startGame } from '@/client/code/session'
import { globalRefs } from '@/client/code/global-refs'
import { NButton } from 'naive-ui'

const onStartGame = () => {
  startGame()
}
</script>

<style scoped>
#board-display {
  height: calc((100vh - 40px) * 0.4);

  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
