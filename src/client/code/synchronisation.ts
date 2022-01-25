import { rstore, store } from '@/client/code/global-refsl-refs'
import {
  ClientGame,
  ClientLobby,
  ClientUser,
} from '@/interfaces/client-interfaces'
import { ClientSocket } from '@/interfaces/socket-events'

export const SyncEvent = {
  /**
   * Entire user has been modified / created
   */
  USER: 'userSync',
  /**
   * Entire lobby has been created
   */
  LOBBY: 'lobbySync',
  lobby: {
    /**
     * State of users in lobby has changed
     */
    USERS: 'lobbyUsersSync',
    /**
     * State of game in lobby has changed
     */
    GAME: 'lobbyGameSync',
    /**
     * State of lobby settings has changed
     */
    SETTINGS: 'lobbySettingsSync',
  },
  /**
   * Client settings have been changed
   */
  CLIENT_SETTINGS: 'clientSettingsSync',
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
  socket.on('syncGame', (game) => {
    console.log(game)
    updateGame(game)
  })
}

export function listenUser(socket: ClientSocket) {
  socket.on('syncUser', (user) => {
    updateUser(user)
  })
}

export function updateLobby(lobby: Partial<ClientLobby>) {
  if (!rstore.store.lobby) {
    rstore.store.lobby = lobby as ClientLobby
    return
  }
  Object.assign(rstore.store.lobby, lobby)
}

export function updateGame(game: Partial<ClientGame>) {
  if (rstore.store.lobby?.game) {
    Object.assign(rstore.store.lobby?.game, game)
  }
}

export function updateUser(user: Partial<ClientUser>) {
  if (!rstore.store.user) {
    rstore.store.user = user as ClientUser
    return
  }
  Object.assign(rstore.store.user, user)
}
