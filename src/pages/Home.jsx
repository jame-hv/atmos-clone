import * as THREE from 'three';
import { Float, PerspectiveCamera, useScroll } from '@react-three/drei';
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';

import { Background } from '../components/layouts/background/Background';
import { Airplane } from '../components/models/Airplane';
import { Cloud } from '../components/models/Cloud';
import { usePlay } from '../contexts/Play';
import { fadeOnBeforeCompile } from '../utils/fadeMaterial';
import { PageSection } from '../components/sections/PageSection';

// line number of point
const LINE_NB_POINTS = 1000;
const CURVE_DISTACE = 250;
const CURVE_AHEAD_CAMERA = 0.008;
const CURVE_AHEAD_AIRPLANE = 0.02;
const AIRPLANE_MAX_ANGLE = 35;
const FRICTION_DISTANCE = 55;

export const Home = () => {
  // curvePoints
  const curvePoints = useMemo(() => {
    return [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -CURVE_DISTACE),
      new THREE.Vector3(100, 0, -2 * CURVE_DISTACE),
      new THREE.Vector3(-100, 0, -3 * CURVE_DISTACE),
      new THREE.Vector3(100, 0, -4 * CURVE_DISTACE),
      new THREE.Vector3(0, 0, -5 * CURVE_DISTACE),
      new THREE.Vector3(0, 0, -6 * CURVE_DISTACE),
      new THREE.Vector3(0, 0, -7 * CURVE_DISTACE),
    ];
  }, []);

  // adjust opacity & material
  const sceneOpacity = useRef(0);
  const lineMaterialRef = useRef();

  // curve to plane follow

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(curvePoints, false, 'catmullrom', 0.5);
  }, []);

  // page section
  const pageSections = useMemo(() => {
    return [
      {
        cameraRailDist: -1,
        position: new THREE.Vector3(
          curvePoints[1].x + 0.75,
          curvePoints[1].y - 2.25,
          curvePoints[1].z
        ),
      },
      {
        cameraRailDist: 1.5,
        position: new THREE.Vector3(
          curvePoints[2].x - 1,
          curvePoints[2].y - 2.5,
          curvePoints[2].z
        ),
      },
      {
        cameraRailDist: -1,
        position: new THREE.Vector3(
          curvePoints[3].x + 1.25,
          curvePoints[3].y - 2,
          curvePoints[3].z
        ),
      },
      {
        cameraRailDist: 1.5,
        position: new THREE.Vector3(
          curvePoints[4].x + 1.25,
          curvePoints[4].y - 2,
          curvePoints[4].z - 12
        ),
      },
    ];
  }, []);

  // clouds

  const clouds = useMemo(
    () => [
      // STARTING

      {
        position: new THREE.Vector3(3.5, -4, -10),
      },
      {
        scale: new THREE.Vector3(4, 4, 4),
        position: new THREE.Vector3(-18, 0.2, -68),
        rotation: new THREE.Euler(-Math.PI / 5, Math.PI / 6, 0),
      },
      {
        scale: new THREE.Vector3(2.5, 2.5, 2.5),
        position: new THREE.Vector3(10, -1.2, -52),
      },

      // FIRST POINT
      {
        scale: new THREE.Vector3(4, 4, 4),
        position: new THREE.Vector3(
          curvePoints[1].x + 10,
          curvePoints[1].y - 4,
          curvePoints[1].z + 64
        ),
      },
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[1].x - 20,
          curvePoints[1].y + 4,
          curvePoints[1].z + 28
        ),
        rotation: new THREE.Euler(0, Math.PI / 7, 0),
      },

      {
        rotation: new THREE.Euler(Math.PI / 2, Math.PI / 2, Math.PI / 3),
        scale: new THREE.Vector3(5, 5, 5),
        position: new THREE.Vector3(
          curvePoints[1].x + 54,
          curvePoints[1].y + 2,
          curvePoints[1].z - 82
        ),
      },
      {
        scale: new THREE.Vector3(5, 5, 5),
        position: new THREE.Vector3(
          curvePoints[1].x + 8,
          curvePoints[1].y - 14,
          curvePoints[1].z - 22
        ),
      },
      // SECOND POINT
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[2].x + 6,
          curvePoints[2].y - 7,
          curvePoints[2].z + 50
        ),
      },
      {
        scale: new THREE.Vector3(2, 2, 2),
        position: new THREE.Vector3(
          curvePoints[2].x - 2,
          curvePoints[2].y + 4,
          curvePoints[2].z - 26
        ),
      },

      // THIRD POINT
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[3].x + 3,
          curvePoints[3].y - 10,
          curvePoints[3].z + 50
        ),
      },
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[3].x - 10,
          curvePoints[3].y,
          curvePoints[3].z + 30
        ),
        rotation: new THREE.Euler(Math.PI / 4, 0, Math.PI / 5),
      },
      {
        scale: new THREE.Vector3(4, 4, 4),
        position: new THREE.Vector3(
          curvePoints[3].x - 20,
          curvePoints[3].y - 5,
          curvePoints[3].z - 8
        ),
        rotation: new THREE.Euler(Math.PI, 0, Math.PI / 5),
      },

      // FOURTH POINT
      {
        scale: new THREE.Vector3(2, 2, 2),
        position: new THREE.Vector3(
          curvePoints[4].x + 3,
          curvePoints[4].y - 10,
          curvePoints[4].z + 2
        ),
      },
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[4].x + 24,
          curvePoints[4].y - 6,
          curvePoints[4].z - 42
        ),
        rotation: new THREE.Euler(Math.PI / 4, 0, Math.PI / 5),
      },

      // FINAL
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[7].x + 12,
          curvePoints[7].y - 5,
          curvePoints[7].z + 60
        ),
        rotation: new THREE.Euler(-Math.PI / 4, -Math.PI / 6, 0),
      },
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[7].x - 12,
          curvePoints[7].y + 5,
          curvePoints[7].z + 120
        ),
        rotation: new THREE.Euler(Math.PI / 4, Math.PI / 6, 0),
      },
    ],
    []
  );

  const shape = useMemo(() => {
    const shape = new THREE.Shape();
    // adjust shape width
    shape.moveTo(0, -0.08);
    shape.lineTo(0, 0.08);

    return shape;
  }, [curve]);

  const cameraGroup = useRef();
  const cameraRail = useRef();
  const camera = useRef();
  const airplane = useRef();
  const scroll = useScroll();
  const lastScroll = useRef(0);

  const { start, end, setEnd, setHasScroll } = usePlay();

  useFrame((_state, delta) => {
    if (window.innerWidth > window.innerHeight) {
      // LANDSCAPE
      camera.current.fov = 30;
      camera.current.position.z = 5;
    } else {
      // PORTRAIT
      camera.current.fov = 80;
      camera.current.position.z = 2;
    }

    if (lastScroll.current <= 0 && scroll.offset > 0) {
      setHasScroll(true);
    }

    if (start && !end && sceneOpacity.current < 1) {
      sceneOpacity.current = THREE.MathUtils.lerp(
        sceneOpacity.current,
        1,
        delta * 0.1
      );
    }

    if (end && sceneOpacity.current > 0) {
      sceneOpacity.current = THREE.MathUtils.lerp(
        sceneOpacity.current,
        0,
        delta
      );
    }

    lineMaterialRef.current.opacity = sceneOpacity.current;

    if (end) {
      return;
    }
    const scrollOffset = Math.max(0, scroll.offset);

    let friction = 1;

    let resetCameraRail = true;
    // make text section look closer
    pageSections.forEach((pageSection) => {
      const distance = pageSection.position.distanceTo(
        cameraGroup.current.position
      );

      if (distance < FRICTION_DISTANCE) {
        friction = Math.max(distance / FRICTION_DISTANCE, 0.1);
        const targetCameraRailPosition = new THREE.Vector3(
          (1 + distance / FRICTION_DISTANCE) * pageSection.cameraRailDist,
          -1,
          0
        );
        cameraRail.current.position.lerp(targetCameraRailPosition, delta);
        resetCameraRail = false;
      }
    });

    if (resetCameraRail) {
      const targetCameraRailPosition = new THREE.Vector3(0, 0, 0);
      cameraRail.current.position.lerp(targetCameraRailPosition, delta);
    }

    // Calculate scroll offset
    let lerpedScrollOffset = THREE.MathUtils.lerp(
      lastScroll.current,
      scrollOffset,
      friction * delta
    );

    // protect bellow 0 above 1
    lerpedScrollOffset = Math.min(lerpedScrollOffset, 1);
    lerpedScrollOffset = Math.max(lerpedScrollOffset, 0);

    lastScroll.current = lerpedScrollOffset;

    tl.current.seek(lerpedScrollOffset * tl.current.duration());

    const curPoint = curve.getPoint(lerpedScrollOffset);

    // Make camear follow the curve point
    cameraGroup.current.position.lerp(curPoint, delta * 24);

    //  Make a group look ahead on the curve
    const lookAtPoint = curve.getPoint(
      Math.min(lerpedScrollOffset + CURVE_AHEAD_CAMERA, 1)
    );

    const currentLookAt = cameraGroup.current.getWorldDirection(
      new THREE.Vector3()
    );

    const targetLookAt = new THREE.Vector3()
      .subVectors(curPoint, lookAtPoint)
      .normalize();

    const lookAt = currentLookAt.lerp(targetLookAt, delta * 24);

    cameraGroup.current.lookAt(
      cameraGroup.current.position.clone().add(lookAt)
    );

    // Air plane rotation handle

    const tangent = curve.getTangent(lerpedScrollOffset + CURVE_AHEAD_AIRPLANE);
    const nonLerpLookAt = new THREE.Group();
    nonLerpLookAt.position.copy(curPoint);
    nonLerpLookAt.lookAt(nonLerpLookAt.position.clone().add(targetLookAt));

    tangent.applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      -nonLerpLookAt.rotation.y
    );

    let angle = Math.atan2(-tangent.z, tangent.x);
    angle = -Math.PI / 2 + angle;

    let angleDegrees = (angle * 180) / Math.PI;
    angleDegrees *= 2.5; // make angle stronger

    // LIMIT PLANE ANGLE
    if (angleDegrees < 0) {
      angleDegrees = Math.max(angleDegrees, -AIRPLANE_MAX_ANGLE);
    }
    if (angleDegrees > 0) {
      angleDegrees = Math.min(angleDegrees, AIRPLANE_MAX_ANGLE);
    }

    // SET BACK ANGLE
    angle = (angleDegrees * Math.PI) / 180;

    const targetAirplaneQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        airplane.current.rotation.x,
        airplane.current.rotation.y,
        angle
      )
    );

    airplane.current.quaternion.slerp(targetAirplaneQuaternion, delta * 2);

    if (
      cameraGroup.current.position.z <
      curvePoints[curvePoints.length - 1].z + 100
    ) {
      setEnd(true);
      planeOutTl.current.play();
    }
  });

  const tl = useRef();
  const backgroundColors = useRef({
    colorA: '#3535cc',
    colorB: '#abaadd',
  });

  // define start/end timepline

  const planeInTl = useRef();
  const planeOutTl = useRef();

  useLayoutEffect(() => {
    tl.current = gsap.timeline();
    tl.current.to(backgroundColors.current, {
      duration: 1,
      colorA: '#6f35cc',
      colorB: '#ffad30',
    });
    tl.current.to(backgroundColors.current, {
      duration: 1,
      colorA: '#81316c',
      colorB: '#ffff00',
    });
    tl.current.to(backgroundColors.current, {
      duration: 1,
      colorA: '#81318b',
      colorB: '#55ab8f',
    });
    tl.current.pause();

    planeInTl.current = gsap.timeline();
    planeInTl.current.pause();
    planeInTl.current.from(airplane.current.position, {
      duration: 3,
      z: 5,
      y: -2,
    });

    planeOutTl.current = gsap.timeline();
    planeOutTl.current.pause();

    planeOutTl.current.to(
      airplane.current.position,
      {
        duration: 10,
        z: -250,
        y: 10,
      },
      0
    );
    planeOutTl.current.to(
      cameraRail.current.position,
      {
        duration: 8,
        y: 12,
      },
      0
    );
    planeOutTl.current.to(airplane.current.position, {
      duration: 1,
      z: -1000,
    });
  }, []);

  useEffect(() => {
    if (start) {
      planeInTl.current.play();
    }
  }, [start]);

  return useMemo(
    () => (
      <>
        {/* <OrbitControls enableZoom={false} /> */}

        <directionalLight position={[0, 2, 1]} intensity={0.9} />
        <group ref={cameraGroup}>
          <Background backgroundColors={backgroundColors} />
          <group ref={cameraRail}>
            <PerspectiveCamera
              ref={camera}
              position={[0, 0, 5]}
              fov={30}
              makeDefault
            />
          </group>

          <group ref={airplane}>
            <Float rotationIntensity={0.2} floatIntensity={3}>
              <Airplane
                scale={[0.0008, 0.0008, 0.0008]}
                rotation-y={Math.PI}
                rotation-x={Math.PI / 16}
                position-y={-0.5}
              />
            </Float>
          </group>
        </group>

        {/* TEXT  */}

        {pageSections.map((section, index) => (
          <PageSection {...section} key={index} />
        ))}

        {/* LINE  */}
        <group position-y={-2}>
          <mesh>
            <extrudeGeometry
              args={[
                shape,
                {
                  steps: LINE_NB_POINTS,
                  bevelEnabled: false,
                  extrudePath: curve,
                },
              ]}
            />
            <meshStandardMaterial
              color={'white'}
              ref={lineMaterialRef}
              transparent
              envMapIntensity={2}
              onBeforeCompile={fadeOnBeforeCompile}
            />
          </mesh>
        </group>

        {/* Clouds  */}

        {clouds.map((cloud, index) => (
          <Cloud sceneOpacity={sceneOpacity} {...cloud} key={index} />
        ))}
      </>
    ),
    []
  );
};
