import { ClientSocket } from '@/interfaces/socket-events'
import { io } from 'socket.io-client'

export function socketConnect(): ClientSocket {
  const host = window.location.hostname
  if (import.meta.env.DEV)
    return io(
      window.location.protocol +
        '//' +
        window.location.hostname +
        ':' +
        import.meta.env.VITE_SERVER_PORT,
    ) // For development
  return io()
}
