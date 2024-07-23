import { useProgress } from '@react-three/drei';
import { usePlay } from '../../../contexts/Play';

export const Overlay = () => {
  const { progress } = useProgress();

  const { start, end, setStart, hasScroll } = usePlay();

  console.log(end);
  return (
    <div
      className={`overlay ${start ? 'overlay--disable' : ''} ${
        hasScroll ? 'onerlay--scrolled' : ''
      }`}
    >
      <div
        className={`loader ${progress === 100 ? 'loader--disappear' : ''}`}
      />

      {/* intro  */}

      {progress === 100 && (
        <div className={`intro ${start ? 'intro--disappear' : ''}`}>
          <h1 className="logo">
            Live view
            <div className="spinner">
              <div className="spinner__image" />
            </div>
          </h1>
          <p className="intro__scroll">{`${
            !end ? 'Scroll to start travel' : ''
          }  `}</p>
          <button
            className="explore"
            onClick={() => {
              setStart(true);
            }}
          >
            Start
          </button>
        </div>
      )}

      <div className={`outro ${end ? 'outro--appear' : ''}`}>
        <p className="outro__text">End animation</p>
      </div>
    </div>
  );
};
