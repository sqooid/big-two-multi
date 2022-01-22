import { sendLobby } from '@/server/send'
import { createLobby, createUser, lobbyMap, userMap } from '@/server/maps'
import {
  ClientEmits,
  ClientSocket,
  ServerSocket,
} from '@/interfaces/socket-events'
import { generateName } from '@/server/utils'

export function handleClientEmits(socket: ServerSocket) {
  socket.on('createUser', (name?: string) => {
    name = name ?? generateName()
    createUser(socket.id, name)
  })
  socket.on('createUser', () => {
    const host = userMap.get(socket.id)
    if (!host) return
    const newLobby = createLobby(host)
    console.log('New lobby created')
    host.lobby = newLobby
    sendLobby(host)
  })
  socket.on('joinLobby', (id: string, callback: (response: any) => void) => {
    const user = userMap.get(socket.id)
    if (!user) return 'error'
    if (!lobbyMap.get(id)) return 'error'
  })
}
