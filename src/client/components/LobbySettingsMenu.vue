<template>
  <n-h4>Lobby</n-h4>
  <div class="checkbox-group">
    <n-checkbox
      v-model:checked="settings.deal.fourTwos"
      :disabled="!isHost"
      @change="onChange">
      <n-tooltip trigger="hover" placement="right">
        <template #trigger>Reshuffle if four two's</template>
        Reshuffle the deck if any player receives 4 two's in their hand
      </n-tooltip>
    </n-checkbox>
    <n-checkbox
      v-model:checked="settings.deal.noFaces"
      :disabled="!isHost"
      @change="onChange">
      <n-tooltip trigger="hover" placement="right">
        <template #trigger>Reshuffle if no faces</template>
        Reshuffle the deck if any player receives no face cards (Jack, Queen,
        King) in their hand
      </n-tooltip>
    </n-checkbox>
    <n-checkbox
      v-model:checked="settings.deal.distributeAll"
      :disabled="!isHost"
      @change="onChange">
      <n-tooltip trigger="hover" placement="right">
        <template #trigger>Distribute all</template>
        Distribute all cards (>13 cards each) if there are less than 4 players
      </n-tooltip>
    </n-checkbox>
    <n-checkbox
      v-model:checked="settings.deal.randomHands"
      :checked-value="false"
      :unchecked-value="true"
      :disabled="!isHost"
      @change="onChange">
      <n-tooltip trigger="hover" placement="right">
        <template #trigger>Winner starts</template>
        Winner of the previous game starts the next game
      </n-tooltip>
    </n-checkbox>
  </div>
</template>

<script lang="ts" setup>
import { globalRefs } from '@/client/code/global-refs'
import { changeLobbySettings } from '@/client/code/session'
import { LobbySettings } from '@/interfaces/client-interfaces'
import { NForm, NH4, NCheckbox, NTooltip } from 'naive-ui'
import { computed, reactive, watch } from 'vue'

const store = globalRefs.reactiveStore

const isHost = computed(() => {
  return store.lobby?.host.socketId === store.socket?.id
})

const settings = computed(() => {
  return (
    store.lobby?.settings ??
    ({
      deal: {
        randomHands: false,
        fourTwos: false,
        noFaces: false,
        distributeAll: false,
      },
    } as LobbySettings)
  )
})

const onChange = () => {
  changeLobbySettings(settings.value)
}
</script>

<style scoped>
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
