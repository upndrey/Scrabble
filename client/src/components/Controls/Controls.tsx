import { Button, Divider, List, Stack, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { socket } from '../../features/socket'
import { UserData } from '../../interfaces/UserData'
import GamePlayersList from '../GamePlayersList/GamePlayersList'
import GamePoints from '../GamePoints/GamePoints'
import { SERVER_IP } from '../../features/server';

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
  currentPlayer: any,
  yourPlayer: any,
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
    currentPlayer,
    yourPlayer,
    getUserData
  }: Props) => {
  const [points, setPoints] = useState<number>(0);
  const navigate = useNavigate();

  const nextTurnHandler = async () => {
    await axios.post(SERVER_IP + '/api/game/nextTurn', {
      points: points
    }).then(async (response) => {
      if(response.status === 200) {
        await getUserData();
        socket.emit('nextTurn', lobby?.invite_id)
      }
      else if(response.status === 422) {
        // TODO
      }
      else if(response.status === 400) {
        // TODO
      }
    });
  }

  const exitGameHandler = async () => {
    await nextTurnHandler();
    await axios.post(SERVER_IP + '/api/game/exitGame', {
      user_id: yourPlayer?.user_id
    }).then(async (response) => {
      if(response.status === 200) {
        socket.emit('gameMove', lobby?.invite_id)
        await getUserData();
        socket.emit('leaveRoom');
        navigate('/'); 
      }
      else if(response.status === 422) {
        // TODO
      }
      else if(response.status === 400) {
        // TODO
      }
    });
  }
  
  const noMoreWaysHandler = async () => {
    await axios.post(SERVER_IP + '/api/game/noMoreWays', {
      user_id: currentPlayer?.user_id
    }).then(async (response) => {
      if(response.status === 200) {
        nextTurnHandler()
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
        currentPlayerName={currentPlayer?.player.login}
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
          onClick={() => {noMoreWaysHandler()}}
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
        onClick={() => {exitGameHandler()}}
      >
        Выйти из игры
      </Button>
    </Box>
  )
}

export default Controls