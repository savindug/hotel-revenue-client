import React, { Component, useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import RoomIcon from '@material-ui/icons/Room';
import { Tooltip } from '@material-ui/core';
import { useSelector } from 'react-redux';
const AnyReactComponent = ({ text, lat, long, color }) => (
  <Tooltip title={text} arrow>
    <RoomIcon fontSize="medium" style={{ fill: color }} lat={lat} lng={long} />
  </Tooltip>
);

const SimpleMap = () => {
  const clusterBG = ['#E6B8B8', '#CCC0DA', '#C4D79B', '#DCE6F1'];
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
    // Important! Always set the container height explicitly
    <div style={{ height: '100vh', width: '100%' }}>
      {hotels.length > 0 ? (
        <GoogleMapReact
          bootstrapURLKeys={{
            key: 'AIzaSyCzDd8gDOD8VTT40i6J8wl543L6sxLv8L8',
          }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
        >
          {hotels.map((_hotel, index) => (
            <AnyReactComponent
              lat={_hotel.location.lat}
              lng={_hotel.location.lng}
              color={
                index === 0
                  ? '#D50000'
                  : clusterBG[Math.floor(_hotel.stars) - 2]
              }
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

export default SimpleMap;
