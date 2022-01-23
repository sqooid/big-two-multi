import { DealOptions } from '@sqooid/big-two'
import { BoardPlay, Card } from '@sqooid/big-two'

export interface ClientGame {
  turn: number
  playerIndex?: number
  currentPlayerIndex: number
  board: BoardPlay[]
  cards: Card[]
  remainingCardCount: number[]
}

export interface ClientUser {
  socketId: string
  name: string
}

export interface OtherPlayerInfo {
  user: ClientUser
  isHost: boolean
  remainingCards?: number
  isTurn?: boolean
}

export interface ClientLobby {
  id: string
  host: ClientUser
  players: ClientUser[]
  spectators: ClientUser[]
  settings: LobbySettings
  game: ClientGame
}

export interface LobbySettings {
  deal: DealOptions
}
