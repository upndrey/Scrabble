import { ThreeEvent, Vector3 } from "@react-three/fiber";
import React, { useEffect, useRef, FunctionComponent, useState } from "react";

interface CellProps {
  attachedSymbol: THREE.Mesh,
  positionX: number,
  positionY: number,
  color: string
}

const Cell: FunctionComponent<CellProps> = (props) => {
  const {color, attachedSymbol, positionX, positionY} = props;
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    if(!attachedSymbol) 
      return;
    attachedSymbol.position.x = e.object.position.x;
    attachedSymbol.position.y = e.object.position.y;
  }
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if(!attachedSymbol) 
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