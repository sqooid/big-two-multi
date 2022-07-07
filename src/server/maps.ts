import { ServerLobby, ServerUser } from '@/interfaces/server-interfaces'
import { broadcastLobby } from '@/server/send'
import { randomString } from '@/server/utils'
import { createGame } from '@sqooid/big-two'
import { log } from './log'

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
    roundNumber: 0,
    id: lobbyId,
    host: host,
    players: [host],
    spectators: [],
    settings: {
      deal: {
        playerCount: 1,
      },
    },
    game: newGame,
  }
  lobbyMap.set(lobbyId, newLobby)
  return newLobby
}

export function removeUser(socketId: string) {
  const user = userMap.get(socketId)
  if (user === undefined) return
  userMap.delete(socketId)
  const lobby = user.lobby
  if (lobby === undefined) return
  let indexInLobby = lobby.players.indexOf(user)
  if (indexInLobby !== -1) {
    lobby.players.splice(indexInLobby, 1)
    lobby.settings.deal.playerCount = lobby.players.length
  } else {
    indexInLobby = lobby.spectators.indexOf(user)
    lobby.spectators.splice(indexInLobby, 1)
  }
  if (lobby.host === user) {
    lobby.host = lobby.players[0]
    if (!lobby.host) {
      lobbyMap.delete(lobby.id)
      log(`Destroyed lobby: ${lobby.id}`)
      return
    }
  }
  broadcastLobby(lobby)
}
