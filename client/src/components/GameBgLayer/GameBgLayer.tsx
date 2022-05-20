import { Canvas, useFrame } from "@react-three/fiber";
import React, { useEffect, useRef, FunctionComponent, useState } from "react";
import * as THREE from "three";

interface GameBgLayerProps {
  mapCells: any
}
 
interface CellProps {
  cell: any
}

const Cell: FunctionComponent<CellProps> = (props) => {
  const {cell} = props;
  const mesh = useRef<THREE.Mesh>(null!)
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  return (
    <mesh
      scale={.25}
      position={
        !active ? 
        [-3.20 + cell.row / 2.5, -3.20 + cell.col / 2.5, 1]:
        [-3.20 + cell.row / 2.5, -3.20 + cell.col / 2.5, .95]
      }
      ref={mesh}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}>
      <boxGeometry args={[1.35, 1.35, .25]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

const GameBgLayer: FunctionComponent<GameBgLayerProps> = (props) => {
  const {mapCells} = props;
  useEffect(() => {
    
  }, []);

  const renderCells = () => {
    return mapCells.map((row: any) => {
      return row.map((cell: any) => {
        return (
          <Cell
            key={`${cell.row}${cell.col}`}
            cell={cell}
          />
        )
      })
    });
  }
 
  return (
    <Canvas
    onCreated={({camera}) => {
    }}
    >
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {renderCells()}
    </Canvas>
  );
}
 
export default GameBgLayer;