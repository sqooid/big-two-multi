import { Play } from '@sqooid/big-two'
import {
  handleChangeLobbySettings,
  handleChangeName,
  handleCreateLobby,
  handleCreateUser,
  handleJoinLobby,
  handleMakePlay,
  handleStartGame,
} from '@/server/handlers'
import { ServerSocket } from '@/interfaces/socket-events'

export function handleClientEmits(socket: ServerSocket) {
  // User creation
  socket.on('createUser', (name?: string) => {
    handleCreateUser(socket, name)
  })

  // Lobby creation
  socket.on('createLobby', () => {
    handleCreateLobby(socket)
  })

  // Lobby join
  socket.on('joinLobby', (id: string, callback: (response: any) => void) => {
    handleJoinLobby(socket, id, callback)
  })

  // Making plays
  socket.on('makePlay', (play?: Play) => {
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
}
