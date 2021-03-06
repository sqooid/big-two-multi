import { Socket } from 'socket.io-client'
import { Socket as SSocket } from 'socket.io'
import {
  ClientGame,
  ClientLobby,
  ClientUser,
  LobbySettings,
} from '@/interfaces/client-interfaces'
import { Play } from '@sqooid/big-two'

export enum CallbackResults {
  FAILED,
  SUCCESS,
}

export interface ServerToClientEvents {
  syncLobby: (lobby: Partial<ClientLobby>) => void
  syncUser: (user: Partial<ClientUser>) => void
  syncGame: (game: Partial<ClientGame>) => void
  kicked: () => void
}

export interface ClientToServerEvents {
  createUser: (name?: string) => void
  createLobby: (callback?: (response: any) => void) => void
  joinLobby: (id: string, callback?: (response: any) => void) => void
  makePlay: (play?: number[] | Play) => void
  startGame: () => void
  changeName: (name: string) => void
  changeLobbySettings: (settings: LobbySettings) => void
  kickPlayer: (socketId: string) => void
  makePlayerHost: (socketId: string) => void
}

export type ClientSocket = Socket<ServerToClientEvents, ClientToServerEvents>
export type ServerSocket = SSocket<ClientToServerEvents, ServerToClientEvents>
