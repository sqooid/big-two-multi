import { io } from '@/server'
import { lobbyMap, userMap } from '@/server/maps'
import { ClientGame, ClientLobby } from '@/interfaces/client-interfaces'
import {
  ServerLobby,
  ServerUser,
  serverUserToUser,
} from '@/interfaces/server-interfaces'
import { Game } from '@sqooid/big-two'
import { logGamePlays } from '@/server/debug'

/**
 * Returns game info for specific player (no cheating!)
 * @param playerIndex
 * @param lobbyGame
 * @returns
 */
export function getClientSpecGame(
  lobbyGame: Game,
  playerIndex: number,
): ClientGame {
  const isPlayer = playerIndex !== -1 && playerIndex >= 0 && playerIndex <= 3
  const hasStarted = lobbyGame.players.length !== 0
  const cards =
    isPlayer && hasStarted ? lobbyGame.players[playerIndex].cards : []
  return {
    turn: hasStarted ? lobbyGame.turn + 1 : 0,
    playerIndex: playerIndex,
    currentPlayerIndex: lobbyGame.currentPlayer,
    board: lobbyGame.board,
    cards: cards,
    remainingCardCount: lobbyGame.players.map((player) => {
      return player.cards.length
    }),
    winnerIndex: lobbyGame.winner ?? -1,
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
  const watchers = getLobbyWatchers(lobby)
  for (const watcher of watchers) {
    const specLobby = getClientLobby(watcher) as ClientLobby
    io.to(watcher.socketId).emit('syncLobby', specLobby)
  }
}

export function broadCastGame(lobby: ServerLobby) {
  const watchers = getLobbyWatchers(lobby)
  for (const watcher of watchers) {
    const playerIndex = lobby.players.indexOf(watcher)
    const specGame = getClientSpecGame(lobby.game, playerIndex)
    io.to(watcher.socketId).emit('syncGame', specGame)
    io.to(watcher.socketId).emit('syncLobby', {
      players: lobby.players.map((user) => serverUserToUser(user)),
    })
  }
}

function getLobbyWatchers(lobby: ServerLobby) {
  const players = lobby.players
  const spectators = lobby.spectators
  return players.concat(spectators)
}

export function broadcastUsersInLobby(lobby: ServerLobby) {
  const watchers = getLobbyWatchers(lobby)
  for (const watcher of watchers) {
    const lobbyUsersOnly: Partial<ClientLobby> = {
      host: serverUserToUser(lobby.host),
      players: lobby.players.map((user) => serverUserToUser(user)),
      spectators: lobby.spectators.map((user) => serverUserToUser(user)),
    }
    io.to(watcher.socketId).emit('syncLobby', lobbyUsersOnly)
  }
}
