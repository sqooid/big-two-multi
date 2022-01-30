import { ServerLobby, ServerUser } from '@/interfaces/server-interfaces'
import { extractPlay } from '@/server/game-event-handlers'
import {
  createGame,
  findPlay,
  Hand,
  newCard,
  Play,
  Suit,
} from '@sqooid/big-two'
import { expect } from 'chai'

describe('extractPlay', () => {
  let lobby: ServerLobby
  before(() => {
    const host: ServerUser = {
      name: 'bob',
      socketId: 'asdf',
      lobby,
    }
    const player2: ServerUser = {
      name: 'guy',
      socketId: 'zxcv',
      lobby,
    }
    const player3: ServerUser = {
      name: 'dude',
      socketId: 'uiop',
      lobby,
    }
    const player4: ServerUser = {
      name: 'he',
      socketId: 'hjkl',
      lobby,
    }
    lobby = {
      game: createGame(),
      id: 'qwerty',
      host,
      players: [host, player2, player3, player4],
      roundNumber: 1,
      settings: {
        deal: {
          playerCount: 4,
        },
      },
      spectators: [],
    }
    lobby.game._state.players = [
      {
        cards: [
          newCard(Suit.DIAMOND, 3),
          newCard(Suit.DIAMOND, 4),
          newCard(Suit.DIAMOND, 5),
          newCard(Suit.DIAMOND, 6),
          newCard(Suit.DIAMOND, 7),
          newCard(Suit.DIAMOND, 3),
          newCard(Suit.CLUB, 3),
          newCard(Suit.SPADE, 3),
          newCard(Suit.DIAMOND, 4),
          newCard(Suit.SPADE, 4),
        ],
      },
      {
        cards: [
          newCard(Suit.DIAMOND, 3),
          newCard(Suit.CLUB, 3),
          newCard(Suit.SPADE, 3),
          newCard(Suit.DIAMOND, 4),
          newCard(Suit.SPADE, 4),
        ],
      },
      {
        cards: [
          newCard(Suit.DIAMOND, 3),
          newCard(Suit.DIAMOND, 4),
          newCard(Suit.DIAMOND, 5),
          newCard(Suit.DIAMOND, 6),
          newCard(Suit.DIAMOND, 7),
        ],
      },
      {
        cards: [
          newCard(Suit.DIAMOND, 3),
          newCard(Suit.DIAMOND, 4),
          newCard(Suit.DIAMOND, 5),
          newCard(Suit.DIAMOND, 6),
          newCard(Suit.DIAMOND, 7),
        ],
      },
    ]
  })
  it('finds pass correctly with null', () => {
    const play = extractPlay(lobby.host, lobby, null as unknown as undefined)
    expect(play).to.be.undefined
  })
  it('finds pass correctly with undefined', () => {
    const play = extractPlay(lobby.host, lobby, undefined)
    expect(play).to.be.undefined
  })
  it('finds play correctly Play object', () => {
    const playObj = findPlay([
      newCard(Suit.DIAMOND, 3),
      newCard(Suit.DIAMOND, 4),
      newCard(Suit.DIAMOND, 5),
      newCard(Suit.DIAMOND, 6),
      newCard(Suit.DIAMOND, 7),
    ])
    const play = extractPlay(lobby.host, lobby, playObj)
    const expectedPlay: Play = {
      combo: Hand.STRAIGHTFLUSH,
      comboValue: newCard(Suit.DIAMOND, 7),
      cards: [
        newCard(Suit.DIAMOND, 3),
        newCard(Suit.DIAMOND, 4),
        newCard(Suit.DIAMOND, 5),
        newCard(Suit.DIAMOND, 6),
        newCard(Suit.DIAMOND, 7),
      ],
    }
    expect(play).to.be.eql(expectedPlay)
  })
  it('finds play correctly index array', () => {
    const playObj = [0, 1, 2, 3, 4]
    const play = extractPlay(lobby.host, lobby, playObj)
    const expectedPlay: Play = {
      combo: Hand.STRAIGHTFLUSH,
      comboValue: newCard(Suit.DIAMOND, 7),
      cards: [
        newCard(Suit.DIAMOND, 3),
        newCard(Suit.DIAMOND, 4),
        newCard(Suit.DIAMOND, 5),
        newCard(Suit.DIAMOND, 6),
        newCard(Suit.DIAMOND, 7),
      ],
    }
    expect(play).to.be.eql(expectedPlay)
  })
  it('finds incorrect indices as pass', () => {
    const playObj = [0, 6, 3, 7, 8]
    const play = extractPlay(lobby.host, lobby, playObj)
    expect(play).to.be.undefined
  })
  it('finds incorrect input array as pass', () => {
    const playObj = ['a', 2, 'b', 3] as number[]
    const play = extractPlay(lobby.host, lobby, playObj)
    expect(play).to.be.undefined
  })
  it('finds incorrect input Play object as pass', () => {
    const playObj = { a: 'lmao' } as unknown as Play
    const play = extractPlay(lobby.host, lobby, playObj)
    expect(play).to.be.undefined
  })
})
