<template>
  <div id="game-lobby">
    <div v-if="!rstore.lobby" class="loading-wrapper">
      <n-spin size="large">
        <template #description>Loading lobby</template>
      </n-spin>
    </div>
    <div v-else>
      <n-button @click="onToggleShowSettings" circle>
        <template #icon>
          <n-icon>
            <settings-round />
          </n-icon>
        </template>
      </n-button>
      <OpponentDisplay
        :key="opponentsKey"
        :otherPlayers="otherPlayers() ?? []" />
      <n-drawer
        v-model:show="showSettings"
        width="100%"
        height="400px"
        placement="bottom"
        to="#game-lobby"
        display-directive="show">
        <n-drawer-content title="Lobby settings">
          <LobbySettings
            :key="lobbSettingsKey"
            :settings="rstore.lobby.settings"
            :is-host="rstore.lobby.host.socketId === rstore.socket?.id ?? ''" />
        </n-drawer-content>
      </n-drawer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import router from '@/client/router'
import { NDrawer, NDrawerContent, NButton, NSpin, NIcon } from 'naive-ui'
import { RsvpOutlined, SettingsRound } from '@vicons/material'
import LobbySettings from '@/client/components/LobbySettings.vue'
import { store } from '@/client/code/store'
import { computed, onUnmounted, reactive, ref } from 'vue'
import OpponentDisplay from '@/client/components/OpponentDisplay.vue'
import { OtherPlayerInfo } from '@/interfaces/client-interfaces'
import { SyncEvent } from '@/client/code/synchronisation'

const rstore = reactive(store)

// Update keys
const lobbSettingsKey = ref(0)
const opponentsKey = ref(0)

// Update listeners
const updateUsers = () => {
  opponentsKey.value++
  lobbSettingsKey.value++
}
document.addEventListener(SyncEvent.lobby.USERS, updateUsers)

// Remove listeners
onUnmounted(() => {
  document.removeEventListener(SyncEvent.lobby.USERS, updateUsers)
})

const showSettings = ref(false)

const onToggleShowSettings = () => {
  showSettings.value = !showSettings.value
}
// Input to settings

// Input to other player display
const otherPlayers = () => {
  console.log('fdas')
  const otherUsers =
    rstore.lobby?.players.filter((user) => {
      return user.socketId !== rstore.socket?.id
    }) ?? []
  return otherUsers.map((user, ind) => {
    return {
      user: user,
      remainingCards: rstore.lobby?.game.remainingCardCount[ind],
      isHost: rstore.lobby?.host.socketId === user.socketId,
      isTurn:
        rstore.lobby?.game.turn &&
        rstore.lobby?.game.currentPlayerIndex === ind,
    }
  })
}

// Lobby ID TODO
// const id = router.currentRoute.value.params.id
</script>

<style scoped>
.loading-wrapper {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
