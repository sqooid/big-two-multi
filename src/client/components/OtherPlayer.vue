<template>
  <n-card class="other-player">
    <h2>{{ props.player.name }}</h2>
    <p v-if="props.cards">{{ cards }} cards left</p>
  </n-card>
</template>

<script lang="ts" setup>
import { ClientUser } from '@/interfaces/client-interfaces'
import { NCard } from 'naive-ui'

interface Props {
  player: ClientUser
  cards?: number
}

const props = defineProps<Props>()
</script>

<style scoped></style>
