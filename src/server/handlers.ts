import { LobbySettings } from '@/interfaces/client-interfaces'
import { ServerSocket } from '@/interfaces/socket-events'
import { userMap } from '@/server/maps'
import { broadcastLobbySettings } from '@/server/send'

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
