/* eslint-disable react/no-unknown-property */
import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';

import { usePlay } from './contexts/Play';
import { Overlay } from './components/layouts/overlay/Overlay';
import { Home } from './pages/Home';

function App() {
  const { start, end } = usePlay();

  return (
    <>
      <Canvas>
        <color attach="background" args={['#ececec']} />

        <ScrollControls
          pages={start && !end ? 45 : 0}
          damping={0.5}
          style={{
            top: '10px',
            left: '0px',
            bottom: '10px',
            right: '10px',
            width: 'auto',
            height: 'auto',
            animation: 'fadeIn 1.2s ease-in-out 1.2s forwards',
            opacity: 0,
          }}
        >
          <Home />
        </ScrollControls>
      </Canvas>
      <Overlay />
    </>
  );
}

export default App;
