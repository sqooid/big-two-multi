import { ClientLobby, ClientUser } from '@/interfaces/client-interfaces'
import { ClientSocket } from '@/interfaces/socket-events'

export interface State {
  socket?: ClientSocket
  user: Partial<ClientUser>
  lobby: Partial<ClientLobby>
  clientSettings: {
    theme: 'light' | 'dark'
  }
}

export const store: State = {
  user: {},
  lobby: {},
  clientSettings: {
    theme: 'light',
  },
}
