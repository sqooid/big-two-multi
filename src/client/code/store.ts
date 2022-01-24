import { ClientLobby, ClientUser } from '@/interfaces/client-interfaces'
import { ClientSocket } from '@/interfaces/socket-events'

export interface State {
  socket?: ClientSocket
  user?: ClientUser
  lobby?: ClientLobby
  clientSettings: {
    theme: 'light' | 'dark'
  }
}

export const store: State = {
  clientSettings: {
    theme: 'light',
  },
}

export const rstore = {
  store: {} as State,
}
