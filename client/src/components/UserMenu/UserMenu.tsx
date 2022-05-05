import { Mail, Notifications } from "@mui/icons-material";
import { Avatar, Badge, Button, IconButton, MenuItem } from "@mui/material";
import MenuUI from '@mui/material/Menu';
import { Dispatch, Fragment, FunctionComponent, SetStateAction } from "react";

interface UserMenuProps {
  login: string
  anchorEl: HTMLElement | null
  setAnchorEl: Dispatch<SetStateAction<HTMLElement | null>>
  setLogin: Dispatch<SetStateAction<string | null>>
}
 
const UserMenu: FunctionComponent<UserMenuProps> = (props) => {
  const {login, anchorEl, setAnchorEl, setLogin} = props;

  const handleLogout = () => {
    setLogin(null);
    handleMenuClose();
  }

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };


  const isMenuOpen = Boolean(anchorEl);
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = 'primary-search-account-menu';
  const renderProfileMenu = (
    <MenuUI
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Профиль</MenuItem>
      <MenuItem onClick={handleMenuClose}>Настройки</MenuItem>
      <MenuItem onClick={handleLogout}>Выход</MenuItem>
    </MenuUI>
  );


  return (
    <Fragment>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <Mail />
          </Badge>
        </IconButton>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <Notifications />
          </Badge>
        </IconButton>
        <Button color="inherit" onClick={handleProfileMenuOpen}>
          <Avatar sx={{mr:1}}>
            {login[0].toLocaleUpperCase()}
          </Avatar>
          {login}
        </Button>
        {renderProfileMenu}
    </Fragment>
  );
}
 
export default UserMenu;