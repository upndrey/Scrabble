import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber";
import React, { useEffect, useRef, FunctionComponent, useState } from "react";
import * as THREE from "three";
import { UserData } from "../../interfaces/UserData";
import Symbol from '../Symbol/Symbol'
import CellText from '../CellText/CellText'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import roboto from '../../fonts/roboto.json'
import Cell from "../Cell/Cell";
 


interface GameBgLayerProps {
  userData: UserData,
}

const GameBgLayer: FunctionComponent<GameBgLayerProps> = (props) => {
  const {userData} = props;
  const {login, game, lobby} = userData;
  const [attachedSymbol, attachSymbol] = useState<THREE.Mesh>(null!)

  const renderCells = () => {
    return game?.mapCells.map((row: any) => {
      return row.map((cellData: any) => {
        return (
          <Cell
            key={`${cellData.cell.row}${cellData.cell.col}`}
            positionX={-4.6 + cellData.cell.row / 2.5}
            positionY={-3.20 + cellData.cell.col / 2.5}
            attachedSymbol={attachedSymbol}
            color={cellData.modifier.color}
          />
        )
      })
    });
  }

  const renderHand = () => {
    const currentPlayer = lobby?.players.find((user) => {
      return user?.player.login === login
    })
    const handSymbols : any = currentPlayer?.hand;
    return [1, 2, 3, 4, 5, 6, 7].map((row: any, index) => {
      return (
        <CellText
          key={index}
          position={[1.9 + index / 2.5, -2, 1 ]}
          symbol={handSymbols[`slot${row}`]}
          game={game}
          attachSymbol={attachSymbol}
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