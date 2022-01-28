import { LobbySettings, ClientUser } from '@/interfaces/client-interfaces'
import { Game } from '@sqooid/big-two'

export interface ServerUser extends ClientUser {
  lobby?: ServerLobby
}

export interface ServerLobby {
  /**
   * Lobby Id
   */
  id: string
  /**
   * User with control over lobby
   */
  host: ServerUser
  /**
   * List of players in turn order (players[0] starts)
   */
  players: ServerUser[]
  /**
   * List of spectators
   */
  spectators: ServerUser[]
  /**
   * Settings currently being used for this lobby
   */
  settings: LobbySettings
  /**
   * Game associated with this lobby
   */
  game: Game
  /**
   * Round number of the game currently being played
   */
  roundNumber: number
}

export function serverUserToUser(serverUser: ServerUser): ClientUser {
  return {
    socketId: serverUser.socketId,
    name: serverUser.name,
  }
}
