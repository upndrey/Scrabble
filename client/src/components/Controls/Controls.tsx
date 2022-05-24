import { Button, Divider, List, Stack, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import axios from 'axios'
import React, { useState } from 'react'
import { UserData } from '../../interfaces/UserData'
import GamePlayersList from '../GamePlayersList/GamePlayersList'
import GamePoints from '../GamePoints/GamePoints'

type Props = {
  width: string,
  height: string,
  position: Array<string>,
  zIndex: number,
  onControlsEnterHandler: Function,
  onControlsOutHandler: Function,
  lobby: UserData['lobby'],
  game: UserData['game'],
  isYourTurn: boolean,
  currentPlayerName: string | undefined,
  getUserData: Function
}

const Controls = ({
    width, 
    height, 
    position, 
    zIndex, 
    onControlsEnterHandler, 
    onControlsOutHandler,
    lobby,
    game,
    isYourTurn,
    currentPlayerName,
    getUserData
  }: Props) => {
  const [points, setPoints] = useState<number>(0);

  const nextTurnHandler = async () => {
    await axios.post('http://localhost:3000/api/nextTurn', {
      points: points
    }).then(async (response) => {
      if(response.status === 200) {
        await getUserData();
      }
      else if(response.status === 422) {
        // TODO
      }
      else if(response.status === 400) {
        // TODO
      }
    });
  }

  return (
    <Box
      onMouseEnter={() => {onControlsEnterHandler()}}
      onMouseOut={() => {onControlsOutHandler()}}
      sx={{
        width: width,
        height: height,
        position: 'absolute',
        left: position[0],
        top: position[1],
        zIndex: zIndex,
        p:1,
        boxSizing:'border-box'
      }}
    >
      <GamePlayersList 
        lobby={lobby}
        turn={game?.gameInfo.turn}
        isYourTurn={isYourTurn}
        currentPlayerName={currentPlayerName}
      />
      <Divider sx={{
        color: 'primary.contrastText',
        mb: 1.5
      }}/>
      {isYourTurn ?
        <GamePoints 
          points={points}
          setPoints={setPoints}
        /> :
      ""}
      {isYourTurn ?
        <Button 
          variant="contained" 
          sx={{
            width: '100%',
            mt: 2
          }}
          onClick={() => {nextTurnHandler()}}
        >
          Закончить ход
        </Button> : 
      ""}
      {isYourTurn ?
        <Button 
          variant="contained" 
          sx={{
            width: '100%',
            mt: 1
          }}
          onClick={() => {}}
        >
          Кончились ходы
        </Button> :
      ""}
      <Button 
        variant="contained" 
        color="error"
        sx={{
          width: '100%',
          mt: 1
        }}
        onClick={() => {}}
      >
        Выйти из игры
      </Button>
    </Box>
  )
}

export default Controls