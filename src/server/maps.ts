import { ServerLobby, ServerUser } from '@/interfaces/server-interfaces'
import { broadcastLobby } from '@/server/send'
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

export function removeUser(socketId: string) {
  const user = userMap.get(socketId)
  if (!user) return
  userMap.delete(socketId)
  const lobby = user.lobby
  if (!lobby) return
  let index = lobby.players.indexOf(user)
  if (index !== undefined) {
    lobby.players.splice(index, 1)
  } else {
    index = lobby.spectators.indexOf(user)
    lobby.spectators.splice(index, 1)
  }
  if (lobby.host === user) {
    lobby.host = lobby.players[0]
    if (!lobby.host) {
      lobbyMap.delete(lobby.id)
      return
    }
  }
  broadcastLobby(lobby)
}
