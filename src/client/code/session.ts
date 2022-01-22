import { socketConnect } from '@/client/code/socket-connect'
import { store } from '@/client/code/store'
import { listenLobby, listenUser } from '@/client/code/synchronisation'
import { ClientEmits, ServerEmits } from '@/interfaces/socket-events'

export async function startUser() {
  if (store.socket) store.socket.disconnect()
  const socket = socketConnect()
  store.socket = socket
  socket.emit('createUser')
  listenUser(socket)
}

export async function startLobby() {
  const socket = store.socket
  if (!socket) return
  socket.emit('createLobby')
  listenLobby(socket)
}

export async function joinLobby(lobbyId: string) {
  const socket = store.socket
  if (!socket) return
  socket.emit('joinLobby', lobbyId, (response) => {
    console.log(response)
  })
}
