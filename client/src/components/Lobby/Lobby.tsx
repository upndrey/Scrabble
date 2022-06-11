import { Alert, Button, Divider, List, IconButton, Paper, Slide, Snackbar, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../../interfaces/UserData";
import { LoadingButton } from '@mui/lab';
import { io } from "socket.io-client";
import {socket} from '../../features/socket';
import CloseIcon from '@mui/icons-material/Close';
import { SERVER_IP } from '../../features/server';

interface LobbyProps {
  login: string
  lobby: UserData["lobby"],
  hasGame: boolean,
  getUserData: Function
}

const Lobby: FunctionComponent<LobbyProps> = (props) => {
  const {login, lobby, hasGame, getUserData} = props;
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [isGameBeginStart, beginStartGame] = useState<boolean>(false);
  const [isGameStart, startGame] = useState<boolean>(false);
  const navigate = useNavigate();
  useEffect(() => {
    if(hasGame)
      navigate('/game');
  });
  useEffect(() => {
    socket.emit('room', lobby?.invite_id);
    socket.on('newUser', async (invide_id: string) => {
      await getUserData();
    })
    socket.on('startGame', async () => {
      await getUserData();
    })
    socket.on('removedFromLobby', async () => {
      socket.emit('leaveRoom', lobby?.invite_id);
      const apiUrl = SERVER_IP + '/api/lobby/removeLobbyData';
      await axios.post(apiUrl)
      await getUserData();
    })
  }, []);

  const handleRemove = (id: number) => {
    const apiUrl = SERVER_IP + '/api/lobby/removeFromLobby';
    if(login)
      axios.post(apiUrl,{
        player_id: id
      }).then(async (response) => { 
        if(response.status === 200) { 
          socket.emit('removeFromRoom', id)
          await getUserData();
        }  
      });
  }

  const handleCloseLobby = () => {
    const apiUrl = SERVER_IP + '/api/lobby/closeLobby';
    if(login && lobby)
      axios.post(apiUrl,{
        invite_id: lobby.invite_id
      }).then(async (response) => { 
        if(response.status === 200) { 
          socket.emit('removeRoom', lobby.invite_id)
          await getUserData();
        }  
      });
  }

  if(!lobby)
    return (<div></div>);
  const renderPlayer = (player: any, index: number, lobby: UserData["lobby"]) => {
    return (
      <Box
        key={index}
        sx={{
          pl:1,
          pr:1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography
          variant='body1'
          sx={{
            color: 'primary.contrastText'
          }}
        >
          {player ? player.login : "Место свободно"}
        </Typography>
        {
            lobby?.players[0]?.player.login === login && player?.id && player?.login !== login ?
            <IconButton
              size="large"
              color="inherit"
              sx={{
                color: 'primary.contrastText'
              }}
              onClick={handleRemove.bind(this, player?.id)}
            >
              <CloseIcon />
            </IconButton> :
            ""
          }
      </Box>
    )
  }

  const startGameHandler = () => {
    beginStartGame(true)
    axios.post(SERVER_IP + '/api/game/startGame').then(async (response) => {
      if(response.status === 200) {
        await getUserData();
        socket.emit('startGame', lobby.invite_id)
        startGame(true);
        beginStartGame(false);
      }
    });
  }

  const renderListPlayers = (lobby: UserData["lobby"]) => {
    if(!lobby)
      return "";

    while(lobby.players.length !== lobby.max_players)
    lobby.players.push(null);
    const listPlayers = lobby.players.map((user: any, index) => {
      return renderPlayer(user?.player, index, lobby)
    });
    return listPlayers;
  }

  return ( 
    <Slide direction="down" in={true}>
      <Paper
        sx={{ 
          minWidth: '500px', 
          maxWidth: '100%',
          marginTop: '0px',
          backgroundColor: 'primary.main',
          zIndex: 999,
          height: '445px',
          overflow: 'hidden',
          display: 'inline-block',
          position: 'relative',
          mt:1,
          }}
      >
        <Typography
          variant='h6' 
          sx={{
            padding: '10px 20px 10px 20px',
            color: 'primary.contrastText'
          }}
        >
          Лобби
        </Typography>
        <Divider sx={{
          color: 'primary.contrastText'
        }}/>
        <Stack
          divider={<Divider flexItem />}
          spacing={1}
          sx={{
            mt:1,
            mb:1
          }}
        >
          {renderListPlayers(lobby)}
        </Stack>
        <Divider sx={{
          color: 'primary.contrastText'
        }}/>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: 'primary.light',
              color: 'primary.contrastText',
              m:1,
              width: '500px',
            }}
            onClick={
              () => {
                setCopySuccess(true);
                navigator.clipboard.writeText(`${SERVER_IP}/api/lobby/inviteLink/${lobby.invite_id}`)
              }
            }
          >
            Копировать ссылку на приглашение
          </Button>
          <Snackbar open={copySuccess} autoHideDuration={1000} onClose={() => {setCopySuccess(false)}}>
            <Alert severity="success" sx={{ width: '100%' }}>
              Скопированно!
            </Alert>
          </Snackbar>
          {
            lobby.players[0]?.player.login === login ?
            <LoadingButton
              variant="contained"
              size="large"
              loading={isGameBeginStart}
              disabled={isGameBeginStart}
              onClick={startGameHandler}
              sx={{
                backgroundColor: 'secondary.light',
                color: 'primary.contrastText',
                m:1,
                width: '500px',
                '&:hover': {
                  backgroundColor: 'secondary.dark'
                }
              }}
            >
              Начать игру
            </LoadingButton> :
            ""
          }
          {
            lobby.players[0]?.player.login === login ?
            <Button
              variant="contained"
              color="error"
              sx={{
                m:1,
                width: '500px',
              }}
              onClick={handleCloseLobby}
            >
              Закрыть лобби
            </Button> :
            ""
          }
        </Box>
      </Paper>
    </Slide>
  );
}
 
export default Lobby;