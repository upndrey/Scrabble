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
  const [attachedSymbolMesh, attachSymbolMesh] = useState<THREE.Mesh>(null!)
  const [attachedSymbolId, attachSymbolId] = useState<number>(null!)
  const [getFromSlotId, setGetFromSlotId] = useState<number>(null!)
  const [getFromCellId, setGetFromCellId] = useState<number>(null!)

  const renderFieldCells = () => {
    return game?.mapCells.map((row: any, i:number) => {
      return row.map((cellData: any, j:number) => {
        return (
          <Cell
            key={`${cellData.cell.row}${cellData.cell.col}`}
            positionX={-4.6 + cellData.cell.row / 2.5}
            positionY={-3.20 + cellData.cell.col / 2.5}
            attachedSymbolMesh={attachedSymbolMesh}
            attachedSymbolId={attachedSymbolId}
            color={cellData.modifier.color}
            cellId={game?.fieldCells[i][j].id}
            slotId={null}
            getFromCellId={getFromCellId}
            getFromSlotId={getFromSlotId}
          />
        )
      })
    });
  }

  const renderFieldSymbols = () => {
    return game?.mapCells.map((row: any, i: number) => {
      return row.map((cellData: any, j: number) => {
        if(game?.fieldCells[i][j].symbol_id)
          return (
            <CellText
              key={`${cellData.cell.row}${cellData.cell.col}`}
              position={[-4.6 + cellData.cell.row / 2.5, -3.20 + cellData.cell.col / 2.5, 1]}
              symbol={game?.fieldCells[i][j].symbol_id}
              game={game}
              cellId={game?.fieldCells[i][j].id}
              slotId={null}
              attachSymbolMesh={attachSymbolMesh}
              attachSymbolId={attachSymbolId}
              setGetFromSlotId={null}
              setGetFromCellId={setGetFromCellId}
            />
          )
        else {
          return "";
        }
      })
    });
  }

  const renderHandSymbols = () => {
    return [1, 2, 3, 4, 5, 6, 7].map((row: any, index) => {
      return (
        <Cell
          key={index}
          positionX={1.9 + index / 2.5}
          positionY={-2}
          attachedSymbolMesh={attachedSymbolMesh}
          attachedSymbolId={attachedSymbolId}
          color='#442D70'
          cellId={null}
          slotId={row}
          getFromCellId={getFromCellId}
          getFromSlotId={getFromSlotId}
        />
      )
    });
  }

  const renderHandCells = () => {
    const currentPlayer = lobby?.players.find((user) => {
      return user?.player.login === login
    })
    const handSymbols : any = currentPlayer?.hand;
    return [1, 2, 3, 4, 5, 6, 7].map((row: any, index) => {
      if(handSymbols[`slot${row}`])
        return (
          <CellText
            key={index}
            position={[1.9 + index / 2.5, -2, 1 ]}
            symbol={handSymbols[`slot${row}`]}
            game={game}
            cellId={null}
            slotId={row}
            attachSymbolMesh={attachSymbolMesh}
            attachSymbolId={attachSymbolId}
            setGetFromSlotId={setGetFromSlotId}
            setGetFromCellId={null}
          />
        )
      else {
        return ""
      }
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
      {renderFieldCells()}
      {renderFieldSymbols()}
      <mesh
        scale={.25}
        position={[3.1, -2, .91]}
      >
        <boxGeometry args={[11.2, 2, .5]} />
        <meshStandardMaterial color='#9260F0' />
      </mesh>
      {renderHandCells()}
      {renderHandSymbols()}

    </Canvas>
  );
}
 
export default GameBgLayer;