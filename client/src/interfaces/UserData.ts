export interface UserData {
  lobby: {
    max_players: number,
    name: string,
    slot1_info: {
      login: string,
      id: number,
      player: Array<{
        is_host: boolean,
        points: number | null,
        user_id: number
      }>
    } | null,
    slot2_info: {
      login: string,
      id: number,
      player: Array<{
        is_host: boolean,
        points: number | null,
        user_id: number
      }>
    } | null,
    slot3_info: {
      login: string,
      id: number,
      player: Array<{
        is_host: boolean,
        points: number | null,
        user_id: number
      }>
    } | null,
    slot4_info: {
      login: string,
      id: number,
      player: Array<{
        is_host: boolean,
        points: number | null,
        user_id: number
      }>
    } | null
  } | null,
  login: string
}