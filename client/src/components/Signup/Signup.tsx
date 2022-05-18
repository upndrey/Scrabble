import { Button, Modal, Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { FormEvent, FunctionComponent, useRef, useState } from "react";

interface SignupProps {
  isSignupOpened: boolean,
  setSignupOpen: Function
}
 
const Signup: FunctionComponent<SignupProps> = (props) => {
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const {isSignupOpened, setSignupOpen} = props;
  const handleSignupClose = () => setSignupOpen(false);
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const json = fetch('http://localhost:3000/api/signup', 
    { 
      method: 'POST', 
      body: JSON.stringify({
        login: login,
        password: password
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json());
    handleSignupClose();
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
            Text in a modal
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
                onInput={e => setLogin((e.target as HTMLInputElement).value)}
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
                Создать
              </Button> 
            </Box>
          </form>
        </Paper>
      </Modal>
    </>
  );
}
 
export default Signup;