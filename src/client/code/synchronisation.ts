import { store } from '@/client/code/store'
import { ClientLobby, ClientUser } from '@/interfaces/client-interfaces'
import { ClientSocket } from '@/interfaces/socket-events'

export const SyncEvent = {
  USER: 'userSync',
  LOBBY: 'lobbySync',
  lobby: {
    USERS: 'lobbyUsersSync',
    GAME: 'lobbyGameSync',
  },
  SETTINGS: 'settingsSync',
}

export enum JoinEvent {
  FAIL = 'joinError',
  SUCCESS = 'joinSuccess',
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
    dispatchSync(SyncEvent.LOBBY)
    return
  }
  if (lobby.id) store.lobby.id = lobby.id
  if (lobby.host) {
    console.log('asdf')
    store.lobby.host = lobby.host
    dispatchSync(SyncEvent.lobby.USERS)
  }
  if (lobby.players) {
    store.lobby.players = lobby.players
    dispatchSync(SyncEvent.lobby.USERS)
  }
  if (lobby.spectators) store.lobby.spectators = lobby.spectators
  if (lobby.settings) store.lobby.settings = lobby.settings
  if (lobby.game) store.lobby.game = lobby.game
}

export function listenUser(socket: ClientSocket) {
  socket.on('syncUser', (user) => {
    updateUser(user)
  })
}

export function updateUser(user: Partial<ClientUser>) {
  if (!store.user) {
    store.user = user as ClientUser
    dispatchSync(SyncEvent.USER)
    return
  }
  if (user.name) store.user.name = user.name
  dispatchSync(SyncEvent.USER)
}

function dispatchSync(type: string) {
  document.dispatchEvent(new Event(type))
}
