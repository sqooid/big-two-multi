<template>
  <img :src="`/assets/cards/${suit}-${props.card.value}.svg`" />
</template>

<script lang="ts" setup>
import { onUpdated, ref } from 'vue'
import CardSuit from '@/client/components/CardSuit.vue'
import { Card, Suit } from '@sqooid/big-two'

interface Props {
  card: Card
}
const props = defineProps<Props>()

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

<style></style>
