<template>
  <img
    ref="rootNode"
    draggable="false"
    class="card"
    :src="`/assets/cards/${suit}-${props.card.value}.svg`" />
</template>

<script lang="ts" setup>
import { Card, Suit } from '@sqooid/big-two'
import { ref } from 'vue'

interface Props {
  card: Card
}
const props = defineProps<Props>()
const rootNode = ref<any>(null)

defineExpose({ rootNode })

let suit: string
switch (props.card.suit) {
  case Suit.DIAMOND:
    suit = 'diamond'
    break
  case Suit.CLUB:
    suit = 'club'
    break
  case Suit.HEART:
    suit = 'heart'
    break
  default:
    suit = 'spade'
}
</script>

<style scoped>
.card {
  max-height: 100%;
  max-width: 100%;
  background-color: white;
}
</style>
