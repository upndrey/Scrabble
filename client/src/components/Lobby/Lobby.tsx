import { Alert, Button, Divider, List, ListItemText, Paper, Slide, Snackbar, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { FunctionComponent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../../interfaces/UserData";

interface LobbyProps {
  login: string
  lobby: UserData["lobby"],
  hasGame: boolean
}

const Lobby: FunctionComponent<LobbyProps> = (props) => {
  const {login, lobby, hasGame} = props;
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [isGameStart, startGame] = useState<boolean>(false);
  const navigate = useNavigate();
  useEffect(() => {
    if(hasGame)
      navigate('/game');
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
    axios.post('http://localhost:3000/api/startGame').then((response) => {
      if(response.status === 200) {
        const json = response.data;
        console.log(json);
        startGame(true);
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
    const listPlayers = lobby.players.map((player: any, index) => {
      return renderPlayer(player, index, lobby)
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
          <Button
            variant="contained"
            size="large"
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
          </Button>
        </Box>
      </Paper>
    </Slide>
  );
}
 
export default Lobby;