import { DealOptions } from '@sqooid/big-two'
import { BoardPlay, Card } from '@sqooid/big-two'

export interface ClientGame {
  turn: number
  playerIndex?: number
  winnerIndex: number
  currentPlayerIndex: number
  board: BoardPlay[]
  cards: Card[]
  remainingCardCount: number[]
}

export interface ClientUser {
  socketId: string
  name: string
}

export interface PlayerCardInfo {
  user: ClientUser
  isHost: boolean
  index: number
  remainingCards?: number
  isWinner?: boolean
  isTurn?: boolean
  isYou?: boolean
}

export interface ClientLobby {
  id: string
  host: ClientUser
  players: ClientUser[]
  spectators: ClientUser[]
  settings: LobbySettings
  game: ClientGame
  roundNumber: number
}

export interface LobbySettings {
  deal: DealOptions
}
