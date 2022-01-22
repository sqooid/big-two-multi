<template>
  <div>
    <n-button @click="onTest">Connect</n-button>
  </div>
</template>

<script lang="ts" setup>
import { socketConnect } from '@/client/code/socket-connect'
import { NButton } from 'naive-ui'

let socket

const onTest = () => {
  socket = socketConnect()
}
</script>

<style scoped></style>
