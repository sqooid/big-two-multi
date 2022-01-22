import { socketConnect } from '@/client/code/socket-connect'
import { store } from '@/client/code/store'
import {
  FailEvent,
  listenLobby,
  listenUser,
} from '@/client/code/synchronisation'
import { CallbackResults } from '@/interfaces/socket-events'

export function startUser() {
  if (store.socket) store.socket.disconnect()
  const socket = socketConnect()
  store.socket = socket
  socket.emit('createUser')
  listenUser(socket)
}

export function startLobby() {
  const socket = store.socket
  if (!socket) return
  socket.emit('createLobby')
  listenLobby(socket)
}

export function joinLobby(lobbyId: string) {
  const socket = store.socket
  if (!socket) return false
  socket.emit('joinLobby', lobbyId, (response) => {
    if (response.result === CallbackResults.SUCCESS) {
      console.log('sucess')
      listenLobby(socket)
    } else {
      document.dispatchEvent(new Event(FailEvent.JOIN))
    }
  })
}
