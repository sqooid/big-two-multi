import { ServerLobby, ServerUser } from '@/interfaces/server-interfaces'
import { randomString } from '@/server/utils'
import { createGame } from '@sqooid/big-two'

export const lobbyMap = new Map<string, ServerLobby>()

export const userMap = new Map<string, ServerUser>()

/**
 * Creates a new user in the user map
 * @param socketId
 * @param name
 * @returns the newly created user
 */
export function createUser(socketId: string, name: string): ServerUser {
  const newUser: ServerUser = {
    socketId: socketId,
    name: name,
  }
  userMap.set(socketId, newUser)
  return newUser
}

/**
 * Creates a new lobby in the lobby map
 * @param host
 * @returns the newly created lobby
 */
export function createLobby(host: ServerUser): ServerLobby {
  const lobbyId = randomString(16)
  const newGame = createGame()
  const newLobby: ServerLobby = {
    id: lobbyId,
    host: host,
    players: [host],
    spectators: [],
    settings: {
      deal: {
        playerCount: 4,
      },
    },
    game: newGame,
  }
  lobbyMap.set(lobbyId, newLobby)
  return newLobby
}
