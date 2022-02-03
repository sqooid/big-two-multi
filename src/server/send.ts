import { io } from '@/server'
import { lobbyMap, userMap } from '@/server/maps'
import { ClientGame, ClientLobby } from '@/interfaces/client-interfaces'
import {
  ServerLobby,
  ServerUser,
  serverUserToUser as toClientUser,
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
    host: toClientUser(serverLobby.host),
    players: serverLobby.players.map((user) => toClientUser(user)),
    spectators: serverLobby.spectators.map((user) => toClientUser(user)),
    settings: serverLobby.settings,
    game: getClientSpecGame(serverLobby.game, playerIndex),
    roundNumber: serverLobby.roundNumber,
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

export function broadcastGame(lobby: ServerLobby, newGame?: boolean) {
  const watchers = getLobbyWatchers(lobby)
  for (const watcher of watchers) {
    const playerIndex = lobby.players.indexOf(watcher)
    const specGame = getClientSpecGame(lobby.game, playerIndex)
    if (newGame) {
      io.to(watcher.socketId).emit('syncLobby', {
        players: lobby.players.map((user) => toClientUser(user)),
        roundNumber: lobby.roundNumber,
      })
    }
    io.to(watcher.socketId).emit('syncGame', specGame)
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
      host: toClientUser(lobby.host),
      players: lobby.players.map((user) => toClientUser(user)),
      spectators: lobby.spectators.map((user) => toClientUser(user)),
    }
    io.to(watcher.socketId).emit('syncLobby', lobbyUsersOnly)
  }
}

export function broadcastLobbySettings(lobby: ServerLobby) {
  const watchers = getLobbyWatchers(lobby)
  for (const watcher of watchers) {
    io.to(watcher.socketId).emit('syncLobby', {
      settings: lobby.settings,
    })
  }
}

export function broadcastHostChange(lobby: ServerLobby) {
  const watchers = getLobbyWatchers(lobby)
  for (const watcher of watchers) {
    io.to(watcher.socketId).emit('syncLobby', {
      host: toClientUser(lobby.host),
    })
  }
}
