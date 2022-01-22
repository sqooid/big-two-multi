import { store } from '@/client/code/store'
import { ClientLobby, ClientUser } from '@/interfaces/client-interfaces'
import {
  ClientSocket,
  ServerEmits,
  ServerSyncLobby,
  ServerSyncUser,
} from '@/interfaces/socket-events'

export enum SyncEvent {
  USER = 'user',
  LOBBY = 'lobby',
  SETTINGS = 'settings',
}

export function listenLobby(socket: ClientSocket) {
  socket.on('server', (type, payload: ServerSyncLobby) => {
    if (type === ServerEmits.SYNC_LOBBY) {
      updateLobby(payload.lobby)
      console.log(payload.lobby)
    }
  })
}

export function updateLobby(lobby: Partial<ClientLobby>) {
  if (lobby.id) store.lobby.id = lobby.id
  if (lobby.host) store.lobby.host = lobby.host
  if (lobby.players) store.lobby.players = lobby.players
  if (lobby.spectators) store.lobby.spectators = lobby.spectators
  if (lobby.settings) store.lobby.settings = lobby.settings
  if (lobby.game) store.lobby.game = lobby.game
  document.dispatchEvent(new Event(SyncEvent.LOBBY))
}

export function listenUser(socket: ClientSocket) {
  socket.on('server', (type, payload: ServerSyncUser) => {
    if (type === ServerEmits.SYNC_USER) {
      updateUser(payload.user)
    }
  })
}

export function updateUser(user: Partial<ClientUser>) {
  document.dispatchEvent(new Event(SyncEvent.USER))
  if (user.name) store.user.name = user.name
}
