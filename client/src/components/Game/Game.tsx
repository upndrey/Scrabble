import { Box } from "@mui/material";
import { FunctionComponent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../../interfaces/UserData";
import GameBgLayer from "../GameBgLayer/GameBgLayer";

interface GameProps {
  game: UserData['game']
}
 
const Game: FunctionComponent<GameProps> = (props) => {
  const {game} = props;
  const navigate = useNavigate();
  useEffect(() => {
    if(!game)
      navigate('/');
  });
    return ( 
      <Box
        width={1225}
        height={825} 
        sx={{
          position:"absolute",
          top:"80px",
        }}
      >
        <GameBgLayer mapCells={game?.mapCells}></GameBgLayer>
      </Box> 
    );
}
 
export default Game;