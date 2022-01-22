import { Socket } from 'socket.io-client'
import { Socket as SSocket } from 'socket.io'
import { ClientLobby, ClientUser } from '@/interfaces/client-interfaces'

export enum ClientEmits {
  CREATE_USER,
  CREATE_LOBBY,
  JOIN_LOBBY, // string ID of lobby
}

export enum ServerEmits {
  SYNC_LOBBY,
  SYNC_USER,
}

export interface ServerSyncLobby {
  lobby: Partial<ClientLobby>
}

export interface ServerSyncUser {
  user: ClientUser
}

export interface ServerToClientEvents {
  server: (
    type: ServerEmits,
    payload?: any,
    callback?: (response: any) => void,
  ) => void
}

export interface ClientToServerEvents {
  client: (
    type: ClientEmits,
    payload?: any,
    callback?: (response: any) => void,
  ) => void
  createUser: (name?: string) => void
  createLobby: (callback?: (response: any) => void) => void
  joinLobby: (id: string, callback: (response: any) => void) => void
}

export type ClientSocket = Socket<ServerToClientEvents, ClientToServerEvents>
export type ServerSocket = SSocket<ClientToServerEvents, ServerToClientEvents>
