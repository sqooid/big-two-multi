export const StorageKeys = {
  DEFAULT_THEME: 'defaultTheme',
  DEFAULT_NAME: 'defaultName',
}

export function setKey(key: string, value: string) {
  if (window.localStorage) {
    window.localStorage.setItem(key, value)
  }
}

export function getKey(key: string): string {
  if (window.localStorage) {
    return window.localStorage.getItem(key) ?? ''
  }
  return ''
}
