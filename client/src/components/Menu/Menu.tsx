import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import UserMenu from '../UserMenu/UserMenu';
import { styled } from '@mui/system';
import { Link } from "react-router-dom";


const ActiveButton = styled(Button)(
  ({ theme }) => `
    background-color: ${theme.palette.primary.dark};
  `,
);

interface MenuProps {
  isFriendsOpen: boolean,
  openFriends: Function,
  setLoginOpen: Function,
  setSignupOpen: Function,
  setLogin: Function,
  login: string,
  hasLobby: boolean,
  hasGame: boolean,
}
 
const Menu: React.FunctionComponent<MenuProps> = (props) => {
  const {
    isFriendsOpen, 
    openFriends, 
    setLoginOpen, 
    setSignupOpen, 
    setLogin,
    login,
    hasLobby,
    hasGame,
  } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  

  const handleLogin = () => {
    setLoginOpen(true);
  };

  const handleSignup = () => {
    setSignupOpen(true);
  }

  const handleFriendsOpen = () => {
    openFriends(!isFriendsOpen);
  }

  const renderLoginMenu = () => {
    if(login !== "") {
      return <UserMenu 
        login={login} 
        anchorEl={anchorEl} 
        setAnchorEl={setAnchorEl} 
        setLogin={setLogin}
      ></UserMenu>
    }
    else {
      return (
        <>
          <Button color="inherit" onClick={handleLogin}>Войти</Button>
          <Button color="inherit" onClick={handleSignup}>Зарегистрироваться</Button>
        </>
      );
    }
  }

  const friendsButton = () => {
    if(login === "") 
      return (<></>);
    if(isFriendsOpen) 
      return (
        <ActiveButton 
          color="inherit"
          onClick={handleFriendsOpen}
          sx={{
            mr:1
          }}
        >
          Друзья
        </ActiveButton>
      )
    else 
      return (
        <Button 
          color="inherit"
          onClick={handleFriendsOpen}
          sx={{
            mr:1
          }}
        >
          Друзья
        </Button>
      )
  }

  const lobbyButton = () => {
    if(login === "") 
      return (<></>);
    if(hasGame)
      return(
        <Link 
          style={{
            textDecoration: 'none',
            color: 'inherit'
          }}
          to="/game"
        >
          <Button 
            color="inherit"
            sx={{
              backgroundColor: 'secondary.main',
              '&:hover': {
                backgroundColor: 'secondary.light',
              }
            }}
          >
            Игра
          </Button>
        </Link>
      );
    else if(hasLobby)
      return(
        <Link 
          style={{
            textDecoration: 'none',
            color: 'inherit'
          }}
          to="/lobby"
        >
          <Button 
            color="inherit"
            sx={{
              backgroundColor: 'secondary.main',
              '&:hover': {
                backgroundColor: 'secondary.light',
              }
            }}
          >
            Лобби
          </Button>
        </Link>
      );
    else {
      return (<></>);
    }
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar 
        position="static"
        sx={{
        }}
      >
        <Toolbar>
          <Link 
            to="/"
            style={{
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <Typography variant="h4" component="div" sx={{ 
              userSelect: "none"
              }}>
              Scrabble
            </Typography>
          </Link>
          <Box
            sx={{
              flexGrow: 1,
              ml:5
            }}
          >
            {friendsButton()}
            <Button 
              color="inherit"
              sx={{
                mr:1
              }}
            >
              Правила
            </Button>
            {lobbyButton()}
          </Box>
          {renderLoginMenu()}
          
          <Button
            color="inherit"
            aria-label="menu"
            sx={{ ml:1, display: { xs: 'flex', md: 'none' }}}
          >
            <MenuIcon />
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Menu;