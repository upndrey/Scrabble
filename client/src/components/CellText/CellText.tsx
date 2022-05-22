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
  attachSymbol: Function,
  position: Vector3 | undefined
}

const CellText: FunctionComponent<CellTextProps> = (props) => {
  const {symbol, game, attachSymbol, position} = props;
  const { viewport } = useThree()
  const meshRef = useRef<THREE.Mesh>(null!)
  const symbolMesh = useRef<THREE.Mesh>(null!)
  const priceMesh = useRef<THREE.Mesh>(null!)
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(true)
  const [isPointerDown, setPointerDown] = useState<boolean>(false)
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
    console.log(e);
    setPointerDown(true);
    attachSymbol(e.object)
    e.stopPropagation()
  }

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    console.log(e);
    setPointerDown(false);
    attachSymbol(null!)
  }
  
  const handlePointerMove = (e:  ThreeEvent<PointerEvent>) => {
    e.object.position.x = e.point.x;
    e.object.position.y = e.point.y;
    symbolMesh.current.position.x = e.object.position.x - .17;
    symbolMesh.current.position.y = e.object.position.y - .05;
    priceMesh.current.position.x = e.object.position.x + .07;
    priceMesh.current.position.y = e.object.position.y - .14;
  }

  useEffect(() => {
    if (meshRef === null) return;
    if (meshRef.current === null) return;

    const mesh: any = meshRef.current;

    symbolMesh.current.position.x = mesh.position.x - .17;
    symbolMesh.current.position.y = mesh.position.y - .05;
    symbolMesh.current.position.z = mesh.position.z + .02;

    priceMesh.current.position.x = mesh.position.x + .07;
    priceMesh.current.position.y = mesh.position.y - .14;
    priceMesh.current.position.z = mesh.position.z + .02;
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
        onPointerOver={(e) => console.log('over')}
        onPointerOut={(e) => console.log('out')}
        onPointerDown={handlePointerDown}
        onPointerMove={isPointerDown ? handlePointerMove : () => {}}
      >
        <boxGeometry args={[1.35, 1.35, .25]} />
        <meshStandardMaterial color={hovered || active ? '#442D70' : '#6441A4'} />
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