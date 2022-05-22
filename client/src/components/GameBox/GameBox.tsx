import React from 'react'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import roboto from '../../fonts/roboto.json'
const font = new FontLoader().parse(roboto);

type Props = {}

const GameBox = (props: Props) => {
  
  const textOptions = {
    font: font,
    size: 1,
    height: .1,
  };
  let textGeo = new TextGeometry("Корзина", textOptions);
  return (
    <mesh
        scale={.20}
        geometry={textGeo}
        position={[2.5, -1.3, 1]}
      >
      <meshStandardMaterial color='white' />
    </mesh>
  )
}

export default GameBox