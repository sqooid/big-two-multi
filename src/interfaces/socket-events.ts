import { Socket } from 'socket.io-client'
import { Socket as SSocket } from 'socket.io'
import {
  ClientGame,
  ClientLobby,
  ClientUser,
} from '@/interfaces/client-interfaces'
import { Play } from '@sqooid/big-two'

export enum CallbackResults {
  SUCCESS,
  FAILED,
}

export interface ServerToClientEvents {
  syncLobby: (lobby: Partial<ClientLobby>) => void
  syncUser: (user: Partial<ClientUser>) => void
  syncGame: (game: Partial<ClientGame>) => void
}

export interface ClientToServerEvents {
  createUser: (name?: string) => void
  createLobby: (callback?: (response: any) => void) => void
  joinLobby: (id: string, callback: (response: any) => void) => void
  makePlay: (play?: Play) => void
  startGame: () => void
}

export type ClientSocket = Socket<ServerToClientEvents, ClientToServerEvents>
export type ServerSocket = SSocket<ClientToServerEvents, ServerToClientEvents>
