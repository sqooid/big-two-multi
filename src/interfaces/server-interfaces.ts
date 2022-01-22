import { LobbySettings, ClientUser } from '@/interfaces/client-interfaces'
import { Game } from '@sqooid/big-two'

export interface ServerUser extends ClientUser {
  lobby?: ServerLobby
}

export interface ServerLobby {
  id: string
  host: ServerUser
  players: ServerUser[]
  spectators: ServerUser[]
  settings: LobbySettings
  game: Game
}

export function serverUserToUser(serverUser: ServerUser): ClientUser {
  return {
    socketId: serverUser.socketId,
    name: serverUser.name,
  }
}
