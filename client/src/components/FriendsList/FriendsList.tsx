import { Avatar, Badge, Button, Checkbox, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Menu, MenuItem, Paper, Slide, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { EventHandler, FormEvent, FunctionComponent, MouseEventHandler, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import CloseIcon from '@mui/icons-material/Close';
import { Notifications } from "@mui/icons-material";
import {socket} from '../../features/socket';

interface FriendsListProps {
  isFriendsOpen: boolean,
  login: string
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
  const { isFriendsOpen, login } = props;
  const [name, setName] = useState<string>('');
  const [friendsList, setFriendsList] = useState<Array<any>>([]);

  useEffect(() => {
    getFriendsList();

    
    socket.on('connect', function() {
      console.log('send room');
      // socketRef.current.emit('room', lobby?.invite_id);
    });
    socket.on('newUser', async (invide_id: string) => {
      console.log('get newUser');
    })
  }, []);

  const getFriendsList = () => {
    console.log(login); 
    const apiUrl = 'http://localhost:3000/api/findAllFriends';
    if(login)
      axios.post(apiUrl,{
        login: login
      }).then(async (response) => { 
        if(response.status === 200) {  
          const json = response.data; 
          setFriendsList(json);
          console.log(friendsList);  
        }  
        else if(response.status === 422) {
          // TODO
        }
        else if(response.status === 400) {
          // TODO
        }
      });
  }

  const handleSubmit = () => {
    const apiUrl = 'http://localhost:3000/api/addFriend';
    axios.post(apiUrl,{
      login: login,
      friend: name
    }).then(async (response) => {
      if(response.status === 200) {
        getFriendsList();
        socket.emit('addFriend', login, name);
      }
      else if(response.status === 422) {
        // TODO
      }
      else if(response.status === 400) {
        // TODO
      }
    });
  }

  const handleRemove = () => {
    const apiUrl = 'http://localhost:3000/api/removeFriend';
    axios.post(apiUrl,{
      login: login,
      name: name
    }).then(async (response) => {
      if(response.status === 200) {
        getFriendsList();
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
        {friendsList.map((value) => {
          if(!value.friend)
            return "";
          return (
            <ListItem
              key={value} 
              disablePadding
            >
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar
                    alt={`Avatar n°${value + 1}`}
                    src={`/static/images/avatar/${value + 1}.jpg`}
                  />
                </ListItemAvatar>
                <ListItemText 
                  sx={{
                    color: 'primary.contrastText'
                  }}
                  primary={`Friend ${value + 1}`} 
                />
                <ListItem>
                  <IconButton
                    size="large"
                    color="inherit"
                  >
                    <Notifications />
                  </IconButton>
                  <IconButton
                    size="large"
                    color="inherit"
                  >
                    <CloseIcon />
                  </IconButton>
                </ListItem>
              </ListItemButton>
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