import { Box } from "@mui/material";
import { FunctionComponent } from "react";
import GameBgLayer from "../GameBgLayer/GameBgLayer";

interface GameProps {
  
}
 
const Game: FunctionComponent<GameProps> = () => {
  return ( 
    <Box
      width={1200}
      height={800} 
      sx={{
        position:"absolute",
        top:"80px",
        border: "1px solid black"
      }}
    >
      <GameBgLayer></GameBgLayer>
    </Box> 
  );
}
 
export default Game;