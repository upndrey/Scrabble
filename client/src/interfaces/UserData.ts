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
  login: string
}