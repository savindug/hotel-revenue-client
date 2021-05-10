import { CLUSTER_BACKGROUND } from '../utils/const';

const K_SIZE = 40;

const greatPlaceStyle = {
  // initially any map object has left top corner at lat lng coordinates
  // it's on you to set object origin to 0,0 coordinates
  position: 'absolute',

  left: -K_SIZE / 2,
  top: -K_SIZE / 2,

  //border: '1px solid #2e2e2e',
  backgroundColor: '#FBFBFB',
  textAlign: 'center',
  boxShadow: '5px',
  fontWeight: 'bold',
  padding: 4,
  cursor: 'pointer',
};

const greatPlaceStyleHover = {
  ...greatPlaceStyle,
  border: '1px solid #2e2e2e',
  color: '#f44336',
};

export { greatPlaceStyle, greatPlaceStyleHover, K_SIZE };
