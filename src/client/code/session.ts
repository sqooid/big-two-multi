import { socketConnect } from '@/client/code/socket-connect'
import { unreactiveStore } from '@/client/code/global-refs'
import {
  JoinEvent as JoinEvent,
  listenLobby,
  listenUser,
} from '@/client/code/synchronisation'
import { CallbackResults } from '@/interfaces/socket-events'
import { Play } from '@sqooid/big-two'
import { LobbySettings } from '@/interfaces/client-interfaces'

export function startUser() {
  if (unreactiveStore.socket) unreactiveStore.socket.disconnect()
  const socket = socketConnect()
  unreactiveStore.socket = socket
  socket.emit('createUser', unreactiveStore.clientSettings.name)
  listenUser(socket)
}

export function startLobby() {
  const socket = unreactiveStore.socket
  if (!socket) return
  socket.emit('createLobby')
  listenLobby(socket)
}

export function joinLobby(lobbyId: string) {
  const socket = unreactiveStore.socket
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
  const socket = unreactiveStore.socket
  if (!socket) return

  socket.emit('startGame')
}

export function sendPlay(play?: Play) {
  const socket = unreactiveStore.socket
  if (!socket) return

  socket.emit('makePlay', play)
}

export function changeName(name: string) {
  const socket = unreactiveStore.socket
  if (!socket) return

  socket.emit('changeName', name)
}

export function changeLobbySettings(settings: LobbySettings) {
  const socket = unreactiveStore.socket
  if (!socket) return

  socket.emit('changeLobbySettings', settings)
}
