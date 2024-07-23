import { usePlay } from '../../contexts/Play';
import { Torri } from '../models/pages/Toori';
// import { AsianHouse } from '../models/pages/AsianHouse';

export const PageSection = ({ ...props }) => {
  return (
    <group {...props}>
      {/* <AsianHouse /> */}
      <Torri />
    </group>
  );
};
