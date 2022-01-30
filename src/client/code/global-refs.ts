import { ClientLobby, ClientUser } from '@/interfaces/client-interfaces'
import { ClientSocket } from '@/interfaces/socket-events'
import Flipping from 'flipping'

export type ThemeSetting = 'light' | 'dark'

export interface State {
  socket?: ClientSocket
  user?: ClientUser
  lobby?: ClientLobby
  clientSettings: {
    theme: ThemeSetting
    name: string
  }
}

const emptyUser = { name: '', socketId: '' }

export const unreactiveStore: State = {
  clientSettings: {
    theme: 'dark',
    name: '',
  },
}

export const globalRefs = {
  reactiveStore: {} as State,
  flipping: new Flipping(),
}
