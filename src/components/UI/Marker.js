import React from 'react';
import '../../styles/marker.module.css';

const Marker = () => {
  //const { color, name, id } = props; color={'#2e2e2e'}

  return (
    <div
      className="marker"
      style={{ backgroundColor: '#2e2e2e', cursor: 'pointer' }}
      title={'Palms'}
    />
  );
};

export default Marker;
