export interface UserData {
  lobby: {
    max_players: number,
    name: string,
    invite_id: string,
    players: Array<{
      login: string,
      id: number,
      player: Array<{
        is_host: boolean,
        points: number | null,
        user_id: number,
      }>
    } | null>
  } | null,
  game: {
    gameInfo: {
      id: number,
      turn: number,
      is_closed: boolean
    },
    symbols: (string | number)[][],
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
    fieldCells: {
      id: number,
      field_id: number,
      symbol_id: number | null,
      row: number,
      col: number,
      createdAt: string,
      updatedAt: string
    }[][],
  } | null,
  login: string
}