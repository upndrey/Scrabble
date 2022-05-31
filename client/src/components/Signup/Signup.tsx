import { Button, Modal, Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { FormEvent, FunctionComponent, useRef, useState } from "react";
import axios from 'axios';
import { SERVER_IP } from '../../features/server';
axios.defaults.withCredentials = true;

interface SignupProps {
  isSignupOpened: boolean,
  setSignupOpen: Function,
  getUserData: Function
}
 
const Signup: FunctionComponent<SignupProps> = (props) => {
  const [login, setLocalLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const {isSignupOpened, setSignupOpen, getUserData} = props;
  const handleSignupClose = () => setSignupOpen(false);
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const apiUrl = SERVER_IP + '/signup';
    axios.post(apiUrl, {
      login: login,
      password: password
    }).then((response) => {
      if(response.status === 200) {
        getUserData();
        handleSignupClose();
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
        open={isSignupOpened}
        onClose={handleSignupClose}
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
            Регистрация
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
                type="text"
                name="login"
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
                type="password"
                name="password"
                value={password}
                onInput={e => setPassword((e.target as HTMLInputElement).value)}
                label="Введите пароль" 
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
                Зарегистрироваться
              </Button> 
            </Box>
          </form>
        </Paper>
      </Modal>
    </>
  );
}
 
export default Signup;