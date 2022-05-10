import React from 'react';
import FriendsList from '../FriendsList/FriendsList';
import Menu from '../Menu/Menu';
import StartGameButton from '../StartGameButton/StartGameButton';


function App() {
  const [isFriendsOpen, openFriends] = React.useState<boolean>(true);
  return (
    <div className="App">
      <Menu openFriends={openFriends} isFriendsOpen={isFriendsOpen}></Menu>
      <FriendsList isFriendsOpen={isFriendsOpen}></FriendsList>
      <StartGameButton></StartGameButton>
    </div>
  );
}

export default App;
