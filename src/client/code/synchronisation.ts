import { store } from '@/client/code/store'
import { ClientLobby, ClientUser } from '@/interfaces/client-interfaces'
import { ClientSocket } from '@/interfaces/socket-events'

export enum SyncEvent {
  USER = 'userSync',
  LOBBY = 'lobbySync',
  SETTINGS = 'settingsSync',
}

export enum FailEvent {
  JOIN = 'joinError',
}

export function listenLobby(socket: ClientSocket) {
  socket.on('syncLobby', (lobby) => {
    console.log(lobby)
    updateLobby(lobby)
  })
}

export function updateLobby(lobby: Partial<ClientLobby>) {
  if (!store.lobby) {
    store.lobby = lobby as ClientLobby
    document.dispatchEvent(new Event(SyncEvent.LOBBY))
    return
  }
  if (lobby.id) store.lobby.id = lobby.id
  if (lobby.host) store.lobby.host = lobby.host
  if (lobby.players) store.lobby.players = lobby.players
  if (lobby.spectators) store.lobby.spectators = lobby.spectators
  if (lobby.settings) store.lobby.settings = lobby.settings
  if (lobby.game) store.lobby.game = lobby.game
  document.dispatchEvent(new Event(SyncEvent.LOBBY))
}

export function listenUser(socket: ClientSocket) {
  socket.on('syncUser', (user) => {
    updateUser(user)
  })
}

export function updateUser(user: Partial<ClientUser>) {
  if (!store.user) {
    store.user = user as ClientUser
    document.dispatchEvent(new Event(SyncEvent.USER))
    return
  }
  if (user.name) store.user.name = user.name
  document.dispatchEvent(new Event(SyncEvent.USER))
}
