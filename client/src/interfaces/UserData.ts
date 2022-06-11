export interface UserData {
  lobby: {
    max_players: number,
    name: string,
    invite_id: string,
    players: Array<Player | null>
  } | null,
  game: {
    gameInfo: {
      id: number,
      turn: number,
      is_closed: boolean
    },
    symbols: { id: number; value: string; price: number; in_box: number; }[],
    mapCells: {
      cell: {
        id: number,
        map_id: number,
        cell_modifier_id: number,
        row: number,
        col: number,
        createdAt: string,
        updatedAt: string
      },
      modifier: {
        id: number,
        name: string,
        value: number,
        description: string | null,
        color: string,
        createdAt: string,
        updatedAt: string
      }
    }[][],
    fieldCells: FieldCell[][],
  } | null,
  login: string
}

export interface FieldCell {
  id: number,
  field_id: number,
  symbol_id: number | null,
  row: number,
  col: number,
  createdAt: string,
  updatedAt: string
}

export interface Player {
  user_id: number,
  is_host: boolean,
  points: number | null,
  slot: number,
  is_ended: boolean,
  player: {
    id: number,
    login: string,
  },
  hand: {
    slot1: number | null,
    slot2: number | null,
    slot3: number | null,
    slot4: number | null,
    slot5: number | null,
    slot6: number | null,
    slot7: number | null,
  }
}
