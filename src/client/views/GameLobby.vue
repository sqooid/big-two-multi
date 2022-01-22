<template>
  <div>Hello</div>
</template>

<script lang="ts" setup>
import router from '@/client/router'

// Lobby ID
const id = router.currentRoute.value.params.id
</script>

<style scoped></style>
