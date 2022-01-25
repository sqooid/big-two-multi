<template>
  <div id="opponent-display">
    <player-info-card
      v-for="player in otherPlayers"
      :key="player.user.socketId"
      :player="player.user"
      :cards="player.remainingCards"
      :is-turn="player.isTurn" />
  </div>
</template>

<script lang="ts" setup>
import { OtherPlayerInfo } from '@/interfaces/client-interfaces'
import PlayerInfoCard from '@/client/components/PlayerInfoCard.vue'
import { globalRefs } from '@/client/code/global-refs'
import { computed } from 'vue'

const store = globalRefs.reactiveStore

const otherPlayers = computed(() => {
  const players = store.lobby?.players
  if (!players) return []

  return players.reduce((acc, user, ind) => {
    if (user.socketId !== store.socket?.id) {
      const gameHasStarted = !!store.lobby && store.lobby.game.turn > 0
      acc.push({
        user: user,
        remainingCards: store.lobby?.game.remainingCardCount[ind],
        isHost: store.lobby?.host.socketId === user.socketId,
        isTurn: gameHasStarted && store.lobby?.game.currentPlayerIndex === ind,
        isWinner: store.lobby?.game.winnerIndex === ind,
      } as OtherPlayerInfo)
    }
    return acc
  }, [] as OtherPlayerInfo[])
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
</style>
