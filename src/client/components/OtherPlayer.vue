<template>
  <n-card class="other-player" hoverable>
    <n-h2>{{ props.player.name }}</n-h2>
    <template #footer v-if="props.cards">
      <n-p>{{ cards }} cards left</n-p>
    </template>
  </n-card>
</template>

<script lang="ts" setup>
import { ClientUser } from '@/interfaces/client-interfaces'
import { NCard, NH2, NP } from 'naive-ui'

interface Props {
  player: ClientUser
  cards?: number
}

const props = defineProps<Props>()
</script>

<style scoped></style>
