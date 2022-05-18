import { Button, Divider, Paper, Rating, Slide, Stack, Switch, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import React, { FormEvent, FunctionComponent, useRef } from "react";
import styled from "styled-components";

interface CreateLobbyProps {
  
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


const CreateLobby: FunctionComponent<CreateLobbyProps> = () => {
  const [value, setValue] = React.useState<number | null>(2);
  const [hover, setHover] = React.useState(-1);
  const [isPrivate, setPrivate] = React.useState<boolean>(false);
  const form = useRef<HTMLFormElement>(document.createElement("form"));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(form.current)
    const json = fetch('/api', { method: 'POST', body: data })
      .then(res => res.json())
      .then(json => {return json});
    console.log(json);
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
          Создать лобби
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
              label="Введите название игры" 
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
                Выберите количество игроков:
              </Typography>
              <Rating
                name="hover-feedback"
                value={value}
                precision={1}
                defaultValue={2} 
                max={4}
                sx={{
                  mr: 2
                }}
                onChange={(event, newValue) => {
                  setValue(newValue);
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
                Выберите тип лобби:
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
                  Открытое
                </Typography>
                <Switch 
                  color="secondary"
                  inputProps={{ 'aria-label': 'ant design' }} 
                  onChange={(e) => {
                    setPrivate(e.target.checked);
                  }}
                />
                <Typography
                  sx={{
                    color: !isPrivate ? 'white' : 'secondary.main'
                  }}
                >
                  Приватное
                </Typography>
              </Stack>
            </Box>
            {isPrivate ? 
              <CssTextField 
                id="filled-basic" 
                label="Введите пароль для лобби" 
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
              Создать
            </Button> 
            </Box> 
          </Box>
        </form>
      </Paper>
    </Slide>
  );
}
 
export default CreateLobby;