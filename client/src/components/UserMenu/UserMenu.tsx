import { Mail, Notifications } from "@mui/icons-material";
import { Avatar, Badge, Button, IconButton, MenuItem } from "@mui/material";
import MenuUI from '@mui/material/Menu';
import axios from "axios";
import { Dispatch, Fragment, FunctionComponent, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../../features/socket";
import { Link } from '@mui/material';
import { SERVER_IP } from '../../features/server';

interface UserMenuProps {
  login: string
  anchorEl: HTMLElement | null
  setAnchorEl: Dispatch<SetStateAction<HTMLElement | null>>
  setLogin: Function,
}
 
const UserMenu: FunctionComponent<UserMenuProps> = (props) => {
  const {login, anchorEl, setAnchorEl, setLogin} = props;
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Array<any>>([]);
  const [anchorNotifEl, setAnchorNotifEl] = useState<null | HTMLElement>(null);
  
  useEffect(() => {
    socket.on('friendInvite', (login: string) => {
      console.log('friendInvite')
      let tempArray =  JSON.parse(JSON.stringify(notifications));
      tempArray.push({
        event: 'friendInvite',
        from: login
      });
      setNotifications(tempArray);
      console.log(notifications);
    })
    socket.on('inviteInLobby', (invite_id: string) => {
      console.log('inviteInLobby')
      let tempArray =  JSON.parse(JSON.stringify(notifications));
      tempArray.push({
        event: 'inviteInLobby',
        invite_id: invite_id
      });
      setNotifications(tempArray);
      console.log(notifications);
    })
  }, [])

  const addFriend = (name: string, index: number) => {
    const apiUrl = SERVER_IP + '/api/friends/addFriend';
    console.log(login);
    axios.post(apiUrl,{
      login: login,
      friend: name
    }).then(async (response) => {
      if(response.status === 200) {
        socket.emit('friendAdded', login, name)
        let tempArray =  JSON.parse(JSON.stringify(notifications));
        tempArray.splice(index, 1);
        setNotifications(tempArray);
        handleNotificationsClose();
      }
      else if(response.status === 422) {
        // TODO
      }
      else if(response.status === 400) {
        // TODO
      }
    });
  }

  const enterGame = (index: number) => {
    let tempArray =  JSON.parse(JSON.stringify(notifications));
    tempArray.splice(index, 1);
    setNotifications(tempArray);
    handleNotificationsClose();
  }

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
          href={SERVER_IP+ "/api/user/logout"}
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
            Пользователь {row.from} приглашает вас в друзья
            <Button 
              variant="contained"
              sx={{
                ml:1
              }}
              onClick={addFriend.bind(this, row.from, i)}
            >
              Принять
            </Button>
          </MenuItem> 
        )
      else if(row.event === "inviteInLobby")
        return (
          <MenuItem
            key={i}
          >
            Пользователь {row.from} приглашает вас в игру
            <Link
              href={SERVER_IP + "/api/lobby/inviteLink/" + row.invite_id}
              underline="none"
              color="inherit"
            >
              <Button 
                sx={{
                  ml:1
                }}
                onClick={enterGame.bind(this, i)}
                variant="contained"
              >
                Принять
              </Button>
              </Link>
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