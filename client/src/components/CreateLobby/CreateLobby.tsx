import { Button, Divider, Paper, Rating, Slide, Stack, Switch, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import React, { FormEvent, FunctionComponent, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { SERVER_IP } from '../../features/server';
axios.defaults.withCredentials = true;

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: 'white',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'white',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'grey',
    },
    '&:hover fieldset': {
      borderColor: 'white',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white',
    },
  },
});

interface CreateLobbyProps {
  setInviteId: Function,
  getUserData: Function
}

const CreateLobby: FunctionComponent<CreateLobbyProps> = (props) => {
  const { setInviteId, getUserData } = props;
  const [maxPlayers, setMaxPlayers] = React.useState<number | null>(2);
  const [_, setHover] = React.useState(-1);
  const [name, setName] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [isPrivate, setPrivate] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const form = useRef<HTMLFormElement>(document.createElement("form"));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const apiUrl = SERVER_IP + '/api/lobby/createLobby';
    axios.post(apiUrl,{
      name: name,
      password: password,
      is_private: isPrivate,
      max_players: maxPlayers,
    }).then(async (response) => {
      if(response.status === 200) {
        const json = response.data;
        setInviteId(json.invite_id);
        await getUserData();
      }
    });
    navigate("/lobby");
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
          ?????????????? ??????????
        </Typography>
        <Divider sx={{
          color: 'primary.contrastText'
        }}/>
        <form 
          ref={form} 
          onSubmit={handleSubmit}
          style={{
            padding: '10px',
            height: 'calc(100% - 72px)'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}
          >
            <CssTextField 
              id="filled-basic" 
              label="?????????????? ???????????????? ????????" 
              value={name}
              onInput={e => setName((e.target as HTMLInputElement).value)}
                
              sx={{
                width: '100%',
                mb:1
              }}
              InputLabelProps={{ 
                style: { 
                  color: 'white',
                  borderColor: 'white'
                },
              }}
              inputProps={{ 
                style: { 
                  color: 'white',
                  borderColor: 'white'
                },
              }}
            />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid grey',
                borderRadius: '4px',
                justifyContent: 'space-between',
                mb: 1
              }}
            >
              <Typography
                variant='subtitle1' 
                sx={{
                  padding: '10px 20px 10px 20px',
                  color: 'primary.contrastText',
                  display: 'inline-block'
                }}
              >
                ???????????????? ???????????????????? ??????????????:
              </Typography>
              <Rating
                name="hover-feedback"
                value={maxPlayers}
                precision={1}
                defaultValue={2} 
                max={4}
                sx={{
                  mr: 2
                }}
                onChange={(event, newValue) => {
                  setMaxPlayers(newValue);
                }}
                size='medium'
                onChangeActive={(event, newHover) => {
                  setHover(newHover);
                }}
                icon={
                  <PersonIcon 
                    fontSize="inherit"
                    sx={{
                      color: 'secondary.main'
                    }}
                  />
                }
                emptyIcon={
                  <PersonOutlineIcon 
                    fontSize="inherit" 
                    sx={{
                      color: 'white'
                    }}
                  />}
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid grey',
                borderRadius: '4px',
                justifyContent: 'space-between',
                mb:1,
              }}
            >
              <Typography
                variant='subtitle1' 
                sx={{
                  padding: '10px 20px 10px 20px',
                  color: 'primary.contrastText',
                  display: 'inline-block'
                }}
              >
                ???????????????? ?????? ??????????:
              </Typography>
              <Stack 
                direction="row" 
                spacing={1} 
                alignItems="center"
                sx={{
                  mr:2
                }}
              >
                <Typography
                  sx={{
                    color: isPrivate ? 'white' : 'secondary.main'
                  }}
                >
                  ????????????????
                </Typography>
                <Switch 
                  color="secondary"
                  inputProps={{ 'aria-label': 'ant design' }} 
                  value={isPrivate}
                  onChange={(e) => {
                    setPrivate(e.target.checked);
                  }}
                />
                <Typography
                  sx={{
                    color: !isPrivate ? 'white' : 'secondary.main'
                  }}
                >
                  ??????????????????
                </Typography>
              </Stack>
            </Box>
            {isPrivate ? 
              <CssTextField 
                id="filled-basic" 
                label="?????????????? ???????????? ?????? ??????????" 
                value={password}
                onInput={e => setPassword((e.target as HTMLInputElement).value)}
                sx={{
                  width: '100%',
                  mb:1,
                }}
                InputLabelProps={{ 
                  style: { 
                    color: 'white',
                    borderColor: 'white'
                  },
                }}
                inputProps={{ 
                  style: { 
                    color: 'white',
                    borderColor: 'white'
                  },
                }}
              /> : 
              ""
            }
            <Box
              sx={{
                width: '100%',
                flexGrow: '1',
                display: 'flex',
                flexDirection: 'column-reverse'
              }}
            >
            <Button 
              type="submit"
              color="secondary" 
              variant="contained" 
              sx={{
                width: '100%',
              }}
            >
              ??????????????
            </Button> 
            </Box> 
          </Box>
        </form>
      </Paper>
    </Slide>
  );
}
 
export default CreateLobby;