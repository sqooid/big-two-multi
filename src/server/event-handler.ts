import { Play } from '@sqooid/big-two'
import {
  handleChangeLobbySettings,
  handleChangeName,
  handleCreateLobby,
  handleCreateUser,
  handleJoinLobby,
  handleKickPlayer,
  handleMakePlay,
  handleMakePlayerHost,
  handleStartGame,
} from '@/server/handlers'
import { ServerSocket } from '@/interfaces/socket-events'

export function handleClientEmits(socket: ServerSocket) {
  // User creation
  socket.on('createUser', (name?: string) => {
    handleCreateUser(socket, name)
  })

  // Lobby creation
  socket.on('createLobby', (callback?) => {
    handleCreateLobby(socket, callback)
  })

  // Lobby join
  socket.on('joinLobby', (id, callback?) => {
    handleJoinLobby(socket, id, callback)
  })

  // Making plays
  socket.on('makePlay', (play?) => {
    handleMakePlay(socket, play)
  })

  // Starting games
  socket.on('startGame', () => {
    handleStartGame(socket)
  })

  // Changing IGN
  socket.on('changeName', (name) => {
    handleChangeName(socket, name)
  })

  // Changing lobby settings
  socket.on('changeLobbySettings', (settings) =>
    handleChangeLobbySettings(socket, settings),
  )

  // Kick player
  socket.on('kickPlayer', (socketId) => {
    handleKickPlayer(socket, socketId)
  })

  // Change host
  socket.on('makePlayerHost', (socketId) => {
    handleMakePlayerHost(socket, socketId)
  })
}
