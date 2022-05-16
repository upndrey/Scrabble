import React from 'react';
import FriendsList from '../FriendsList/FriendsList';
import Game from '../Game/Game';
import Menu from '../Menu/Menu';
import StartGameButton from '../StartGameButton/StartGameButton';


function App() {
  const [isFriendsOpen, openFriends] = React.useState<boolean>(true);
  return (
    <div className="App">
      <Game></Game>
      <StartGameButton></StartGameButton>
      <Menu openFriends={openFriends} isFriendsOpen={isFriendsOpen}></Menu>
      <FriendsList isFriendsOpen={isFriendsOpen}></FriendsList>
    </div>
  );
}

export default App;
