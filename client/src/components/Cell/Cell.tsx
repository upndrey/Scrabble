import { ThreeEvent, Vector3 } from "@react-three/fiber";
import axios from "axios";
import React, { useEffect, useRef, FunctionComponent, useState } from "react";
import { socket } from "../../features/socket";
import { UserData } from "../../interfaces/UserData";
import { SERVER_IP } from '../../features/server';

interface CellProps {
  attachedMesh: THREE.Mesh,
  attachedSymbolMesh: THREE.Mesh,
  attachedPriceMesh: THREE.Mesh,
  attachedSymbolId: number,
  positionX: number,
  positionY: number,
  color: string,
  cellId: number | null,
  slotId: number | null,
  getFromSlotId: number | null,
  getFromCellId: number | null,
  getUserData: Function,
  lobby: UserData['lobby'],
  setGetFromSlotId: Function,
  setGetFromCellId: Function,
  setCell: Function,
  editFieldCells: Function
}

const Cell: FunctionComponent<CellProps> = (props) => {
  const {
    color, 
    attachedMesh, 
    attachedSymbolMesh,
    attachedPriceMesh,
    attachedSymbolId, 
    positionX, 
    positionY, 
    cellId, 
    slotId,
    getFromSlotId,
    getFromCellId,
    getUserData,
    lobby,
    setGetFromSlotId,
    setGetFromCellId,
    setCell,
    editFieldCells
  } = props;
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  const handlePointerUp = async (e: ThreeEvent<PointerEvent>) => {
    if(!attachedSymbolId) 
      return;

    attachedMesh.position.x = e.object.position.x;
    attachedMesh.position.y = e.object.position.y;

    attachedSymbolMesh.position.x = attachedMesh.position.x - .17;
    attachedSymbolMesh.position.y = attachedMesh.position.y - .05;
    attachedSymbolMesh.position.z = attachedMesh.position.z + .02;

    attachedPriceMesh.position.x = attachedMesh.position.x + .07;
    attachedPriceMesh.position.y = attachedMesh.position.y - .14;
    attachedPriceMesh.position.z = attachedMesh.position.z + .02;

    if(cellId){
      if(getFromSlotId){
        await axios.post(SERVER_IP + '/api/game/removeSymbolInHand', {
          slot: getFromSlotId,
          toCell: cellId
        })
      }
      else {
        await axios.post(SERVER_IP + '/api/game/removeSymbolInField', {
          cellId: getFromCellId,
          toCell: cellId
        })
      }
      await axios.post(SERVER_IP + '/api/game/insertSymbolInField', {
        cellId: cellId,
        symbolId: attachedSymbolId
      })
      editFieldCells(getFromCellId, cellId, getFromSlotId, slotId);
      setCell(true);
      socket.emit('gameMove', lobby?.invite_id)
    }
    else if(slotId) {
      if(getFromSlotId) {
        await axios.post(SERVER_IP + '/api/game/removeSymbolInHand', {
          slot: getFromSlotId,
          toSlot: slotId
        });
      }
      else {
        await axios.post(SERVER_IP + '/api/game/removeSymbolInField', {
          cellId: getFromCellId,
          toSlot: slotId
        })
      }
      await axios.post(SERVER_IP + '/api/game/insertSymbolInHand', {
        slot: slotId,
        symbolId: attachedSymbolId
      })
      editFieldCells(getFromCellId, cellId, getFromSlotId, slotId);
      setCell(true);
      socket.emit('gameMove', lobby?.invite_id)
    }
  } 
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
  }

  return (
    <mesh
      scale={.25}
      ref={meshRef}
      position={[positionX, positionY, active ? 0.95 : 1]}
      onPointerUp={handlePointerUp}
      onPointerDown={handlePointerDown}
      onPointerOver={(event) => setActive(true)}
      onPointerOut={(event) => setActive(false)}
    >
      <boxGeometry args={[1.35, 1.35, .25]} />
      <meshStandardMaterial 
        color={color} 
      />
    </mesh>
  )
}

export default Cell;