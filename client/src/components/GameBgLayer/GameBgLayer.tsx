import { Canvas, useFrame } from "@react-three/fiber";
import React, { useEffect, useRef, FunctionComponent, useState } from "react";
import * as THREE from "three";

interface GameBgLayerProps {
  
}
 
const GameBgLayer: FunctionComponent<GameBgLayerProps> = () => {
 useEffect(() => {
   
 }, []);
 
  return (
    <Canvas
    onCreated={({camera}) => {
    }}
    >
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <mesh
        scale={1}
        position={[0, 0, 0]}
      >
        <boxGeometry args={[11, 7, .25]}/>
        <meshStandardMaterial color={'black'} />
      </mesh>
    </Canvas>
  );
}
 
export default GameBgLayer;