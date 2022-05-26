import { Mail, Notifications } from "@mui/icons-material";
import { Avatar, Badge, Button, IconButton, MenuItem } from "@mui/material";
import MenuUI from '@mui/material/Menu';
import { Dispatch, Fragment, FunctionComponent, SetStateAction, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { socket } from "../../features/socket";

interface UserMenuProps {
  login: string
  anchorEl: HTMLElement | null
  setAnchorEl: Dispatch<SetStateAction<HTMLElement | null>>
  setLogin: Function
}
 
const UserMenu: FunctionComponent<UserMenuProps> = (props) => {
  const {login, anchorEl, setAnchorEl, setLogin} = props;
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Array<any>>([]);
  const [anchorNotifEl, setAnchorNotifEl] = useState<null | HTMLElement>(null);
  
  useEffect(() => {
    socket.on('sendFriendInvite', (login: string) => {
      let tempArray = notifications;
      tempArray.push({
        event: 'friendInvite',
        from: login
      });
      setNotifications(tempArray);
    })
  }, [])

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorNotifEl(event.currentTarget);
  };

  const isNotificationsOpen = Boolean(anchorNotifEl);
  const handleNotificationsClose = () => {
    setAnchorNotifEl(null);
  };

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
      <MenuItem>
        <a 
          style={{
            textDecoration: 'none',
            color: 'inherit'
          }}
          href="http://localhost:3000/api/logout"
        >
            Выход
        </a>
      </MenuItem>
    </MenuUI>
  );

  const renderNotifList = (arr: Array<any>) => {
    if(!arr.length)
      return (
        <MenuItem>
          Уведомлений нет
        </MenuItem>
      )
    return arr.map((row, i) => {
      if(row.event === "friendInvite")
        return (
          <MenuItem
            key={i}
          >
            Пользователь {row.login} приглашает вас в друзья
            <Button 
              variant="contained"
            >
              Принять
            </Button>
          </MenuItem>
        )
      else if(row.event === "gameInvite")
        return (
          <MenuItem
            key={i}
          >
            Пользователь {row.login} приглашает вас в игру
            <Button 
              variant="contained"
            >
              Принять
            </Button>
          </MenuItem>
        )
    })
  }

  const renderNotifications = (
    <MenuUI
      anchorEl={anchorNotifEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isNotificationsOpen}
      onClose={handleNotificationsClose}
    >
      {renderNotifList(notifications)}
    </MenuUI>
  );


  return (
    <Fragment>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={4} color="error">
            <Mail />
          </Badge>
        </IconButton>
        <IconButton
          size="large"
          color="inherit"
          onClick={handleNotificationsOpen}
        >
          <Badge badgeContent={notifications.length} color="error">
            <Notifications/>
          </Badge>
        </IconButton>
        <Button color="inherit" onClick={handleProfileMenuOpen}>
          <Avatar sx={{mr:1}}>
            {login[0].toLocaleUpperCase()}
          </Avatar>
          {login}
        </Button>
        {renderProfileMenu}
        {renderNotifications}
    </Fragment>
  );
}
 
export default UserMenu;