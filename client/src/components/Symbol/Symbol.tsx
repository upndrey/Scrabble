import React, { useRef, useState } from 'react'
import THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import roboto from '../../fonts/roboto.json'
type Props = {}

function Symbol({}: Props) {
  const mesh = useRef<THREE.Mesh>(null!)
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  const font = new FontLoader().parse(roboto);
  const textOptions = {
    font: font,
    size: 1,
    height: .1,
  };
  const textGeo = new TextGeometry("Б", textOptions);
  return (
    <>
      <mesh
        scale={.25}
        position={[1.9 + 4 / 2.5, -2, !active ? .95: 1]}
        ref={mesh}
        onClick={(event) => setActive(!active)}
        onPointerOver={(event) => setHover(true)}
        onPointerOut={(event) => setHover(false)}>
      <boxGeometry args={[1.35, 1.35, .25]} />
      <meshStandardMaterial 
        color={hovered || active ? '#442D70' : '#6441A4'} 
      />
    </mesh>
      <mesh
        scale={.25}
        position={[1.78 + 4 / 2.5, -2.10, !active ? 1 : 1.05]}
        onClick={(event) => setActive(!active)}
        onPointerOver={(event) => setHover(true)}
        onPointerOut={(event) => setHover(false)}
        geometry={textGeo}
      >
        <meshStandardMaterial color='white' />
      </mesh>
    </>
  )
}

export default Symbol