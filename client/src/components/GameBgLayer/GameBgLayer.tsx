import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber";
import React, { useEffect, useRef, FunctionComponent, useState } from "react";
import * as THREE from "three";
import { FieldCell, Player, UserData } from "../../interfaces/UserData";
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
  getUserData: Function,
  isYourTurn: boolean,
  fieldCells: FieldCell[][] | undefined,
  setFieldCells: Function,
  currentPlayer: Player | null | undefined,
  yourPlayer: Player | null | undefined,
  setCurrentPlayer: Function
}

const GameBgLayer: FunctionComponent<GameBgLayerProps> = (props) => {
  const {
    userData,
    onControlsEnterHandler,
    onControlsOutHandler,
    attachedSymbolMesh,
    attachSymbolMesh,
    getUserData,
    isYourTurn,
    fieldCells,
    setFieldCells,
    currentPlayer,
    yourPlayer,
    setCurrentPlayer
  } = props;
  const {login, game, lobby} = userData;
  const [attachedSymbolId, attachSymbolId] = useState<number>(null!)
  const [attachedMesh, attachMesh] = useState<THREE.Mesh>(null!)
  const [attachedPriceMesh, attachPriceMesh] = useState<THREE.Mesh>(null!)
  const [mouseMoveAllowed, setMouseMoveAllowed] = useState<boolean>(false)
  const [isCellSeted, setCell] = useState<boolean>(false)
  const [getFromSlotId, setGetFromSlotId] = useState<number>(null!)
  const [getFromCellId, setGetFromCellId] = useState<number>(null!)

  useEffect(() => {
    if(isCellSeted) {
      attachSymbolMesh(null!)
      attachMesh(null!)
      attachPriceMesh(null!)
      attachSymbolId(null!)
      if(setGetFromSlotId)
        setGetFromSlotId(null!)
      if(setGetFromCellId)
        setGetFromCellId(null!)
      // setPointerDown(false);
      setCell(false);
    }
  })

  const editFieldCells = (
    fromField_id: number | null, 
    toField_id: number | null, 
    fromSlot_id: number | null,
    toSlot_id: number | null
  ) => {
    let from = {
      row: -1,
      col: -1,
      slot: -1
    }
    let to = {
      row: -1,
      col: -1,
      slot: -1
    }
    if(!fieldCells || !currentPlayer)
      return;
    if(fromField_id || toField_id)
      for(let i = 0; i < fieldCells.length; i++) {
        for(let j = 0; j < fieldCells[0].length; j++) {
          if(fieldCells[i][j].id === fromField_id) {
            from = {
              row: i,
              col: j,
              slot: -1
            }
          }
          else if(fieldCells[i][j].id === toField_id) {
            to = {
              row: i,
              col: j,
              slot: -1
            }
          }
        }
      }

    if(fromSlot_id) {
      from = {
        row: -1,
        col: -1,
        slot: fromSlot_id
      }
    }
    if(toSlot_id)
      to = {
        row: -1,
        col: -1,
        slot: toSlot_id
      }
    
      

    const tempFieldCells : FieldCell[][] = JSON.parse(JSON.stringify(fieldCells));
    const tempPlayer : Player = JSON.parse(JSON.stringify(currentPlayer));
    console.log(from, to);
    if(from.row !== -1) {
      const savedCell: FieldCell = JSON.parse(JSON.stringify(tempFieldCells[from.row][from.col]));
      if(to.row !== -1) {
        tempFieldCells[from.row][from.col].symbol_id = tempFieldCells[to.row][to.col].symbol_id;
        tempFieldCells[to.row][to.col].symbol_id = savedCell.symbol_id;
      }
      else if(to.slot !== -1) {
        tempFieldCells[from.row][from.col].symbol_id = tempPlayer.hand['slot' + to.slot as keyof Player['hand']];
        tempPlayer.hand['slot' + to.slot as keyof Player['hand']] = savedCell.symbol_id;
      }
      else {
        tempFieldCells[from.row][from.col].symbol_id = null;
      }
    }
    else if(from.slot !== -1) {
      const savedSlot: number = JSON.parse(JSON.stringify(tempPlayer.hand['slot' + from.slot as keyof Player['hand']]));
      if(to.row !== -1) {
        tempPlayer.hand['slot' + from.slot as keyof Player['hand']] = tempFieldCells[to.row][to.col].symbol_id;
        tempFieldCells[to.row][to.col].symbol_id = savedSlot;
      }
      else if(to.slot !== -1) {
        tempPlayer.hand['slot' + from.slot as keyof Player['hand']] = tempPlayer.hand['slot' + to.slot as keyof Player['hand']];
        tempPlayer.hand['slot' + to.slot as keyof Player['hand']] = savedSlot;
      }
      else {
        tempPlayer.hand['slot' + from.slot as keyof Player['hand']] = null;
      }
    }
    console.log("temp", tempPlayer.hand);
    setFieldCells(tempFieldCells);
    setCurrentPlayer(tempPlayer);
  }

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
        if(fieldCells)
          return (
            <Cell
              key={`${cellData.cell.row}${cellData.cell.col}`}
              editFieldCells={editFieldCells}
              positionX={-4.6 + cellData.cell.row / 2.5}
              positionY={-3.20 + cellData.cell.col / 2.5}
              attachedMesh={attachedMesh}
              attachedSymbolMesh={attachedSymbolMesh}
              attachedPriceMesh={attachedPriceMesh}
              attachedSymbolId={attachedSymbolId}
              color={cellData.modifier.color}
              cellId={fieldCells[i][j].id}
              slotId={null}
              getFromCellId={getFromCellId}
              getFromSlotId={getFromSlotId}
              setGetFromCellId={setGetFromCellId}
              setGetFromSlotId={setGetFromSlotId}
              getUserData={getUserData}
              lobby={userData['lobby']}
              setCell={setCell}
            />
          )
      })
    });
  }

  const renderFieldSymbols = () => {
    return game?.mapCells.map((row: any, i: number) => {
      return row.map((cellData: any, j: number) => {
        if(fieldCells && fieldCells[i][j].symbol_id)
          return (
            <CellText
              key={`${cellData.cell.row}${cellData.cell.col}`}
              position={[-4.6 + cellData.cell.row / 2.5, -3.20 + cellData.cell.col / 2.5, 1]}
              symbol={fieldCells[i][j].symbol_id}
              game={game}
              cellId={fieldCells[i][j].id}
              slotId={null}
              attachedSymbolMesh={attachedSymbolMesh}
              attachSymbolMesh={attachSymbolMesh}
              attachMesh={attachMesh}
              attachPriceMesh={attachPriceMesh}
              attachSymbolId={attachSymbolId}
              setGetFromSlotId={null}
              setGetFromCellId={setGetFromCellId}
              attachedSymbolId={attachedSymbolId}
              isYourTurn={isYourTurn}
              setCell={setCell}
              isCellSeted={isCellSeted}
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
          editFieldCells={editFieldCells}
          positionX={1.9 + index / 2.5}
          positionY={-2}
          attachedMesh={attachedMesh}
          attachedSymbolMesh={attachedSymbolMesh}
          attachedPriceMesh={attachedPriceMesh}
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
          setCell={setCell}
        />
      )
    });
  }

  const renderHandCells = () => {
    let handSymbols: any = null;
    if(currentPlayer?.user_id === yourPlayer?.user_id)
      handSymbols = currentPlayer?.hand;
    else
      handSymbols = yourPlayer?.hand;
    console.log(handSymbols);
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
            isYourTurn={isYourTurn}
            setCell={setCell}
            isCellSeted={isCellSeted}
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
        position={[3.1, 1.12, .91]}
        onPointerEnter={(e) => {onControlsEnterHandler()}}
        onPointerOut={(e) => {onControlsOutHandler()}}
      >
        <boxGeometry args={[11.2, 15, .5]} />
        <meshStandardMaterial color={'#9260F0'} />
      </mesh>
      
      <GameBox
        attachedSymbolId={attachedSymbolId}
        lobby={lobby}
      ></GameBox>

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