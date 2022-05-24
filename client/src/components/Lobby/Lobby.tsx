import { Alert, Button, Divider, List, ListItemText, Paper, Slide, Snackbar, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../../interfaces/UserData";
import { LoadingButton } from '@mui/lab';
import { io } from "socket.io-client";

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
  const SERVER_URL = 'http://localhost:3000';
  const socketRef = useRef<any>(null!)
  useEffect(() => {
    if(hasGame)
      navigate('/game');
  });
  useEffect(() => {
    if(!socketRef.current)
      socketRef.current = io(SERVER_URL, {
        query: { 
          invite_id: lobby?.invite_id
        }
      })
    
    socketRef.current.on('connect', function() {
      console.log('send room');
      socketRef.current.emit('room', lobby?.invite_id);
    });
    socketRef.current.on('newUser', async (invide_id: string) => {
      console.log('get newUser');
      await getUserData();
    })
  }, []);

  useEffect(() => {
  });

  if(!lobby)
    return (<div></div>);
  const renderPlayer = (player: any, index: number, lobby: UserData["lobby"]) => {
    return (
      <Box
        key={index}
        sx={{
          p:1
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
      </Box>
    )
  }

  const startGameHandler = () => {
    beginStartGame(true)
    axios.post('http://localhost:3000/api/startGame').then(async (response) => {
      if(response.status === 200) {
        await getUserData();
        startGame(true);
        beginStartGame(false);
      }
      else if(response.status === 422) {
        // TODO
      }
      else if(response.status === 400) {
        // TODO
      }
    });
  }

  const renderListPlayers = (lobby: UserData["lobby"]) => {
    if(!lobby)
      return "";
      
    for(let i = 0; i < lobby.max_players - lobby.players.length; i++) {
      lobby.players.push(null);
    }
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
          height: '399px',
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
            mb:1,
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
                navigator.clipboard.writeText(`http://localhost:3000/api/inviteLink/${lobby.invite_id}`)
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
          </LoadingButton>
        </Box>
      </Paper>
    </Slide>
  );
}
 
export default Lobby;