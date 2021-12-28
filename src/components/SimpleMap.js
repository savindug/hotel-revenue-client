import React, { Component, useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import RoomIcon from '@material-ui/icons/Room';
import {
  Popover,
  Typography,
  Grid,
  Divider,
  ListItem,
  ListItemText,
  Avatar,
  ListItemAvatar,
  List,
  Box,
} from '@material-ui/core';
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
    let clustered = [];
    let res;

    if (cluster1.length > 0) {
      clustered.push(cluster1[ix]);
    }
    if (cluster2.length > 0) {
      clustered.push(cluster2[ix]);
    }
    if (cluster3.length > 0) {
      clustered.push(cluster3[ix]);
    }
    if (cluster4.length > 0) {
      clustered.push(cluster4[ix]);
    }

    clustered.sort((a, b) => a.mean - b.mean);

    // console.log(clustered);

    clustered.map((cl, id) => {
      if (rate >= cl.min && rate <= cl.max) {
        res = id;
        return;
      }
    });

    return res;
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

  const AnyReactComponent = ({
    id,
    text,
    stars,
    prices,
    mod_wd,
    mod_we,
    mod_w,
    ratings,
  }) => (
    <div key={id} style={{ cursor: 'pointer' }}>
      {/* <OverlayTrigger
        key={placement}
        placement={placement}
        overlay=
      > */}
      <img
        src={
          mod_w === 2
            ? stars2
            : mod_w === 3
            ? stars3
            : mod_w === 4
            ? stars4
            : mod_w === 5
            ? stars5
            : black_Hotel
        }
        width={hotelIconDim.width}
        height={hotelIconDim.height}
        onMouseEnter={() => handleInfoOpen(id)}
        onMouseLeave={handleInfoClose}
      />
      {infoWindow && infoWindowID === id ? (
        <div>
          <Toast
            className="text-light"
            onClick={handleInfoClose}
            style={{
              position: 'absolute',
              top: 0,
              zIndex: 10,
              minWidth: '200px',
              minHeight: '100px',
              background: '#9E9E9E',
            }}
          >
            <Toast.Header
              className="text-light"
              style={{ background: '#9E9E9E' }}
            >
              <h6>
                <span>{`${text}`}</span>
              </h6>

              <strong className="mr-auto text-light"></strong>
            </Toast.Header>
            <Toast.Body className="" style={{ background: '#9E9E9E' }}>
              <p>{`Stars: ${stars}`}</p>
              <p>{`Ratings: ${ratings}`}</p>
              <p>{`Weekday Bucket: ${mod_wd}`}</p>
              <p>{`Weekend Bucket: ${mod_we}`}</p>
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
    <Grid container justify="space-evenly">
      <div className="mt-5" style={{ height: '100vh', width: '50%' }}>
        {hotels.length > 0 ? (
          <Box
            overflow="auto"
            height="100vh"
            flexDirection="column"
            display="flex"
          >
            <List
              sx={{
                width: '100%',
                bgcolor: 'background.paper',
                position: 'relative',
                overflow: 'auto',
                '& ul': { padding: 0 },
              }}
            >
              {hotels
                .sort((a, b) => a.hotelName.localeCompare(b.hotelName))
                .map((_hotel, index) =>
                  (() => {
                    let cluster_arr_wd = [];
                    let cluster_arr_we = [];
                    let cluster_arr_w = [];
                    _hotel.prices.map((dt, ix) => {
                      if (dt !== null) {
                        const day = moment(dt.date)
                          .format('dddd')
                          .substring(0, 3);
                        cluster_arr_w.push(
                          getClusterByPrice(dt.price[getPrice(dt.price)], ix) +
                            2
                        );
                        if (day === 'Sat' || day === 'Fri') {
                          cluster_arr_we.push(
                            getClusterByPrice(
                              dt.price[getPrice(dt.price)],
                              ix
                            ) + 2
                          );
                        } else {
                          cluster_arr_wd.push(
                            getClusterByPrice(
                              dt.price[getPrice(dt.price)],
                              ix
                            ) + 2
                          );
                        }
                      }
                    });
                    return (
                      <>
                        <ListItem
                          className="shadow-lg border border-white rounded font-weight-bold"
                          style={{
                            backgroundColor:
                              CLUSTER_BACKGROUND[
                                Math.floor(mode(cluster_arr_w)) - 2
                              ],
                            cursor: 'pointer',
                          }}
                          alignItems="flex-start"
                          onClick={() => handleInfoOpen(_hotel.hotelID)}
                        >
                          {/* <ListItemAvatar>
                          <Avatar
                            alt="hotel_img"
                            src="/static/images/avatar/1.jpg"
                          />
                        </ListItemAvatar> */}
                          <ListItemText
                            primary={_hotel.hotelName}
                            secondary={
                              <React.Fragment>
                                <Grid
                                  container
                                  justify="space-evenly"
                                  className="p-2 font-weight-bold"
                                >
                                  <Typography
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="body2"
                                    className="font-weight-bold"
                                  >
                                    Stars: {_hotel.stars}
                                  </Typography>
                                  <Typography
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="body2"
                                    className="font-weight-bold"
                                  >
                                    Ratings: {_hotel.ratings}
                                  </Typography>
                                  <Typography
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="body2"
                                    className="font-weight-bold"
                                  >
                                    # Rooms: {_hotel.noOfRooms}
                                  </Typography>
                                  <Typography
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="body2"
                                    className="font-weight-bold"
                                  >
                                    Weekday Bucket:{' '}
                                    {mode(cluster_arr_wd) <= 5
                                      ? mode(cluster_arr_wd)
                                      : 'N/A'}
                                  </Typography>
                                  <Typography
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="body2"
                                    className="font-weight-bold"
                                  >
                                    Weekend Bucket:{' '}
                                    {mode(cluster_arr_we) <= 5
                                      ? mode(cluster_arr_we)
                                      : 'N/A'}
                                  </Typography>
                                </Grid>
                              </React.Fragment>
                            }
                          />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                      </>
                    );
                  })()
                )}
            </List>
          </Box>
        ) : (
          <></>
        )}
      </div>
      <div className="mt-5" style={{ height: '100vh', width: '50%' }}>
        {/* {console.log(defaultProps)}, */}
        {hotels.length > 0 ? (
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
            onGoogleApiLoaded={({ map, maps }) =>
              apiIsLoaded(map, maps, hotels)
            }
          >
            {hotels.map((_hotel, index) =>
              (() => {
                let cluster_arr_wd = [];
                let cluster_arr_we = [];
                let cluster_arr_w = [];
                _hotel.prices.map((dt, ix) => {
                  if (dt !== null) {
                    const day = moment(dt.date).format('dddd').substring(0, 3);
                    cluster_arr_w.push(
                      getClusterByPrice(dt.price[getPrice(dt.price)], ix) + 2
                    );
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
                    ratings={_hotel.ratings}
                    text={_hotel.hotelName}
                    prices={_hotel.prices}
                    mod_wd={mode(cluster_arr_wd)}
                    mod_we={mode(cluster_arr_we)}
                    mod_w={mode(cluster_arr_w)}
                  />
                );
              })()
            )}
          </GoogleMapReact>
        ) : (
          <></>
        )}
      </div>
    </Grid>
  );

  // return (
  //   <div className="mt-5" style={{ height: '100vh', width: '100%' }}>
  //     {hotels.length > 0 &&
  //     cluster1.length > 0 &&
  //     cluster2.length > 0 &&
  //     cluster3.length > 0 &&
  //     cluster4.length > 0 ? (
  //       <GoogleMapReact
  //         bootstrapURLKeys={{
  //           key: GOOGLE_MAP_KEY,
  //         }}
  //         yesIWantToUseGoogleMapApiInternals
  //         defaultCenter={defaultProps.center}
  //         defaultZoom={defaultProps.zoom}
  //         options={{
  //           styles: [
  //             {
  //               stylers: [{ saturation: 25 }, { gamma: 0.7 }],
  //             },
  //             {
  //               featureType: 'poi',
  //               elementType: 'labels.icon',
  //               stylers: [
  //                 {
  //                   visibility: 'off',
  //                 },
  //               ],
  //             },
  //           ],
  //         }}
  //         onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps, hotels)}
  //       >
  //         {hotels.map((_hotel, index) =>
  //           (() => {
  //             let cluster_arr_wd = [];
  //             let cluster_arr_we = [];
  //             _hotel.prices.map((dt, ix) => {
  //               if (dt !== null) {
  //                 const day = moment(dt.date).format('dddd').substring(0, 3);
  //                 if (day === 'Sat' || day === 'Fri') {
  //                   cluster_arr_we.push(
  //                     getClusterByPrice(dt.price[getPrice(dt.price)], ix) + 2
  //                   );
  //                 } else {
  //                   cluster_arr_wd.push(
  //                     getClusterByPrice(dt.price[getPrice(dt.price)], ix) + 2
  //                   );
  //                 }
  //               }
  //             });
  //             return (
  //               <AnyReactComponent
  //                 id={_hotel.hotelID}
  //                 lat={_hotel.location.lat}
  //                 lng={_hotel.location.lng}
  //                 stars={Math.floor(_hotel.stars)}
  //                 text={_hotel.hotelName}
  //                 prices={_hotel.prices}
  //                 mod_wd={mode(cluster_arr_wd)}
  //                 mod_we={mode(cluster_arr_we)}
  //               />
  //             );
  //           })()
  //         )}
  //       </GoogleMapReact>
  //     ) : (
  //       <></>
  //     )}
  //   </div>
  // );
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
