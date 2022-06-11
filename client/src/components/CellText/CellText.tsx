import { FunctionComponent, useEffect, useRef, useState } from "react";
import Symbol from '../Symbol/Symbol'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import roboto from '../../fonts/roboto.json'
import { UserData } from "../../interfaces/UserData";
import { ThreeEvent, useFrame, useThree, Vector3 } from "@react-three/fiber";

interface CellTextProps {
  symbol: number | null,
  game: UserData['game'],
  attachSymbolMesh: Function,
  attachSymbolId: Function,
  attachMesh: Function,
  attachPriceMesh: Function,
  position: Vector3 | undefined,
  setGetFromSlotId: Function | null,
  setGetFromCellId: Function | null,
  cellId: number | null,
  slotId: number | null,
  isYourTurn: boolean,
  setAttachedMeshPos: Function,
}

const CellText: FunctionComponent<CellTextProps> = (props) => {
  const {
    symbol, 
    game, 
    attachSymbolMesh, 
    attachSymbolId, 
    position,
    setGetFromSlotId,
    setGetFromCellId,
    cellId,
    slotId,
    attachMesh,
    attachPriceMesh,
    isYourTurn,
    setAttachedMeshPos,
  } = props;
  const { viewport } = useThree()
  const meshRef = useRef<THREE.Mesh>(null!)
  const symbolMesh = useRef<THREE.Mesh>(null!)
  const priceMesh = useRef<THREE.Mesh>(null!)
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(true)
  const font = new FontLoader().parse(roboto);

  const textOptions = {
    font: font,
    size: 1,
    height: .1,
  };
  const valueOptions = {
    font: font,
    size: .5,
    height: .1,
  };
  let textGeo = new TextGeometry("", textOptions);
  let valueGeo = new TextGeometry("0", textOptions);
  if(symbol){
    const correctSymbol = game?.symbols.find((row) => {
      return row.id === symbol
    })
    if(correctSymbol?.value){
      textGeo = new TextGeometry(correctSymbol?.value.toLocaleUpperCase(), textOptions);
      valueGeo = new TextGeometry(correctSymbol?.price.toString(), valueOptions);
    }
  }

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if(isYourTurn) {
      attachSymbolMesh(symbolMesh.current)
      attachMesh(meshRef.current)
      attachPriceMesh(priceMesh.current)
      setAttachedMeshPos([meshRef.current.position.x, meshRef.current.position.y]);
      attachSymbolId(symbol)
      if(setGetFromSlotId)
        setGetFromSlotId(slotId)
      if(setGetFromCellId)
        setGetFromCellId(cellId)
    }
  }

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    
  }
  
  useEffect(() => {
    if (!meshRef || !meshRef.current) return;
    const mesh: any = meshRef.current;
    const temp : any = position;
    meshRef.current.position.x = temp[0];
    meshRef.current.position.y = temp[1];
    meshRef.current.position.z = temp[2];

    symbolMesh.current.position.x = mesh.position.x - .17;
    symbolMesh.current.position.y = mesh.position.y - .05;
    symbolMesh.current.position.z = mesh.position.z + .02;

    priceMesh.current.position.x = mesh.position.x + .07;
    priceMesh.current.position.y = mesh.position.y - .14;
    priceMesh.current.position.z = mesh.position.z + .02;
  }, [])

  useEffect(() => {
    
  });
  return (
    <>
      <mesh
        ref={meshRef}
        scale={.25}
        position={
          position
        }
        onPointerUp={handlePointerUp}
        onPointerDown={handlePointerDown}
      >
        <boxGeometry args={[1.35, 1.35, .25]} />
        <meshPhongMaterial color={hovered || active ? 'black' : 'black'} opacity={.5} transparent />
      </mesh>
      <mesh
        ref={symbolMesh}
        scale={.20}
        geometry={textGeo}
      >
        <meshStandardMaterial color='white' />
      </mesh>
      <mesh
        ref={priceMesh}
        scale={.20}
        geometry={valueGeo}
      >
        <meshStandardMaterial color='white' />
      </mesh>
    </>
  )
}

export default CellText;