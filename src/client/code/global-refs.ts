import { ClientLobby, ClientUser } from '@/interfaces/client-interfaces'
import { ClientSocket } from '@/interfaces/socket-events'

export interface State {
  socket?: ClientSocket
  user?: ClientUser
  lobby?: ClientLobby
  clientSettings: {
    theme: 'light' | 'dark'
    sortBySuits: boolean
  }
}

const emptyUser = { name: '', socketId: '' }

export const unreactiveStore: State = {
  clientSettings: {
    theme: 'light',
    sortBySuits: false,
  },
}

export const globalRefs = {
  reactiveStore: {} as State,
}
