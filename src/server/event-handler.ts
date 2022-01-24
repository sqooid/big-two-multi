import { broadCastGame, broadcastLobby, sendLobby } from '@/server/send'
import { createLobby, createUser, lobbyMap, userMap } from '@/server/maps'
import { CallbackResults, ServerSocket } from '@/interfaces/socket-events'
import { generateName } from '@/server/utils'
import { Play } from '@sqooid/big-two'

export function handleClientEmits(socket: ServerSocket) {
  // User creation
  socket.on('createUser', (name?: string) => {
    name = name ?? generateName()
    createUser(socket.id, name)
  })

  // Lobby creation
  socket.on('createLobby', () => {
    const host = userMap.get(socket.id)
    if (!host) return
    const newLobby = createLobby(host)
    console.log('Created lobby:', newLobby.id)
    host.lobby = newLobby
    sendLobby(host)
  })

  // Lobby join
  socket.on('joinLobby', (id: string, callback: (response: any) => void) => {
    const user = userMap.get(socket.id)
    const lobby = lobbyMap.get(id)
    if (!user || !lobby) {
      callback({ result: CallbackResults.FAILED })
      return
    }

    if (lobby.players.length < 4) {
      lobby.players.push(user)
      lobby.settings.deal.playerCount = lobby.players.length
    } else lobby.spectators.push(user)
    user.lobby = lobby

    console.log('Joined lobby:', lobby.id)

    callback({ result: CallbackResults.SUCCESS })
    broadcastLobby(lobby)
  })

  // Making plays
  socket.on('makePlay', (play?: Play) => {
    const user = userMap.get(socket.id)
    const game = user?.lobby?.game
    if (!game) return

    const validPlay = game.makePlay(play)
    if (validPlay && user.lobby) {
      broadCastGame(user.lobby)
    }
  })

  // Starting games
  socket.on('startGame', () => {
    const user = userMap.get(socket.id)
    const lobby = user?.lobby
    if (!user || !lobby) return

    const isHost = socket.id === lobby.host.socketId
    if (!isHost) return

    const isFirstGame = lobby.game.turn === 0
    console.log('Started game: ', lobby.id)
    if (isFirstGame) {
      lobby.game.dealCards(lobby.settings.deal)
    }

    broadCastGame(lobby)
  })
}
