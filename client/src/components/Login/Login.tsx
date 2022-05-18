import React, { FormEvent, FunctionComponent, SetStateAction, useRef } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Button, Paper, TextField } from "@mui/material";
import styled from "styled-components";

interface LoginProps {
  isLoginOpened: boolean,
  setLoginOpen: Function
}

 
const Login: FunctionComponent<LoginProps> = (props) => {
  const form = useRef<HTMLFormElement>(document.createElement("form"));
  const {isLoginOpened, setLoginOpen} = props;
  const handleLoginClose = () => setLoginOpen(false);
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleLoginClose();
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
            Text in a modal
          </Typography>
          <form ref={form} onSubmit={handleSubmit}>
            <Box
              sx={{
                padding: '10px',
                height: 'calc(100% - 72px)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <TextField 
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
                Создать
              </Button> 
            </Box>
          </form>
        </Paper>
      </Modal>
    </>
  );
}
 
export default Login;