import { io } from '@/server'
import { lobbyMap, userMap } from '@/server/maps'
import { ClientGame, ClientLobby } from '@/interfaces/client-interfaces'
import {
  ServerLobby,
  ServerUser,
  serverUserToUser,
} from '@/interfaces/server-interfaces'
import { Game } from '@sqooid/big-two'

/**
 * Returns game info for specific player (no cheating!)
 * @param playerIndex
 * @param lobbyGame
 * @returns
 */
export function getClientSpecGame(
  lobbyGame: Game,
  playerIndex?: number,
): ClientGame {
  return {
    turn: lobbyGame.turn,
    playerIndex: playerIndex,
    currentPlayerIndex: lobbyGame.currentPlayer,
    board: lobbyGame.board,
    cards: playerIndex ? lobbyGame.players[playerIndex]?.cards ?? [] : [],
    remainingCardCount: lobbyGame.players.map((player) => {
      return player.cards.length
    }),
  }
}

export function getClientLobby(user: ServerUser): ClientLobby | undefined {
  const serverLobby = user.lobby
  if (!serverLobby) return undefined
  const playerIndex = serverLobby.players.indexOf(user)
  return {
    id: serverLobby.id,
    host: serverUserToUser(serverLobby.host),
    players: serverLobby.players.map((user) => serverUserToUser(user)),
    spectators: serverLobby.spectators.map((user) => serverUserToUser(user)),
    settings: serverLobby.settings,
    game: getClientSpecGame(serverLobby.game, playerIndex),
  }
}

export function sendLobby(user: ServerUser) {
  const clientLobby = getClientLobby(user)
  if (!clientLobby) return
  io.to(user.socketId).emit('syncLobby', clientLobby)
}

export function broadcastLobby(lobby: ServerLobby) {
  const players = lobby.players
  const spectators = lobby.spectators
  const watchers = players.concat(spectators)
  for (const watcher of watchers) {
    const specLobby = getClientLobby(watcher) as ClientLobby
    io.to(watcher.socketId).emit('syncLobby', specLobby)
  }
}
