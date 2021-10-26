import React, { Component, useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import RoomIcon from '@material-ui/icons/Room';
import { Popover, Typography } from '@material-ui/core';
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
import { ListGroup, OverlayTrigger, Toast, Tooltip } from 'react-bootstrap';
import LocationCityOutlinedIcon from '@material-ui/icons/LocationCityOutlined';
import moment from 'moment';

const hotelIconDim = {
  width: '40px',
  height: '40px',
};

const placement = 'top';

const getStars = (stars) => {
  const stArr = [stars];

  return stArr.map((i) => <>&#10032;</>);
};
// Return map bounds based on list of places
const getMapBounds = (map, maps, places) => {
  const bounds = new maps.LatLngBounds();

  places.forEach((place) => {
    bounds.extend(new maps.LatLng(place.location.lat, place.location.lng));
  });
  return bounds;
};

// Re-center map when resizing the window
const bindResizeListener = (map, maps, bounds) => {
  maps.event.addDomListenerOnce(map, 'idle', () => {
    maps.event.addDomListener(window, 'resize', () => {
      map.fitBounds(bounds);
    });
  });
};

// Fit map to its bounds after the api is loaded
const apiIsLoaded = (map, maps, places) => {
  // Get bounds by our places
  const bounds = getMapBounds(map, maps, places);
  // Fit map to bounds
  map.fitBounds(bounds);
  // Bind the resize listener
  bindResizeListener(map, maps, bounds);
};

const SimpleMap = () => {
  // const [hotelsList, setHotelsList] = useState([]);
  const getClusterDataSet = useSelector((state) => state.clusterDataSet);
  const { loading, err, cluster1, cluster2, cluster3, cluster4, hotels } =
    getClusterDataSet;

  const [defaultProps] = useState({
    center: {
      lat: Number(hotels[0].location.lat),
      lng: Number(hotels[0].location.lng),
    },
    zoom: 15,
  });

  const [infoWindow, setInfoWindow] = useState(false);
  const [infoWindowID, setInfoWindowID] = useState();

  const handleInfoOpen = (key) => {
    setInfoWindow(true);
    setInfoWindowID(key);
  };

  const handleInfoClose = () => {
    setInfoWindow(false);
  };

  const getClusterByPrice = (rate, ix) => {
    if (
      (cluster1[ix].min != undefined || cluster1[ix].min != null) &&
      (cluster1[ix].max != undefined || cluster1[ix].max != null)
    ) {
      if (rate >= cluster1[ix].min && rate <= cluster1[ix].max) {
        // console.log(
        //   `${ix} => ${cluster1[ix].min} < ${rate} > ${cluster1[ix].max} `
        // );
        return 0;
      }
    }
    if (
      (cluster2[ix].min != undefined || cluster2[ix].min != null) &&
      (cluster2[ix].max != undefined || cluster2[ix].max != null)
    ) {
      if (rate >= cluster2[ix].min && rate <= cluster2[ix].max) {
        // console.log(
        //   `${ix} =>${cluster2[ix].min} < ${rate} > ${cluster2[ix].max} `
        // );
        return 1;
      }
    }

    if (
      (cluster3[ix].min != undefined || cluster3[ix].min != null) &&
      (cluster3[ix].max != undefined || cluster3[ix].max != null)
    ) {
      if (rate >= cluster3[ix].min && rate <= cluster3[ix].max) {
        // console.log(
        //   `${ix} =>${cluster3[ix].min} < ${rate} > ${cluster3[ix].max} `
        // );
        return 2;
      }
    }
    if (
      (cluster4[ix].min != undefined || cluster4[ix].min != null) &&
      (cluster4[ix].max != undefined || cluster4[ix].max != null)
    ) {
      if (rate >= cluster4[ix].min && rate <= cluster4[ix].max) {
        // console.log(
        //   `${ix} =>${cluster4[ix].min} < ${rate} > ${cluster4[ix].max} `
        // );
        return 3;
      }
    }
  };

  const getPrice = (arr) => {
    const price = arr.findIndex((e) => e > 0);
    return price;
  };

  const mode = (arr) => {
    return arr
      .sort(
        (a, b) =>
          arr.filter((v) => v === a).length - arr.filter((v) => v === b).length
      )
      .pop();
  };

  const AnyReactComponent = ({ id, text, stars, prices, mod_wd, mod_we }) => (
    <div key={id} style={{ cursor: 'pointer' }}>
      {/* <OverlayTrigger
        key={placement}
        placement={placement}
        overlay=
      > */}
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
        onClick={() => handleInfoOpen(id)}
      />
      {infoWindow && infoWindowID === id ? (
        <div>
          <Toast
            className="bg-dark text-light"
            onClick={handleInfoClose}
            style={{
              position: 'absolute',
              top: 0,
              zIndex: 10,
              minWidth: '200px',
              minHeight: '100px',
            }}
            autohide
          >
            <Toast.Header className="bg-dark text-light">
              <h6>
                <span>{`${text}`}</span>
              </h6>

              <strong className="mr-auto text-light"></strong>
            </Toast.Header>
            <Toast.Body className="bg-dark">
              <p>{`Weekday Freq Bucket: ${mod_wd}`}</p>
              <p>{`Weekend Freq Bucket: ${mod_we}`}</p>
              {/* <ul>
                <li className="bg-dark">Stars {stars}</li>
                <li className="bg-dark"> Date</li>
                <li className="bg-dark">Rate</li>
              </ul> */}
            </Toast.Body>
          </Toast>
        </div>
      ) : (
        <></>
      )}
    </div>
  );

  return (
    <div className="mt-5" style={{ height: '100vh', width: '100%' }}>
      {hotels.length > 0 &&
      cluster1.length > 0 &&
      cluster2.length > 0 &&
      cluster3.length > 0 &&
      cluster4.length > 0 ? (
        <GoogleMapReact
          bootstrapURLKeys={{
            key: GOOGLE_MAP_KEY,
          }}
          yesIWantToUseGoogleMapApiInternals
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
          options={{
            styles: [
              {
                stylers: [{ saturation: 25 }, { gamma: 0.7 }],
              },
              {
                featureType: 'poi',
                elementType: 'labels.icon',
                stylers: [
                  {
                    visibility: 'off',
                  },
                ],
              },
            ],
          }}
          onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps, hotels)}
        >
          {hotels.map((_hotel, index) =>
            (() => {
              let cluster_arr_wd = [];
              let cluster_arr_we = [];
              _hotel.prices.map((dt, ix) => {
                if (dt !== null) {
                  const day = moment(dt.date).format('dddd').substring(0, 3);
                  if (day === 'Sat' || day === 'Fri') {
                    cluster_arr_we.push(
                      getClusterByPrice(dt.price[getPrice(dt.price)], ix) + 2
                    );
                  } else {
                    cluster_arr_wd.push(
                      getClusterByPrice(dt.price[getPrice(dt.price)], ix) + 2
                    );
                  }
                }
              });
              return (
                <AnyReactComponent
                  id={_hotel.hotelID}
                  lat={_hotel.location.lat}
                  lng={_hotel.location.lng}
                  stars={Math.floor(_hotel.stars)}
                  text={_hotel.hotelName}
                  prices={_hotel.prices}
                  mod_wd={mode(cluster_arr_wd)}
                  mod_we={mode(cluster_arr_we)}
                />
              );
            })()
          )}
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
