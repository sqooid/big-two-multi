<template>
  <div class="home-page center-wrapper">
    <n-space vertical>
      <h1 class="name">Big Two</h1>
      <n-space justify="center">
        <!-- Create -->
        <n-button :loading="createLoading" @click="onCreate">Create</n-button>
      </n-space>
      <n-space justify="center">
        <!-- Join -->
        <n-input-group class="input-group">
          <n-input
            v-model:value="joinId"
            placeholder="Lobby code"
            @keydown.enter="onJoin" />
          <n-button :loading="joinLoading" @click="onJoin">Join</n-button>
        </n-input-group>
      </n-space>
      <!-- Theme -->
      <n-switch :on-update:value="onSwitchTheme"></n-switch>
    </n-space>
  </div>
</template>

<script lang="ts" setup>
import { joinLobby, startLobby, startUser } from '@/client/code/session'
import { store } from '@/client/code/store'
import { JoinEvent, SyncEvent } from '@/client/code/synchronisation'
import router from '@/client/router'
import {
  NSpace,
  NButton,
  NInput,
  NInputGroup,
  NSwitch,
  useMessage,
} from 'naive-ui'
import { computed, onUnmounted, reactive, ref, watch } from 'vue'

const message = useMessage()

// Lobby receive listening
const lobbyListener = () => {
  if (!store.lobby?.id) return
  createLoading.value = false
  document.removeEventListener(SyncEvent.LOBBY, lobbyListener)
  router.push({ name: 'lobby', params: { id: store.lobby.id } })
}
document.addEventListener(SyncEvent.LOBBY, lobbyListener)

const createLoading = ref(false)
const onCreate = async () => {
  createLoading.value = true
  startUser()
  startLobby()
}

const joinId = ref('')
const joinLoading = ref(false)
const onJoin = () => {
  joinLoading.value = true
  startUser()
  joinLobby(joinId.value)
}
document.addEventListener(JoinEvent.FAIL, () => {
  joinLoading.value = false
  message.error('Failed to join lobby')
})

const onSwitchTheme = (value: boolean) => {
  if (value) store.clientSettings.theme = 'dark'
  else store.clientSettings.theme = 'light'
  document.dispatchEvent(new Event(SyncEvent.SETTINGS))
}
</script>

<style scoped>
.home-page {
  box-sizing: border-box;
  height: 100%;
}
.center-wrapper {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.name {
  text-align: center;
}
</style>
