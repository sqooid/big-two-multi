<template>
  <div class="player-popover">
    <n-h5 class="name">{{ props.info.user.name }}</n-h5>
    <div v-if="isHost && !props.info.isHost" class="host-controls">
      <n-button-group vertical>
        <n-button>Make host</n-button>
        <n-button>Kick</n-button>
      </n-button-group>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { globalRefs } from '@/client/code/global-refs'
import { PlayerCardInfo } from '@/interfaces/client-interfaces'
import { NText, NButton, NDivider, NButtonGroup, NH5 } from 'naive-ui'
import { computed } from 'vue'

const store = globalRefs.reactiveStore

interface Props {
  info: PlayerCardInfo
}

const props = defineProps<Props>()

const isHost = computed(() => store.lobby?.host.socketId === store.socket?.id)
</script>

<style scoped>
.player-popover {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.name {
  inline-size: 100%;
  overflow-wrap: break-word;
  text-align: center;
  margin: 0;
}
.host-controls {
  margin-top: 10px;
}
</style>
