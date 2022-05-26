import React, { FormEvent, FunctionComponent, SetStateAction, useRef, useState } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Button, Paper, TextField } from "@mui/material";
import styled from "styled-components";
import axios from 'axios';
import { io } from "socket.io-client";
import {socket} from '../../features/socket';
axios.defaults.withCredentials = true;

interface LoginProps {
  isLoginOpened: boolean,
  setLoginOpen: Function,
  getUserData: Function
}

 
const Login: FunctionComponent<LoginProps> = (props) => {
  const [login, setLocalLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const {isLoginOpened, setLoginOpen, getUserData} = props;
  const handleLoginClose = () => setLoginOpen(false);
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    const apiUrl = 'http://localhost:3000/api/login';
    axios.post(apiUrl, {
      login: login,
      password: password
    }).then((response) => {
      if(response.status === 200) {
        if(login !== "") {
          socket.emit('login', login, socket.id)
        }
        getUserData();
        handleLoginClose();
        
      }
      else if(response.status === 422) {
        // TODO
      }
      else if(response.status === 400) {
        // TODO
      }
    });
  };

  return (
    <>
      <Modal
        open={isLoginOpened}
        onClose={handleLoginClose}
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
            Вход
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                padding: '10px',
                height: 'calc(100% - 72px)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <TextField 
                value={login}
                onInput={e => setLocalLogin((e.target as HTMLInputElement).value)}
                label="Введите логин" 
                sx={{
                  width: '100%',
                  mb:1
                }}
                InputLabelProps={{ 
                }}
                inputProps={{ 
                }}
              />
              <TextField 
                label="Введите пароль" 
                value={password}
                onInput={e => setPassword((e.target as HTMLInputElement).value)}
                type="password"
                sx={{
                  width: '100%',
                  mb:1
                }}
                InputLabelProps={{ 
                }}
                inputProps={{ 
                }}
              />
              
              <Button 
                type="submit"
                color="secondary" 
                variant="contained" 
                sx={{
                  width: '100%',
                }}
              >
                Войти
              </Button> 
            </Box>
          </form>
        </Paper>
      </Modal>
    </>
  );
}
 
export default Login;