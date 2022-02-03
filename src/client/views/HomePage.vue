<template>
  <div class="home-page center-wrapper">
    <n-space vertical>
      <h1 class="name">Big Two</h1>
      <n-space justify="center">
        <!-- Create -->
        <n-button :loading="createLoading" @click="onCreate">
          Create lobby
        </n-button>
      </n-space>
      <!-- <n-space justify="center">
        <n-input-group class="input-group">
          <n-input
            v-model:value="joinId"
            placeholder="Lobby code"
            @keydown.enter="onJoin" />
          <n-button :loading="joinLoading" @click="onJoin">Join</n-button>
        </n-input-group>
      </n-space> -->
    </n-space>
  </div>
</template>

<script lang="ts" setup>
import { joinLobby, startLobby, startUser } from '@/client/code/session'
import { globalRefs } from '@/client/code/global-refs'
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
import { computed, onUnmounted, reactive, ref, watch, watchEffect } from 'vue'

const message = useMessage()

watch(
  () => globalRefs.reactiveStore.lobby,
  (lobby) => {
    if (lobby !== undefined) {
      createLoading.value = false
      router.push({ name: 'lobby', params: { id: lobby.id } })
    }
  },
  { deep: true },
)

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
