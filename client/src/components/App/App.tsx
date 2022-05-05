import React from 'react';
import FriendsList from '../FriendsList/FriendsList';
import Menu from '../Menu/Menu';
import StartGameButton from '../StartGameButton/StartGameButton';


function App() {
  return (
    <div className="App">
      <Menu></Menu>
      <FriendsList></FriendsList>
      <StartGameButton></StartGameButton>
    </div>
  );
}

export default App;
