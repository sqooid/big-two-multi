import { ClientLobby } from '@/interfaces/client-interfaces'
import { ServerLobby } from '@/interfaces/server-interfaces'
import { Card, Game } from '@sqooid/big-two'
import fs from 'fs'

export function logToFile(filepath: string, content: string) {
  fs.writeFileSync(filepath, content, { flag: 'as' })
}

export function cardToTupleString(card: Card): string {
  let value = card.value - 3
  if (value < 0) value += 13
  return `(${card.suit},${value})`
}

export function cardArrayToString(array: Card[]): string {
  let str = '['
  for (let i = 0; i < array.length; ++i) {
    str += cardToTupleString(array[i])
    if (i !== array.length - 1) str += ','
  }
  return str + ']'
}

export function logGameStartingHands(lobby: ServerLobby) {
  const game = lobby.game
  let str = '['
  for (let i = 0; i < game.players.length; ++i) {
    str += cardArrayToString(game.players[i].cards)
    if (i !== game.players.length - 1) str += ','
  }
  str += ']'

  logToFile(process.env.LOG_DIR + lobby.id + '.txt', str + '\n')
}

export function logGamePlays(lobby: ServerLobby) {
  const game = lobby.game
  let str = '['
  for (let i = 0; i < game.board.length; ++i) {
    str += cardArrayToString(game.board[i].play.cards)
    if (i !== game.board.length - 1) str += ','
  }
  str += ']'

  logToFile(process.env.LOG_DIR + lobby.id + '.txt', str)
}
