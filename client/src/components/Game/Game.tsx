import { Box } from "@mui/material";
import { Canvas } from "@react-three/fiber";
import { FunctionComponent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../../interfaces/UserData";
import Controls from "../Controls/Controls";
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
    <>
      <Box
        width={1225}
        height={825} 
        sx={{
          position:"absolute",
          top:"80px",
        }}
      >
        <Canvas
          onCreated={({camera}) => {
          }}
        >
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <mesh
            scale={.25}
            position={[3.1, 1.12, .91]}
          >
            <boxGeometry args={[11.2, 15, .5]} />
            <meshStandardMaterial color='#9260F0' />
          </mesh>
        </Canvas>
        <Controls
          width="372px"
          height="499px"
          position={["839px", "12px"]}
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
        />
      </Box> 
    </>
  );
}
 
export default Game;