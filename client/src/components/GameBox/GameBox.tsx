import { ThreeEvent } from '@react-three/fiber';
import axios from 'axios';
import React, { useState } from 'react'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { socket } from '../../features/socket';
import roboto from '../../fonts/roboto.json'
import { UserData } from '../../interfaces/UserData';
import { SERVER_IP } from '../../features/server';
const font = new FontLoader().parse(roboto);

type Props = {
  attachedSymbolId: number,
  lobby: UserData['lobby']
}

const GameBox = ({attachedSymbolId, lobby}: Props) => {
  const [isBoxEntered, enterBox] = useState<boolean>(false)
  
  const textOptions = {
    font: font,
    size: 1,
    height: .1,
  };

  const onPointerUpHandler = async (e: ThreeEvent<PointerEvent>) => {
    console.log(2);
    if(attachedSymbolId) {
      console.log(3);
      await axios.post(SERVER_IP + '/api/insertSymbolInSet', {
        symbolId: attachedSymbolId
      })
      socket.emit('gameMove', lobby?.invite_id)
    }
  }

  let textGeo = new TextGeometry("Корзина", textOptions);
  return (
    <>
    <mesh
      scale={.25}
      position={[3.1, -1.25, .91]}
      onPointerUp={onPointerUpHandler}
      onPointerEnter={() => {enterBox(true)}}
      onPointerOut={() => {enterBox(false)}}
    >
      <boxGeometry args={[11.2, 3.7, .5]} />
      <meshStandardMaterial color={isBoxEntered && attachedSymbolId ? '#6a5acd' : '#9260F0'} />
    </mesh>
    <mesh
        scale={.20}
        geometry={textGeo}
        position={[2.5, -1.3, 1]}
      >
      <meshStandardMaterial color='white' />
    </mesh>
    </>
  )
}

export default GameBox