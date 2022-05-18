import Login from '../Login/Login';
import React, { useEffect } from 'react';
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
axios.defaults.withCredentials = true;

function App() {
  const [isFriendsOpen, openFriends] = React.useState<boolean>(true);
  const [isLoginOpened, setLoginOpen] = React.useState<boolean>(false);
  const [isSignupOpened, setSignupOpen] = React.useState<boolean>(false);
  const [login, setLogin] = React.useState<string>("");
  const [appState, setAppState] = React.useState();
  
  // useEffect(() => {
  //   const apiUrl = 'http://localhost:3000/api/getUser';
  //   axios.post(apiUrl).then((response) => {
  //     if(response.status === 200) {
  //       const json = response.data;
  //       setLogin(json.login);
  //     } 
  //     else if(response.status === 422) {
  //       // TODO     
  //     }
  //     else if(response.status === 400) {
  //       // TODO
  //     } 
  //   });  
  // }, [setAppState]);
  useEffect(() => {
    const apiUrl = 'http://localhost:3000/api/getUser';
    axios.post(apiUrl).then((response) => {
      if(response.status === 200) {
        const json = response.data;
        setLogin(json.login);
      }
      else if(response.status === 422) {
        // TODO
      }
      else if(response.status === 400) {
        // TODO
      }
    });
  }, []);

  // useEffect(() => {
  //   (async ()=> {
  //     const response = await fetch('http://localhost:3000/api/getUser', { 
  //       method: 'POST',
  //       credentials: 'same-origin',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       }
  //     });
  //     if(response.status === 200) {
  //       const json = await response.json();
  //       setLogin(json.login);
  //     }
  //     else if(response.status === 422) {
  //       // TODO
  //     }
  //     else if(response.status === 400) {
  //       // TODO
  //     }
  //   })();
  // }, []);
  

  return (
    <div className="App">
      <StartGameButton></StartGameButton>
      <Menu 
        setLoginOpen={setLoginOpen} 
        openFriends={openFriends} 
        isFriendsOpen={isFriendsOpen}
        setSignupOpen={setSignupOpen}
        login={login}
        setLogin={setLogin}
      ></Menu>
      <Login 
        isLoginOpened={isLoginOpened} 
        setLoginOpen={setLoginOpen}
        setLogin={setLogin}
      ></Login>
      <Signup 
        isSignupOpened={isSignupOpened} 
        setSignupOpen={setSignupOpen}
        setLogin={setLogin}
      ></Signup>
      <FriendsList isFriendsOpen={isFriendsOpen}></FriendsList>
      <Routes>
        <Route path='/lobby' element={<CreateLobby />} />
        <Route path='/lobbyList' element={<LobbyList />} />
        <Route path="/" element={""} >
        </Route>
      </Routes>
    </div>
  );
}

export default App;
