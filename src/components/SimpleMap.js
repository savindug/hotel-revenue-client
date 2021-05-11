import React, { Component, useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import RoomIcon from '@material-ui/icons/Room';
import { Popover, Tooltip, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { CLUSTER_BACKGROUND } from '../utils/const';

import stars2 from '../assets/imgs/hote-icons/2stars.png';
import stars3 from '../assets/imgs/hote-icons/3stars.png';
import stars4 from '../assets/imgs/hote-icons/4stars.png';
import stars5 from '../assets/imgs/hote-icons/5stars.png';
import black_Hotel from '../assets/imgs/hote-icons/blck_Hotel.png';
import {
  greatPlaceStyle,
  greatPlaceStyleHover,
  K_SIZE,
} from '../styles/mapStyles';
import { GOOGLE_MAP_KEY } from '../env';

const hotelIconDim = {
  width: '30px',
  height: '40px',
};

const AnyReactComponent = ({ text, lat, long, stars }) => (
  <div>
    <Tooltip title={text} arrow>
      <img
        src={
          stars === 2
            ? stars2
            : stars === 3
            ? stars3
            : stars === 4
            ? stars4
            : stars === 5
            ? stars5
            : black_Hotel
        }
        width={hotelIconDim.width}
        height={hotelIconDim.height}
      />
    </Tooltip>
  </div>
);

const SimpleMap = () => {
  // const [hotelsList, setHotelsList] = useState([]);
  const getClusterDataSet = useSelector((state) => state.clusterDataSet);
  const {
    loading,
    err,
    cluster1,
    cluster2,
    cluster3,
    cluster4,
    hotels,
  } = getClusterDataSet;

  const [defaultProps] = useState({
    center: {
      lat: Number(hotels[0].location.lat),
      lng: Number(hotels[0].location.lng),
    },
    zoom: 15,
  });

  return (
    <div className="mt-5" style={{ height: '100vh', width: '100%' }}>
      {hotels.length > 0 ? (
        <GoogleMapReact
          bootstrapURLKeys={{
            key: GOOGLE_MAP_KEY,
          }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
          options={{
            styles: [
              {
                stylers: [
                  { saturation: 20 },
                  { gamma: 0.7 },
                  { backgroundColor: '#2e2e2e' },
                ],
              },
            ],
          }}
        >
          {hotels.map((_hotel, index) => (
            <AnyReactComponent
              lat={_hotel.location.lat}
              lng={_hotel.location.lng}
              stars={Math.floor(_hotel.stars)}
              text={_hotel.hotelName}
            />
          ))}
        </GoogleMapReact>
      ) : (
        <></>
      )}
    </div>
  );
};

// const styles = StyleSheet.create({
//   overlay: {
//     position: 'absolute',
//     top: '0px',
//     width: '100%',
//     height: '100%',
//     backgroundColor: '#000',
//     opacity: 0.5,
//   },
//   map: {
//     position: 'relative',
//   },
// });

export default SimpleMap;
