import { Box } from "@mui/material";
import { FunctionComponent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../../interfaces/UserData";
import GameBgLayer from "../GameBgLayer/GameBgLayer";

interface GameProps {
  userData: UserData
}
 
const Game: FunctionComponent<GameProps> = (props) => {
  const {userData} = props;
  const {game} = userData;
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
      <GameBgLayer 
        userData={userData}
      />
    </Box> 
  );
}
 
export default Game;