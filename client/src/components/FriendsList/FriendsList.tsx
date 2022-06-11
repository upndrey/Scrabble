import { Avatar, Badge, Button, Checkbox, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Menu, MenuItem, Paper, Slide, Stack, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { EventHandler, FormEvent, FunctionComponent, MouseEventHandler, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import CloseIcon from '@mui/icons-material/Close';
import { Notifications } from "@mui/icons-material";
import {socket} from '../../features/socket';
import { UserData } from "../../interfaces/UserData";
import { SERVER_IP } from '../../features/server';

interface FriendsListProps {
  isFriendsOpen: boolean,
  login: string,
  lobby: UserData['lobby']
}

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

const FriendsList: FunctionComponent<FriendsListProps> = (props) => {
  const { isFriendsOpen, login, lobby} = props;
  const [name, setName] = useState<string>('');
  const [friendsList, setFriendsList] = useState<Array<any>>([]);

  useEffect(() => {
    socket.on('removeFriend', () => {
      console.log("remove");
      getFriendsList();
    })
    socket.on('friendAdded', () => {
      console.log("added");
      getFriendsList();
    })
    getFriendsList();
  }, []);

  const getFriendsList = () => {
    const apiUrl = SERVER_IP + '/api/friends/findAllFriends';
    if(login)
      axios.post(apiUrl,{
        login: login
      }).then(async (response) => { 
        if(response.status === 200) {  
          const json = response.data; 
          setFriendsList(json[0]?.friend);
        }  
      });
  }

  const handleSubmit = () => {
    const apiUrl = SERVER_IP + '/api/friends/addFriend';
    axios.post(apiUrl,{
      login: login,
      friend: name
    }).then(async (response) => {
      if(response.status === 200) {
        getFriendsList();
        socket.emit('addFriend', login, name);
      }
    });
  }

  const handleRemove = (friendName: string) => {
    const apiUrl = SERVER_IP + '/api/friends/removeFriend';
    axios.post(apiUrl,{
      login: login,
      friend: friendName
    }).then(async (response) => {
      if(response.status === 200) {
        socket.emit('removeFriend', login, friendName);
        getFriendsList();
      }
    });
  }

  const inviteInLobby = (friendName: string) => {
    socket.emit('inviteInLobby', friendName, lobby?.invite_id);
  }

  return ( 
    <Slide direction="right" unmountOnExit  in={isFriendsOpen && login !== ""}>
      <Paper 
        sx={{ 
          width: '100%', 
          maxWidth: 360,
          marginTop: '30px',
          backgroundColor: 'primary.main',
          zIndex: 999,
          display: 'inline-block',
          position: 'relative',
          mt:1,
          mr:1,
        }}
      >
        <Typography 
          variant='h6' 
          sx={{
            padding: '10px 20px 10px 20px',
            color: 'primary.contrastText'
          }}
        >
          Друзья
        </Typography>
        <Divider sx={{
          color: 'primary.contrastText'
        }}/>
        <List 
          dense 
          sx={{ 
            width: '100%', 
            height: '330px',
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '0.4em',
            },
            '&::-webkit-scrollbar-track': {
              boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
              webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,.3)',
              borderRadius:'25px',
            }
          }}
        >
        {friendsList?.map((value, i) => {
          if(!value)
            return "";
          return (
            <ListItem
              key={i} 
              disablePadding
            >
              <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem />}
                spacing={2}
                sx={{
                  display: 'flex',
                  width: '100%',
                  alignItems: 'center',
                  paddingLeft: '10px',
                  paddingRight: '10px'
                }}
              >
                
                <Typography
                  variant="body1"
                  sx={{
                    color: 'primary.contrastText',
                    flexGrow: 1,
                    width: '100%'
                  }}
                >
                  {value.login}
                </Typography>
                <Box
                sx={{
                  display: 'flex'
                }}
                >
                  {
                    lobby ? 
                    <IconButton
                      size="large"
                      color="inherit"
                      sx={{
                        color: 'primary.contrastText'
                      }}
                      onClick={inviteInLobby.bind(this, value.login)}
                    >
                      <Notifications />
                    </IconButton> : 
                    ""
                  }
                  
                  <IconButton
                    size="large"
                    color="inherit"
                    sx={{
                      color: 'primary.contrastText'
                    }}
                    onClick={handleRemove.bind(this, value.login)}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Stack>
            </ListItem>
          );
        })}
        </List>
        <Box
          sx={{
            p: 2
          }}
        >
          <CssTextField 
              label="Введите логин друга" 
              value={name}
              onInput={e => setName((e.target as HTMLInputElement).value)}
                
              sx={{
                
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
          <Button 
              type="submit"
              color="secondary" 
              variant="contained" 
              sx={{
                height: '55px',
                ml: 1
              }}
              onClick={handleSubmit}
            >
              Добавить
            </Button> 
            
        </Box>
      </Paper>
    </Slide>
  );
}
 
export default FriendsList;