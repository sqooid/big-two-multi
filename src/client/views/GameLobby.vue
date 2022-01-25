<template>
  <div id="game-lobby">
    <div v-if="loadingLobby" class="loading-wrapper">
      <n-spin size="large">
        <template #description>Loading lobby</template>
      </n-spin>
    </div>
    <div v-else-if="store.lobby">
      <OpponentDisplay />
      <BoardDisplay />
      <CardDisplay :cards="store.lobby.game.cards" />
      <LobbySettingsButton @click="onShowSettings" />
      <n-drawer
        v-model:show="showSettings"
        width="300px"
        placement="left"
        to="#game-lobby"
        display-directive="show">
        <n-drawer-content title="Settings">
          <lobby-settings-panel />
        </n-drawer-content>
      </n-drawer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import router from '@/client/router'
import { NDrawer, NDrawerContent, NSpin, useMessage } from 'naive-ui'
import LobbySettings from '@/client/components/LobbySettingsMenu.vue'
import { globalRefs } from '@/client/code/global-refs'
import { computed, onUnmounted, reactive, ref, watch } from 'vue'
import OpponentDisplay from '@/client/components/OpponentDisplay.vue'
import { OtherPlayerInfo } from '@/interfaces/client-interfaces'
import { JoinEvent, SyncEvent } from '@/client/code/synchronisation'
import { joinLobby, startUser } from '@/client/code/session'
import CardDisplay from '@/client/components/CardDisplay.vue'
import BoardDisplay from '@/client/components/BoardDisplay.vue'
import LobbySettingsButton from '@/client/components/LobbySettingsButton.vue'
import LobbySettingsPanel from '@/client/components/LobbySettingsPanel.vue'

const store = globalRefs.reactiveStore

const message = useMessage()
const loadingLobby = ref(true)
// Handling joining straight from URL
if (!store.socket) {
  const id = router.currentRoute.value.params.id as string
  startUser()
  joinLobby(id)
  const joinFail = () => {
    message.error('Failed to join lobby')
    document.removeEventListener(JoinEvent.FAIL, joinFail)
    router.push({ name: 'home' }).then(() => store.socket?.disconnect())
  }
  document.addEventListener(JoinEvent.FAIL, joinFail)
  const joinSuccess = () => {
    document.removeEventListener(JoinEvent.FAIL, joinFail)
    document.removeEventListener(JoinEvent.SUCCESS, joinSuccess)
  }
  document.addEventListener(JoinEvent.SUCCESS, joinSuccess)
  // Lobby receive listening
  watch(
    () => globalRefs.reactiveStore.lobby,
    (lobby) => {
      if (lobby !== undefined) {
        loadingLobby.value = false
      }
    },
  )
} else {
  loadingLobby.value = false
}

const showSettings = ref(false)

const onShowSettings = () => {
  showSettings.value = true
}
</script>

<style scoped>
#game-lobby {
  padding: 20px;
}
.loading-wrapper {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
