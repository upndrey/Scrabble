import Login from '../Login/Login';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CreateLobby from '../CreateLobby/CreateLobby';
import FriendsList from '../FriendsList/FriendsList';
import Game from '../Game/Game';
import Lobby from '../Lobby/Lobby';
import LobbyList from '../LobbyList/LobbyList';
import Menu from '../Menu/Menu';
import StartGameButton from '../StartGameButton/StartGameButton';
import Signup from '../Signup/Signup';


function App() {
  const [isFriendsOpen, openFriends] = React.useState<boolean>(true);
  const [isLoginOpened, setLoginOpen] = React.useState<boolean>(false);
  const [isSignupOpened, setSignupOpen] = React.useState<boolean>(false);
  return (
    <div className="App">
      <StartGameButton></StartGameButton>
      <Menu 
        setLoginOpen={setLoginOpen} 
        openFriends={openFriends} 
        isFriendsOpen={isFriendsOpen}
        setSignupOpen={setSignupOpen}
      ></Menu>
      <Login 
        isLoginOpened={isLoginOpened} 
        setLoginOpen={setLoginOpen}
      ></Login>
      <Signup 
        isSignupOpened={isSignupOpened} 
        setSignupOpen={setSignupOpen}
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
