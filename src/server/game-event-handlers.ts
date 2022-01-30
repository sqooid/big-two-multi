import { ServerLobby, ServerUser } from '@/interfaces/server-interfaces'
import { findPlay, Play } from '@sqooid/big-two'

function isPlay(play: any): play is Play {
  return 'combo' in play && 'comboValue' in play && 'cards' in play
}

export function extractPlay(
  user: ServerUser,
  lobby: ServerLobby,
  play?: number[] | Play,
) {
  // Determine the type of play
  let finalPlay: Play | undefined
  if (!play) {
    finalPlay = undefined
  } else if (Array.isArray(play)) {
    const playerIndex = lobby.players.indexOf(user)
    if (playerIndex === -1) return

    let invalidInput = false
    const playerCards = play.map((cardIndex) => {
      const card = lobby.game.players[playerIndex].cards[cardIndex]
      if (!card) invalidInput = true
      return card
    })
    if (invalidInput) return

    finalPlay = findPlay(playerCards)
    if (finalPlay === undefined) {
      return
    }
  } else {
    if (!isPlay(play)) return
    finalPlay = play
  }
  return finalPlay
}
