<template>
  <div id="opponent-display">
    <n-badge
      v-for="player in props.otherPlayers"
      :key="player.user.socketId"
      type="info"
      size
      value="Playing..."
      :show="false">
      <OtherPlayer
        :player="player.user"
        :cards="player.remainingCards"
        :is-turn="player.isTurn" />
    </n-badge>
  </div>
</template>

<script lang="ts" setup>
import { ClientUser, OtherPlayerInfo } from '@/interfaces/client-interfaces'
import { NGrid, NGi, NBadge } from 'naive-ui'
import OtherPlayer from '@/client/components/OtherPlayer.vue'

interface Props {
  otherPlayers: OtherPlayerInfo[]
}

const props = defineProps<Props>()
</script>

<style scoped>
#opponent-display {
  height: calc((100vh - 40px) * 0.2);
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: flex-start;
}
</style>
