import { Box, Button, Modal, Paper, Typography } from "@mui/material";
import { Canvas, ThreeEvent } from "@react-three/fiber";
import axios from "axios";
import { FunctionComponent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../../features/socket";
import { UserData } from "../../interfaces/UserData";
import Controls from "../Controls/Controls";
import GameBgLayer from "../GameBgLayer/GameBgLayer";
import { SERVER_IP } from '../../features/server';

interface GameProps {
  userData: UserData,
  getUserData: Function
}
 
const Game: FunctionComponent<GameProps> = (props) => {
  const {userData, getUserData} = props;
  const {game, lobby, login} = userData;
  const [controlsZIndex, setControlsZIndex] = useState<number>(1000)
  const [isGameEnded, setGameEnded] = useState<boolean>(false)
  const [attachedSymbolMesh, attachSymbolMesh] = useState<THREE.Mesh>(null!)
  const navigate = useNavigate();
  useEffect(() => {
    if(!game)
      navigate('/'); 
    if(lobby?.players) {
      const didGameEnded = lobby?.players.every((player) => {return player?.is_ended})
      if(didGameEnded) {
        setGameEnded(true);
      }
    }
    socket.on('gameEnded', async () => {
      setGameEnded(true);
    });
    socket.on('gameMove', async () => {
      await getUserData();
    });
    socket.on('nextTurn', async () => {
      await getUserData();
    });
    socket.emit('room', lobby?.invite_id)
  }, []);
  const onControlsEnterHandler = () => {
    if(attachedSymbolMesh)
      setControlsZIndex(0);
    else
      setControlsZIndex(1000);
  }
  const onControlsOutHandler = () => {
    setControlsZIndex(1000);
  }
  const findSlotByTurn = (turn: number, playersCount: number) => {
    let slot = 1;
    switch(turn % playersCount) {
      case 0:
        slot = 1;
        break;
      case 1:
        slot = 2;
        break;
      case 2:
        slot = 3;
        break;
      case 3:
        slot = 4;
        break;
    }
    return slot;
  }

  const findCurrentPlayer = () => {
    const currentPlayer = lobby?.players.find((player) => {
      if(game && player)
        return player.slot === findSlotByTurn(game?.gameInfo.turn, lobby?.players.length)
    })
    return currentPlayer
  }

  const findYourPlayer = () => {
    const yourPlayer = lobby?.players.find((player) => {
      if(game && player)
        return login === player.player.login
    })
    return yourPlayer
  }
  const isYourTurn = () => {
    const currentPlayer = findCurrentPlayer();
    const didGameEnded = lobby?.players.every((player) => {return player?.is_ended})
    if(currentPlayer?.is_ended && !didGameEnded) {
      axios.post(SERVER_IP + '/api/nextTurn', {
        points: 0
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
      return false;
    }
    return login === currentPlayer?.player.login
  }

  const closeGameHandler = async () => {
    const yourPlayer = findYourPlayer();
    await axios.post(SERVER_IP + '/api/game/exitGame', {
      user_id: yourPlayer?.user_id
    }).then(async (response) => {
      if(response.status === 200) {
        setGameEnded(false);
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

  const playerNameWithMaxPoints = () => {
    let playerPoints = 0;
    let playerName = "";
    lobby?.players.forEach((player) => {
      if(player?.points && playerPoints < player.points){
        playerPoints = player.points;
        playerName = player.player.login;
      }
    });
    return playerName;
  }

  return (
    <>
    <Modal
        open={isGameEnded}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper
        sx={{
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
        }}
        >
          <Typography 
            variant="h6" 
            component="h2"
            sx={{
              padding: '10px'
            }}
          >
            Игра окончена, победил {playerNameWithMaxPoints()}
          </Typography>
          <Button
            type="submit"
            color="secondary" 
            variant="contained" 
            sx={{
              width: '100%',
            }}
            onClick={closeGameHandler}
          >
            Выйти
          </Button>
        </Paper>
      </Modal>
      <Box
        width={1225}
        height={825} 
        sx={{
          position:"absolute",
          top:"80px",
        }}
      >
        <Controls
          width="374px"
          height="500px"
          position={["839px", "12px"]}
          zIndex={controlsZIndex}
          onControlsEnterHandler={onControlsEnterHandler}
          onControlsOutHandler={onControlsOutHandler}
          lobby={userData['lobby']}
          game={userData['game']}
          isYourTurn={isYourTurn()}
          currentPlayer={findCurrentPlayer()}
          yourPlayer={findYourPlayer()}
          getUserData={getUserData}
        ></Controls>
      </Box>
      <Box
        width={1225}
        height={825} 
        sx={{
          position:"absolute",
          top:"80px",
        }}
      >
        <GameBgLayer 
          userData={userData}
          onControlsEnterHandler={onControlsEnterHandler}
          onControlsOutHandler={onControlsOutHandler}
          attachedSymbolMesh={attachedSymbolMesh}
          attachSymbolMesh={attachSymbolMesh}
          getUserData={getUserData}
          isYourTurn={isYourTurn()}
        />
      </Box> 
    </>
  );
}
 
export default Game;