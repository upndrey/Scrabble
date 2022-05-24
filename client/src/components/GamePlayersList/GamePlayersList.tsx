import { Box, Divider, Stack, Typography } from '@mui/material'
import React from 'react'
import { UserData } from '../../interfaces/UserData'

type Props = {
  lobby: UserData["lobby"],
  turn: number | undefined,
  isYourTurn: boolean,
  currentPlayerName: string | undefined
}

const GamePlayersList = ({lobby, turn, isYourTurn, currentPlayerName}: Props) => {
  const renderPlayer = (user: any, index: number) => {
    return (
      <Box
        key={index}
        sx={{
          p:1
        }}
      >
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
        >
          <Typography
            variant='body1'
            sx={{
              color: 'primary.contrastText',
              flexGrow: 1
            }}
          >
            {currentPlayerName === user.player.login ? "Ходит: " : ""}{user.player.login}
          </Typography>
          <Typography
            variant='body1'
            sx={{
              color: 'primary.contrastText',
              minWidth: '71px'
            }}
          >
            {user.points ? user.points : 0} очков
          </Typography>
        </Stack>
      </Box>
    )
  }
  const renderListPlayers = () => {
    if(!lobby)
      return "";
      
    const listPlayers = lobby.players.map((user: any, index) => {
      if(user)
        return renderPlayer(user, index)
      else 
        return "";
    });
    return listPlayers;
  }
  return (
    <Stack
      divider={<Divider flexItem />}
      spacing={1}
      sx={{
        mt:1,
        mb:1,
      }}
    >
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={2}
      >
      <Typography 
        variant='body1'
        sx={{
          color: 'primary.contrastText',
          flexGrow: 1
        }}
      >
        Список игроков
      </Typography>
      <Typography 
        variant='body1'
        sx={{
          color: 'primary.contrastText',
          minWidth: '80px'
        }}
      >
      {turn ? turn : 0} Ход
      </Typography>
      </Stack>
      {renderListPlayers()}
    </Stack>
  )
}

export default GamePlayersList