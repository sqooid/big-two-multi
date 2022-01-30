import { LobbySettings } from '@/interfaces/client-interfaces'
import { shuffleArray } from '@/interfaces/general-functions'
import { ServerLobby } from '@/interfaces/server-interfaces'
import { CallbackResults, ServerSocket } from '@/interfaces/socket-events'
import { logGamePlays, logGameStartingHands } from '@/server/debug'
import { extractPlay } from '@/server/game-event-handlers'
import { createLobby, createUser, lobbyMap, userMap } from '@/server/maps'
import {
  broadcastGame,
  broadcastLobby,
  broadcastLobbySettings,
  broadcastUsersInLobby,
  sendLobby,
} from '@/server/send'
import { generateName } from '@/server/utils'
import { findPlay, Play } from '@sqooid/big-two'

export function handleCreateUser(socket: ServerSocket, name?: string) {
  name = name || generateName()
  const newUser = createUser(socket.id, name)
  console.log('Created user:', newUser.name)
  socket.emit('syncUser', newUser)
}

export function handleCreateLobby(
  socket: ServerSocket,
  callback?: (response: any) => void,
) {
  try {
    const host = userMap.get(socket.id)
    if (!host) return
    const newLobby = createLobby(host)
    console.log('Created lobby:', newLobby.id)
    host.lobby = newLobby
    sendLobby(host)
    if (callback) {
      callback({ result: CallbackResults.SUCCESS })
    }
  } catch {
    if (callback) {
      callback({ result: CallbackResults.FAILED })
    }
  }
}

export function handleJoinLobby(
  socket: ServerSocket,
  id: string,
  callback?: (response: any) => void,
) {
  try {
    const user = userMap.get(socket.id)
    const lobby = lobbyMap.get(id)
    if (!user || !lobby) {
      if (callback) callback({ result: CallbackResults.FAILED })
      return
    }

    const gameHasStarted = lobby.game.players.length > 0
    const gameCanFitMorePlayers =
      (!gameHasStarted && lobby.players.length >= 4) ||
      (gameHasStarted && lobby.players.length >= lobby.game.players.length)
    if (!gameCanFitMorePlayers) {
      lobby.players.push(user)
      lobby.settings.deal.playerCount = lobby.players.length
    } else lobby.spectators.push(user)
    user.lobby = lobby

    console.log('Joined lobby:', lobby.id)
    if (callback) callback({ result: CallbackResults.SUCCESS })
    broadcastLobby(lobby)
  } catch {
    if (callback) callback({ result: CallbackResults.FAILED })
  }
}

export function handleMakePlay(socket: ServerSocket, play?: number[] | Play) {
  const user = userMap.get(socket.id)
  const lobby = user?.lobby
  const game = user?.lobby?.game
  if (!game || !lobby) return

  const playerIndex = lobby.players.indexOf(user)
  const isPlayer = playerIndex !== -1
  if (!isPlayer) return
  const isTurn = lobby.game.currentPlayer === playerIndex
  if (!isTurn) return

  // Determine the type of play
  const finalPlay = extractPlay(user, lobby, play)

  const validPlay = game.makePlay(finalPlay)
  if (validPlay && user.lobby) {
    broadcastGame(user.lobby)
  }

  // Logging
  if (game.isFinished) {
    logGamePlays(user.lobby as ServerLobby)
  }
}

export function handleStartGame(socket: ServerSocket) {
  const user = userMap.get(socket.id)
  const lobby = user?.lobby
  if (!user || !lobby) return

  const isHost = socket.id === lobby.host.socketId
  if (!isHost) return

  const validPlayerCount =
    lobby.settings.deal.playerCount > 1 && lobby.settings.deal.playerCount < 5
  if (!validPlayerCount) return

  console.log('Started game: ', lobby.id)
  const winnerIndex = lobby.game.winner
  const isFirstGame = winnerIndex === undefined

  lobby.game.dealCards(lobby.settings.deal)
  lobby.roundNumber++
  const winner = lobby.players[winnerIndex ?? 0]
  lobby.players = shuffleArray(lobby.players)
  if (!isFirstGame && !lobby.settings.deal.randomHands) {
    const winnerIndexInLobby = lobby.players.indexOf(winner)
    if (winnerIndexInLobby !== -1) {
      const tempPlayer = lobby.players[0]
      lobby.players[0] = lobby.players[winnerIndexInLobby]
      lobby.players[winnerIndexInLobby] = tempPlayer
    }
  }

  broadcastGame(lobby, true)

  // Logging
  logGameStartingHands(lobby)
}

export function handleChangeName(socket: ServerSocket, name: string) {
  const user = userMap.get(socket.id)
  const lobby = user?.lobby
  if (!user) return

  let newName
  if (!name) {
    newName = generateName()
  } else {
    newName = name
  }
  user.name = newName
  if (lobby) {
    broadcastUsersInLobby(lobby)
  }
  socket.emit('syncUser', { name: newName })
}

export function handleChangeLobbySettings(
  socket: ServerSocket,
  settings: LobbySettings,
) {
  const user = userMap.get(socket.id)
  const lobby = user?.lobby
  if (!user || !lobby) return

  const isHost = lobby.host.socketId === socket.id
  if (!isHost) return

  lobby.settings = settings

  broadcastLobbySettings(lobby)
}
