import Login from '../Login/Login';
import React, { useEffect, useRef } from 'react';
import { Route, Routes } from 'react-router-dom';
import CreateLobby from '../CreateLobby/CreateLobby';
import FriendsList from '../FriendsList/FriendsList';
import Game from '../Game/Game';
import Lobby from '../Lobby/Lobby';
import LobbyList from '../LobbyList/LobbyList';
import Menu from '../Menu/Menu';
import StartGameButton from '../StartGameButton/StartGameButton';
import Signup from '../Signup/Signup';
import axios from 'axios';
import { UserData } from '../../interfaces/UserData';
import { devData } from '../../features/devData';
import {socket} from '../../features/socket';
import { SERVER_IP } from '../../features/server';
axios.defaults.withCredentials = true;



function App() {
  const [isFriendsOpen, openFriends] = React.useState<boolean>(false);
  const [isLoginOpened, setLoginOpen] = React.useState<boolean>(false);
  const [isSignupOpened, setSignupOpen] = React.useState<boolean>(false);
  const [login, setLogin] = React.useState<string>("");
  const [lobby, setLobby] = React.useState<UserData['lobby']>(null);
  const [game, setGame] = React.useState<UserData['game']>(null);
  const [inviteId, setInviteId] = React.useState<string>("");

  const getUserData = async () => {
    // devCode
    console.log(devData);
    setLogin(devData.login);
    setLobby(devData.lobby);
    setGame(devData.game); 
    if(devData.login !== login) {
      socket.emit('login', devData.login, socket.id)
    }
    // await axios.post(SERVER_IP + '/api/getUserData', {withCredentials: true}).then((response) => {
    //   if(response.status === 200) {
    //     const json : UserData = response.data;
    //     console.log(json);
    //     if(json.login !== login) {
    //       socket.emit('login', json.login, socket.id)
    //     }
    //     setLogin(json.login);
    //     setLobby(json.lobby);
    //     setGame(json.game);
    //   }
    //   else if(response.status === 422) {
    //     // TODO
    //   }
    //   else if(response.status === 400) {
    //     // TODO
    //   }
    // });
  }
  
  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className="App">
      {!lobby && login ? <StartGameButton></StartGameButton> : ""}
      <Menu 
        setLoginOpen={setLoginOpen}
        openFriends={openFriends}
        isFriendsOpen={isFriendsOpen}
        setSignupOpen={setSignupOpen}
        login={login}
        setLogin={setLogin}
        hasLobby={lobby ? true : false}
        hasGame={game ? true : false}
      ></Menu>
      <Login 
        isLoginOpened={isLoginOpened} 
        setLoginOpen={setLoginOpen}
        getUserData={getUserData}
      ></Login>
      <Signup 
        isSignupOpened={isSignupOpened} 
        setSignupOpen={setSignupOpen}
        getUserData={getUserData}
      ></Signup>
      {
        login ? 
        <FriendsList 
          isFriendsOpen={isFriendsOpen}
          login={login}
          lobby={lobby}
        ></FriendsList> : 
        ""
      }
      <Routes>
        <Route 
          path='/createLobby' 
          element={
            login !== "" ? 
            <CreateLobby 
              setInviteId={setInviteId}
              getUserData={getUserData}
            /> : 
            ""
          } />
        <Route 
          path='/lobbyList' 
          element={
            login !== "" ? 
            <LobbyList /> : 
            ""
          } />
        <Route 
          path='/lobby' 
          element={
            login !== "" && lobby ? 
            <Lobby 
              login={login} 
              lobby={lobby} 
              getUserData={getUserData}
              hasGame={game ? true : false} 
            /> : 
            ""
          } />
        <Route 
          path="/game" 
          element={
            game ?
            <Game 
              userData={{game, lobby, login}}
              getUserData={getUserData}
            /> :
            ""
          } />
        <Route 
          path="/" 
          element={""} 
        />
      </Routes>
    </div>
  );
}

export default App;
