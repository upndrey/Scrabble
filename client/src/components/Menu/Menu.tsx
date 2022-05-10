import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import UserMenu from '../UserMenu/UserMenu';
import { styled } from '@mui/system';


const ActiveButton = styled(Button)(
  ({ theme }) => `
    background-color: ${theme.palette.primary.dark};
  `,
);

interface MenuProps {
  isFriendsOpen: boolean,
  openFriends: Function
}
 
const Menu: React.FunctionComponent<MenuProps> = (props) => {
  const {isFriendsOpen, openFriends} = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [login, setLogin] = React.useState<null | string>(null);

  const handleLogin = () => {
    setLogin('username');
  };

  const handleFriendsOpen = () => {
    openFriends(!isFriendsOpen);
  }

  const renderLoginMenu = () => {
    if(login) {
      return <UserMenu login={login} anchorEl={anchorEl} setAnchorEl={setAnchorEl} setLogin={setLogin}></UserMenu>
    }
    else {
      return (
        <Button color="inherit" onClick={handleLogin}>Войти</Button>
      );
    }
  }

  const friendsButton = () => {
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
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar 
        position="static"
        sx={{
        }}
      >
        <Toolbar>
          <Typography variant="h4" component="div" sx={{ 
            }}>
            Scrabble
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              ml:5
            }}
          >
            {friendsButton()}
            <Button color="inherit">
              Правила
            </Button>
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