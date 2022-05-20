import { Canvas, useFrame } from "@react-three/fiber";
import React, { useEffect, useRef, FunctionComponent, useState } from "react";
import * as THREE from "three";

interface GameBgLayerProps {
  mapCells: any
}
 
interface CellProps {
  cellData: any
}

const Cell: FunctionComponent<CellProps> = (props) => {
  const {cellData} = props;
  const mesh = useRef<THREE.Mesh>(null!)
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  useEffect(() => {
    if(cellData.modifier.color === 'lightblue')
      cellData.modifier.color = '#42AAFF';
  })
  return (
    <mesh
      scale={.25}
      position={
        !active ? 
        [-4.6 + cellData.cell.row / 2.5, -3.20 + cellData.cell.col / 2.5, 1]:
        [-4.6 + cellData.cell.row / 2.5, -3.20 + cellData.cell.col / 2.5, .95]
      }
      ref={mesh}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}>
      <boxGeometry args={[1.35, 1.35, .25]} />
      <meshStandardMaterial 
        color={hovered || active ? '#442D70' : cellData.modifier.color} 
      />
    </mesh>
  )
}
 
interface HandProps {
  index: number
}

const Hand: FunctionComponent<HandProps> = (props) => {
  const {index} = props;
  const mesh = useRef<THREE.Mesh>(null!)
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  return (
    <mesh
      scale={.25}
      position={
        !active ? 
        [1.9 + index / 2.5, -2, 1]:
        [1.9 + index / 2.5, -2, .95]
      }
      ref={mesh}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}>
      <boxGeometry args={[1.35, 1.35, .25]} />
      <meshStandardMaterial color={hovered || active ? '#442D70' : '#6441A4'} />
    </mesh>
  )
}

const GameBgLayer: FunctionComponent<GameBgLayerProps> = (props) => {
  const {mapCells} = props;
  useEffect(() => {
    
  }, []);

  const renderCells = () => {
    return mapCells.map((row: any) => {
      return row.map((cellData: any) => {
        return (
          <Cell
            key={`${cellData.cell.row}${cellData.cell.col}`}
            cellData={cellData}
          />
        )
      })
    });
  }

  const renderHand = () => {
    return [1, 2, 3, 4, 5, 6, 7].map((row: any, index) => {
      return (
        <Hand
          key={index}
          index={index}
        />
      )
    });
  }
 
  return (
    <Canvas
    onCreated={({camera}) => {
    }}
    >
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <mesh
        scale={.25}
        position={[-1.4, -.0, .85]}
      >
        <boxGeometry args={[24, 24, 1]} />
        <meshStandardMaterial color='#9260F0' />
      </mesh>
      {renderCells()}
      <mesh
        scale={.25}
        position={[3.1, -2, .91]}
      >
        <boxGeometry args={[11.2, 2, .5]} />
        <meshStandardMaterial color='#9260F0' />
      </mesh>
      {renderHand()}
    </Canvas>
  );
}
 
export default GameBgLayer;