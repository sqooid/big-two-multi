<template>
  <div>
    <n-h4>Client</n-h4>
    <n-form>
      <n-form-item label="Dark mode">
        <n-switch
          v-model:value="store.clientSettings.theme"
          checked-value="dark"
          unchecked-value="light"></n-switch>
      </n-form-item>
      <n-form-item label="Name">
        <n-input
          v-model:value="store.clientSettings.name"
          @change="onChangeName"
          :placeholder="store.user?.name ?? ''"></n-input>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
import { globalRefs } from '@/client/code/global-refs'
import { NForm, NFormItem, NSwitch, NH4, NInput } from 'naive-ui'
import { setKey, StorageKeys } from '@/client/code/storage'
import { watch } from 'vue'
import { changeName } from '@/client/code/session'

const store = globalRefs.reactiveStore

// Settings defaults in storage
// Theme
watch(
  () => store.clientSettings.theme,
  (theme) => {
    setKey(StorageKeys.DEFAULT_THEME, theme)
  },
)
// Name
const onChangeName = (value: string) => {
  setKey(StorageKeys.DEFAULT_NAME, value)
  changeName(value)
}
</script>

<style scoped></style>
