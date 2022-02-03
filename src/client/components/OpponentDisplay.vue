<template>
  <transition-group name="expand" tag="div" id="opponent-display">
    <div
      class="wrapper"
      v-for="player in playerList"
      :key="player.user.socketId">
      <n-popover trigger="click" width="trigger">
        <template #trigger>
          <player-info-card :info="player" />
        </template>
        <player-card-popover :info="player" />
      </n-popover>
    </div>
  </transition-group>
</template>

<script lang="ts" setup>
import PlayerInfoCard from '@/client/components/PlayerInfoCard.vue'
import { globalRefs } from '@/client/code/global-refs'
import { computed } from 'vue'
import { NPopover } from 'naive-ui'
import PlayerCardPopover from '@/client/components/PlayerCardPopover.vue'

const store = globalRefs.reactiveStore

const playerList = computed(() => {
  const players = store.lobby?.players
  if (!players) return []

  return players.map((user, ind) => {
    const gameHasStarted = !!store.lobby && store.lobby.game.turn > 0
    const winnerIndex = store.lobby?.game.winnerIndex
    const gameHasEnded = winnerIndex !== -1
    const isPlayersTurn =
      gameHasStarted &&
      !gameHasEnded &&
      store.lobby?.game.currentPlayerIndex === ind
    return {
      user: user,
      index: ind,
      remainingCards: store.lobby?.game.remainingCardCount[ind],
      isHost: store.lobby?.host.socketId === user.socketId,
      isTurn: isPlayersTurn,
      isWinner: winnerIndex === ind,
      isYou: user.socketId === store.socket?.id,
    }
  })
})
</script>

<style scoped>
#opponent-display {
  height: 180px;
  max-height: calc((100vh - 40px) * 0.2);
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: flex-start;
}
.wrapper {
  max-width: 20%;
}
</style>
