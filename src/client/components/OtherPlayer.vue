<template>
  <n-card
    class="other-player"
    hoverable
    :content-style="
      props.isTurn ? `background-color:${useThemeVars().value.infoColor}` : ''
    ">
    <n-h3 class="name">{{ props.player.name }}</n-h3>
    <template #action v-if="props.cards">
      <n-p>{{ cards }} cards left</n-p>
    </template>
  </n-card>
</template>

<script lang="ts" setup>
import { ClientUser } from '@/interfaces/client-interfaces'
import { NCard, NH3, NP, useThemeVars } from 'naive-ui'

interface Props {
  player: ClientUser
  cards?: number
  isTurn?: boolean
}

const props = defineProps<Props>()
</script>

<style scoped>
.name {
  margin-bottom: 0;
}
</style>
