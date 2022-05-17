import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CreateLobby from '../CreateLobby/CreateLobby';
import FriendsList from '../FriendsList/FriendsList';
import Game from '../Game/Game';
import Lobby from '../Lobby/Lobby';
import LobbyList from '../LobbyList/LobbyList';
import Menu from '../Menu/Menu';
import StartGameButton from '../StartGameButton/StartGameButton';


function App() {
  const [isFriendsOpen, openFriends] = React.useState<boolean>(true);
  return (
    <div className="App">
      <StartGameButton></StartGameButton>
      <Menu openFriends={openFriends} isFriendsOpen={isFriendsOpen}></Menu>
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
