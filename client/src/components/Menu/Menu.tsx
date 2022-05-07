import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import UserMenu from '../UserMenu/UserMenu';

export default function Menu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [login, setLogin] = React.useState<null | string>(null);

  const handleLogin = () => {
    setLogin('username');
  };

  

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

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar 
        position="static"
        sx={{
        }}
      >
        <Toolbar>
          <Typography variant="h4" component="div" sx={{ 
            flexGrow: 1,
            }}>
            Scrabble
          </Typography>
          <Button color="inherit">Правила</Button>
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