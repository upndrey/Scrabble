import { ThreeEvent, Vector3 } from "@react-three/fiber";
import axios from "axios";
import React, { useEffect, useRef, FunctionComponent, useState } from "react";

interface CellProps {
  attachedSymbolMesh: THREE.Mesh,
  attachedSymbolId: number,
  positionX: number,
  positionY: number,
  color: string,
  cellId: number | null,
  slotId: number | null,
  getFromSlotId: number | null,
  getFromCellId: number | null,
  getUserData: Function
}

const Cell: FunctionComponent<CellProps> = (props) => {
  const {
    color, 
    attachedSymbolMesh, 
    attachedSymbolId, 
    positionX, 
    positionY, 
    cellId, 
    slotId,
    getFromSlotId,
    getFromCellId,
    getUserData
  } = props;
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  const handlePointerUp = async (e: ThreeEvent<PointerEvent>) => {
    if(!attachedSymbolMesh) 
      return;
    attachedSymbolMesh.position.x = e.object.position.x;
    attachedSymbolMesh.position.y = e.object.position.y;
    if(cellId){
      if(getFromSlotId)
        await axios.post('http://localhost:3000/api/removeSymbolInHand', {
          slot: getFromSlotId,
        })
      else
        await axios.post('http://localhost:3000/api/removeSymbolInField', {
          cellId: getFromCellId,
        })
      await axios.post('http://localhost:3000/api/insertSymbolInField', {
        cellId: cellId,
        symbolId: attachedSymbolId
      })
      getUserData()
    }
    else if(slotId) {
      if(getFromSlotId)
        await axios.post('http://localhost:3000/api/removeSymbolInHand', {
          slot: getFromSlotId,
        })
      else
        await axios.post('http://localhost:3000/api/removeSymbolInField', {
          cellId: getFromCellId,
        })
      await axios.post('http://localhost:3000/api/insertSymbolInHand', {
        slot: slotId,
        symbolId: attachedSymbolId
      })
      getUserData()
    }
  } 
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if(!attachedSymbolMesh) 
      return;
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
        color={hovered || active ? '#442D70' : color} 
      />
    </mesh>
  )
}

export default Cell;