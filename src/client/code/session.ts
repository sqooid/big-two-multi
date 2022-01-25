import { socketConnect } from '@/client/code/socket-connect'
import { store } from '@/client/code/store'
import {
  JoinEvent as JoinEvent,
  listenLobby,
  listenUser,
} from '@/client/code/synchronisation'
import { CallbackResults } from '@/interfaces/socket-events'
import { Play } from '@sqooid/big-two'

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
  if (!socket) return
  socket.emit('joinLobby', lobbyId, (response) => {
    if (response.result === CallbackResults.SUCCESS) {
      listenLobby(socket)
    } else {
      document.dispatchEvent(new Event(JoinEvent.FAIL))
    }
  })
}

export function startGame() {
  const socket = store.socket
  if (!socket) return

  socket.emit('startGame')
}

export function sendPlay(play?: Play) {
  const socket = store.socket
  if (!socket) return

  socket.emit('makePlay', play)
}
