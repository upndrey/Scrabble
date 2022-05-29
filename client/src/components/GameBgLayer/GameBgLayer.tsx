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
import GameBox from "../GameBox/GameBox";
 


interface GameBgLayerProps {
  userData: UserData,
  onControlsEnterHandler: Function,
  onControlsOutHandler: Function,
  attachedSymbolMesh: THREE.Mesh,
  attachSymbolMesh: Function,
  getUserData: Function
}

const GameBgLayer: FunctionComponent<GameBgLayerProps> = (props) => {
  const {
    userData,
    onControlsEnterHandler,
    onControlsOutHandler,
    attachedSymbolMesh,
    attachSymbolMesh,
    getUserData
  } = props;
  const {login, game, lobby} = userData;
  const [attachedSymbolId, attachSymbolId] = useState<number>(null!)
  const [attachedMesh, attachMesh] = useState<THREE.Mesh>(null!)
  const [attachedPriceMesh, attachPriceMesh] = useState<THREE.Mesh>(null!)
  const [mouseMoveAllowed, setMouseMoveAllowed] = useState<boolean>(false)
  const [getFromSlotId, setGetFromSlotId] = useState<number>(null!)
  const [getFromCellId, setGetFromCellId] = useState<number>(null!)

  const onMouseMove = (e: ThreeEvent<PointerEvent>) => {
    if(attachedMesh && attachedSymbolMesh && attachedPriceMesh) {
      attachedMesh.position.x = e.point.x;
      attachedMesh.position.y = e.point.y;
      attachedSymbolMesh.position.x = e.point.x - .17;
      attachedSymbolMesh.position.y = e.point.y - .05;
      attachedPriceMesh.position.x = e.point.x + .07;
      attachedPriceMesh.position.y = e.point.y - .14;
    }
  }

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
            setGetFromSlotId={setGetFromSlotId}
            setGetFromCellId={setGetFromCellId}
            getUserData={getUserData}
            lobby={userData['lobby']}
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
              attachedSymbolMesh={attachedSymbolMesh}
              attachSymbolMesh={attachSymbolMesh}
              attachMesh={attachMesh}
              attachPriceMesh={attachPriceMesh}
              attachSymbolId={attachSymbolId}
              setGetFromSlotId={null}
              setGetFromCellId={setGetFromCellId}
              attachedSymbolId={attachedSymbolId}
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
          setGetFromSlotId={setGetFromSlotId}
          setGetFromCellId={setGetFromCellId}
          getUserData={getUserData}
          lobby={userData['lobby']}
        />
      )
    });
  }

  const renderHandCells = () => {
    const currentPlayer = lobby?.players.find((user) => {
      return user?.player.login === login
    })
    const handSymbols : any = currentPlayer?.hand;
    console.log(handSymbols)
    return [1, 2, 3, 4, 5, 6, 7].map((row: any, index) => {
      if(handSymbols && handSymbols[`slot${row}`])
        return (
          <CellText
            key={index}
            position={[1.9 + index / 2.5, -2, 1 ]}
            symbol={handSymbols[`slot${row}`]}
            game={game}
            cellId={null}
            slotId={row}
            attachedSymbolMesh={attachedSymbolMesh}
            attachSymbolMesh={attachSymbolMesh}
            attachMesh={attachMesh}
            attachPriceMesh={attachPriceMesh}
            attachSymbolId={attachSymbolId}
            setGetFromSlotId={setGetFromSlotId}
            setGetFromCellId={null}
            attachedSymbolId={attachedSymbolId}
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
        scale={1}
        onPointerMove={mouseMoveAllowed ? onMouseMove : () => {}}
        onPointerDown={() => {setMouseMoveAllowed(true)}}
        onPointerUp={() => {setMouseMoveAllowed(false)}}
      >
        <boxGeometry args={[100, 100, 1.9]} />
        <meshPhongMaterial color="#fff" opacity={0} transparent />
      </mesh>
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
        position={[3.1, -1.25, .91]}
      >
        <boxGeometry args={[11.2, 3.7, .5]} />
        <meshStandardMaterial color='#9260F0' />
      </mesh>
      <mesh
        scale={.25}
        position={[3.1, 1.12, .91]}
        onPointerEnter={(e) => {onControlsEnterHandler()}}
        onPointerOut={(e) => {onControlsOutHandler()}}
      >
        <boxGeometry args={[11.2, 15, .5]} />
        <meshStandardMaterial color={'#9260F0'} />
      </mesh>
      
      <GameBox></GameBox>

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