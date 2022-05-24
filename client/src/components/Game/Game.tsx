import { Box } from "@mui/material";
import { Canvas, ThreeEvent } from "@react-three/fiber";
import { FunctionComponent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../../interfaces/UserData";
import Controls from "../Controls/Controls";
import GameBgLayer from "../GameBgLayer/GameBgLayer";

interface GameProps {
  userData: UserData,
  getUserData: Function
}
 
const Game: FunctionComponent<GameProps> = (props) => {
  const {userData, getUserData} = props;
  const {game, lobby, login} = userData;
  const [controlsZIndex, setControlsZIndex] = useState<number>(1000)
  const [attachedSymbolMesh, attachSymbolMesh] = useState<THREE.Mesh>(null!)
  const navigate = useNavigate();
  useEffect(() => {
    if(!game)
      navigate('/'); 
  });
  const onControlsEnterHandler = () => {
    if(attachedSymbolMesh)
      setControlsZIndex(0);
    else
      setControlsZIndex(1000);
  }
  const onControlsOutHandler = () => {
    setControlsZIndex(1000);
  }
  const findSlotByTurn = (turn: number, playersCount: number) => {
    let slot = 1;
    switch(turn % playersCount) {
      case 0:
        slot = 1;
        break;
      case 1:
        slot = 2;
        break;
      case 2:
        slot = 3;
        break;
      case 3:
        slot = 4;
        break;
    }
    return slot;
  }
  const isYourTurn = () => {
    const currentPlayer = lobby?.players.find((player) => {
      if(game && player)
        return player.slot === findSlotByTurn(game?.gameInfo.turn, lobby.max_players)
    })
    return login === currentPlayer?.player.login
  }
  const currentPlayerName = () => {
    const currentPlayer = lobby?.players.find((player) => {
      if(game && player)
        return player.slot === findSlotByTurn(game?.gameInfo.turn, lobby.max_players)
    })
    return currentPlayer?.player.login
  }
  return (
    <>
      <Box
        width={1225}
        height={825} 
        sx={{
          position:"absolute",
          top:"80px",
        }}
      >
        <Controls
          width="374px"
          height="500px"
          position={["839px", "12px"]}
          zIndex={controlsZIndex}
          onControlsEnterHandler={onControlsEnterHandler}
          onControlsOutHandler={onControlsOutHandler}
          lobby={userData['lobby']}
          game={userData['game']}
          isYourTurn={isYourTurn()}
          currentPlayerName={currentPlayerName()}
          getUserData={getUserData}
        ></Controls>
      </Box>
      <Box
        width={1225}
        height={825} 
        sx={{
          position:"absolute",
          top:"80px",
        }}
      >
        <GameBgLayer 
          userData={userData}
          onControlsEnterHandler={onControlsEnterHandler}
          onControlsOutHandler={onControlsOutHandler}
          attachedSymbolMesh={attachedSymbolMesh}
          attachSymbolMesh={attachSymbolMesh}
          getUserData={getUserData}
        />
      </Box> 
    </>
  );
}
 
export default Game;