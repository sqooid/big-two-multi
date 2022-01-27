<template>
  <div id="board-display">
    <div v-if="!gameHasStarted" class="centered">
      <div v-if="isHost" class="centered">
        <n-button
          type="primary"
          round
          @click="onStartGame"
          :disabled="store.lobby?.players.length === 1">
          Start game
        </n-button>
        <div class="invite-block">
          <n-text>
            Lonely? Invite your friends using this link:
            <br />
          </n-text>
          <n-tooltip trigger="click" placement="bottom">
            <template #trigger>
              <n-text code class="invite-link" @click="onCopyLink">
                {{ url }}
                <n-icon size="15" class="invite-copy-icon">
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
                      fill="currentColor"></path>
                  </svg>
                </n-icon>
              </n-text>
            </template>
            Link copied
          </n-tooltip>
        </div>
      </div>

      <n-button v-else type="primary" round disabled>
        Wait for host to start game
      </n-button>
    </div>
    <n-carousel
      v-else
      ref="carouselRef"
      draggable
      :loop="false"
      show-arrow
      class="carousel"
      :show-dots="false">
      <play-item
        v-for="play of previousPlays"
        :play="play"
        :player-name="store.lobby?.players[play.playerIndex].name ?? ''" />
      <template #arrow="{ total, currentIndex, prev, next }">
        <div class="carousel-arrow-position-wrapper">
          <div class="carousel-arrow-wrapper">
            <button
              :class="{ hidden: currentIndex === 0 }"
              type="button"
              class="carousel-arrow arrow-left"
              @click="prev">
              <n-icon :size="40" :color="useThemeVars().value.iconColor">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M16.88 2.88a1.25 1.25 0 0 0-1.77 0L6.7 11.29a.996.996 0 0 0 0 1.41l8.41 8.41c.49.49 1.28.49 1.77 0s.49-1.28 0-1.77L9.54 12l7.35-7.35c.48-.49.48-1.28-.01-1.77z"
                    fill="currentColor"></path>
                </svg>
              </n-icon>
            </button>
            <button
              :class="{ hidden: currentIndex === total - 1 }"
              type="button"
              class="carousel-arrow arrow-right"
              @click="next">
              <n-icon :size="40" :color="useThemeVars().value.iconColor">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M7.38 21.01c.49.49 1.28.49 1.77 0l8.31-8.31a.996.996 0 0 0 0-1.41L9.15 2.98c-.49-.49-1.28-.49-1.77 0s-.49 1.28 0 1.77L14.62 12l-7.25 7.25c-.48.48-.48 1.28.01 1.76z"
                    fill="currentColor"></path>
                </svg>
              </n-icon>
            </button>
          </div>
        </div>
      </template>
    </n-carousel>
  </div>
</template>

<script lang="ts" setup>
import { startGame } from '@/client/code/session'
import { globalRefs } from '@/client/code/global-refs'
import {
  NButton,
  NCarousel,
  NIcon,
  useThemeVars,
  NText,
  NTooltip,
} from 'naive-ui'
import { computed, ref, watch } from 'vue'
import PlayItem from '@/client/components/PlayItem.vue'
import PlayingCard from './PlayingCard.vue'
import { newCard } from '@sqooid/big-two'

const store = globalRefs.reactiveStore

const isHost = computed(() => {
  return store.lobby?.host.socketId === store.socket?.id
})
const gameHasStarted = computed(() => {
  return store.lobby?.game.turn ?? 0 > 0
})

const previousPlays = computed(() => {
  return store.lobby?.game.board || []
})

const url = computed(() => window.location.href)
const onCopyLink = () => {
  navigator.clipboard.writeText(window.location.href)
}

watch(previousPlays, (plays) => {
  if (plays.length > 0) {
    setTimeout(() => {
      carouselRef.value.to(plays.length - 1)
    }, 500)
  }
})

const onStartGame = () => {
  startGame()
}

const carouselRef = ref<any>(null)

const hoverColor = useThemeVars().value.hoverColor
</script>

<style scoped>
#board-display {
  height: 350px;
  max-height: calc((100vh - 40px) * 0.4);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.centered {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.invite-block {
  margin-top: 40px;
}
.invite-link {
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
}
.invite-copy-icon {
  margin-left: 10px;
}
.carousel {
  max-width: 1500px;
}
.carousel-arrow-position-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  pointer-events: none;
}
.carousel-arrow-wrapper {
  height: 100%;
  width: 100%;
  max-width: 1500px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  pointer-events: none;
}
.carousel-arrow {
  pointer-events: auto;
  background-color: #0000;
  border: none;
  border-radius: 10px;
  height: 100%;
  cursor: pointer;
  transition: all 0.1s ease-in-out;
}
.hidden {
  pointer-events: none;
  opacity: 0;
}
.carousel-arrow:hover {
  background-color: v-bind(hoverColor);
}
</style>
