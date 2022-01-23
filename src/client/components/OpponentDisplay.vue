<template>
  <div id="opponent-display">
    <n-grid :cols="3" :x-gap="20">
      <n-gi v-for="player in props.otherPlayers" :key="player.user.socketId">
        <n-badge type="info" value="Playing..." :show="player.isTurn">
          <OtherPlayer :player="player.user" :cards="player.remainingCards" />
        </n-badge>
      </n-gi>
    </n-grid>
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

<style scoped></style>
