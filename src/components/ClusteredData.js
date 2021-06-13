import { Alert } from '@material-ui/lab';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchClusterData,
  fetchHotelData,
  fetchHotelsList,
  fetchRefreshDates,
} from '../redux/actions/cluster.actions';
import { LoadingOverlay } from './UI/LoadingOverlay';
import MomentUtils from '@date-io/moment';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import {
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  Select,
} from '@material-ui/core';
import moment from 'moment';
import HotelDataTable from './HotelDataTable';
import { Badge, Nav } from 'react-bootstrap';
import ClusterBucket from './ClusterBucket';
import { Graphs } from './Graphs';
import SimpleMap from './SimpleMap';
import ClusterDataTable from './ClusterDataTable';
import { CLUSTER_BACKGROUND, FONT_FAMILY } from '../utils/const';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  tabularNavStyle: {
    backgroundColor: '#516B8F',
  },
}));

export const ClusteredData = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [tab, setTab] = useState(3);

  const [selectedProperty, setSelectedProperty] = useState(0);

  const [selectedMarket, setSelectedMarket] = useState(0);

  const getClusterDataSet = useSelector((state) => state.clusterDataSet);
  const {
    clusterData,
    loading,
    err,
    cluster1,
    cluster2,
    cluster3,
    cluster4,
    hotels,
    hotelList,
    markets,
    refreshDates,
  } = getClusterDataSet;

  const auth = useSelector((state) => state.auth);
  const { user } = auth;

  const history = useHistory();

  const [selectedDate, setSelectedDate] = useState(
    moment(refreshDates.dates[0]).format('YYYY-MM-DD')
  );

  const handdleDatePicker = (date) => {
    setSelectedDate(moment(date).format('YYYY-MM-DD'));
  };

  const handlePropertyChange = (event) => {
    const option = event.target.value;
    if (option != -100) {
      setSelectedProperty(option);
    }
  };

  async function getHotelList(value) {
    await dispatch(fetchHotelsList(value));
  }

  const handleMarketChange = async (event) => {
    const option = event.target.value;
    if (option != -100) {
      setSelectedMarket(option);

      await getRefreshDates(option);

      await getHotelList(option);
    }
  };

  const getRefreshDates = async (value) => {
    await dispatch(fetchRefreshDates(value));
  };

  useEffect(() => {
    if (refreshDates.dates.length > 0) {
      setSelectedDate(moment(refreshDates.dates[0]).format('YYYY-MM-DD'));
    }
  }, [dispatch, refreshDates]);

  useEffect(() => {
    async function getClusters() {
      await dispatch(
        fetchClusterData(
          selectedMarket,
          moment().format('YYYY-MM-DD'),
          90,
          selectedProperty,
          selectedDate
        )
      );
    }

    async function getHotels() {
      await dispatch(
        fetchHotelData(
          selectedMarket,
          moment().format('YYYY-MM-DD'),
          90,
          selectedProperty,
          selectedDate
        )
      );
    }

    if (selectedMarket > 0 && selectedProperty > 0) {
      getClusters();
      getHotels();
    }
  }, [selectedDate, dispatch, selectedProperty]);

  const scroll = (to) => {
    const section = document.querySelector(to);
    if (section !== undefined && section != null) {
      section.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const disabledDates = (date) => {
    const refresh = refreshDates.dates.find(
      (element) =>
        moment(date).format('YYYY-MM-DD') ===
        moment(element).format('YYYY-MM-DD')
    );

    if (refresh !== undefined || refresh != null) {
      // console.log(refresh);
      return false;
    } else {
      return true;
    }
  };

  // useEffect(() => {
  //   const header = document.getElementById('main-header');
  //   const sticky = header.offsetTop;
  //   const scrollCallBack = window.addEventListener('scroll', () => {
  //     if (window.pageYOffset > sticky) {
  //       header.classList.add('sticky-header');
  //     } else {
  //       header.classList.remove('sticky-header');
  //     }
  //   });
  //   return () => {
  //     window.removeEventListener('scroll', scrollCallBack);
  //   };
  // }, []);

  const TabularNav = () => {
    const [tabularNavCls] = useState(
      'text-light border-bottom-0 border-secondary ' + classes.tabularNavStyle
    );
    return (
      <Nav variant="tabs">
        <Nav.Item>
          <Nav.Link
            className={tab === 3 ? tabularNavCls : 'text-dark'}
            eventKey="link-1"
            disabled={loading}
            onClick={() => setTab(3)}
          >
            Hotels Map
          </Nav.Link>{' '}
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            className={tab === 0 ? tabularNavCls : 'text-dark'}
            eventKey="link-0"
            disabled={loading}
            onClick={() => setTab(0)}
          >
            Clustered Buckets
          </Nav.Link>
        </Nav.Item>{' '}
        <Nav.Item>
          <Nav.Link
            className={tab === 1 ? tabularNavCls : 'text-dark'}
            eventKey="link-1"
            disabled={loading}
            onClick={() => setTab(1)}
          >
            Clustered Graphs
          </Nav.Link>
        </Nav.Item>{' '}
        <Nav.Item>
          <Nav.Link
            className={tab === 2 ? tabularNavCls : 'text-dark'}
            eventKey="link-1"
            disabled={loading}
            onClick={() => setTab(2)}
          >
            Hotels Rates
          </Nav.Link>
        </Nav.Item>{' '}
      </Nav>
    );
  };

  return (
    <div style={{ backgroundColor: 'white', fontFamily: 'Calibri' }}>
      <Grid>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Grid container justify="space-around" className="mb-3">
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="grouped-native-select">
                Destination
              </InputLabel>
              <Select
                native
                id="grouped-native-select"
                onChange={handleMarketChange}
                value={selectedMarket}
                style={{ backgroundColor: 'white', fontFamily: FONT_FAMILY }}
              >
                <option value={-100}>&nbsp;Destinations&nbsp;</option>
                {(() => {
                  if (markets.length > 0) {
                    if (user.role === 'admin' || user.role === 'manager') {
                      return markets.map((d, index) => (
                        <option value={d.id} key={index}>
                          &nbsp;{d.name}&nbsp;
                        </option>
                      ));
                    } else {
                      if (user.application.destinations.length > 0) {
                        const allowedMatrkets =
                          user.application.destinations.filter(({ id: id1 }) =>
                            markets.some(({ id: id2 }) => id2 === id1)
                          );
                        return allowedMatrkets.length > 0 ? (
                          allowedMatrkets.map((d, index) => (
                            <option value={d.id} key={index}>
                              &nbsp;{d.name}&nbsp;
                            </option>
                          ))
                        ) : (
                          <></>
                        );
                      }
                    }
                  }
                })()}
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="grouped-native-select">
                Select Property
              </InputLabel>
              <Select
                native
                id="grouped-native-select"
                onChange={handlePropertyChange}
                value={selectedProperty}
                style={{ backgroundColor: 'white', fontFamily: FONT_FAMILY }}
              >
                <option value={-100}>&nbsp;Properties&nbsp;</option>
                {(() => {
                  if (hotelList.length > 0) {
                    if (user.role === 'admin' || user.role === 'manager') {
                      return hotelList.map((d, index) => (
                        <option value={d.id} key={index}>
                          &nbsp;{d.name}&nbsp;
                        </option>
                      ));
                    } else {
                      if (user.application.properties.length > 0) {
                        const allowedProperties =
                          user.application.properties.filter(({ id: id1 }) =>
                            hotelList.some(({ id: id2 }) => id2 === id1)
                          );
                        return allowedProperties.length > 0 ? (
                          allowedProperties.map((d, index) => (
                            <option value={d.id} key={index}>
                              &nbsp;{d.name}&nbsp;
                            </option>
                          ))
                        ) : (
                          <></>
                        );
                      }
                    }
                  }
                })()}
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="YYYY-MM-DD"
                id="date-picker-inline"
                label="Refresh Date"
                value={selectedDate}
                shouldDisableDate={disabledDates}
                onChange={(date) => handdleDatePicker(date)}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                autoOk={true}
                style={{ fontFamily: FONT_FAMILY }}
                InputProps={{
                  style: {
                    fontFamily: FONT_FAMILY,
                  },
                }}
                //disabled
              />
            </FormControl>
            {/* 
          <FormControl className={classes.formControl}>
            <Button variant="outlined" size="small" color="dark">
              Fetch
            </Button>
          </FormControl> */}
          </Grid>
          <Grid container justify="space-around" className="mb-3">
            {/* <img src={img_star_bucktet} /> */}
            <div>
              <Badge
                className="p-2 cursor-pointer"
                style={{ backgroundColor: CLUSTER_BACKGROUND[3] }}
                onClick={() => scroll('#stars5')}
              >
                5 Star Cluster
              </Badge>{' '}
              <Badge
                className="p-2 cursor-pointer"
                style={{ backgroundColor: CLUSTER_BACKGROUND[2] }}
                onClick={() => scroll('#stars4')}
              >
                4 Star Cluster
              </Badge>{' '}
              <Badge
                className="p-2 cursor-pointer"
                style={{ backgroundColor: CLUSTER_BACKGROUND[1] }}
                onClick={() => scroll('#stars3')}
              >
                3 Star Cluster
              </Badge>{' '}
              <Badge
                className="p-2 cursor-pointer"
                style={{ backgroundColor: CLUSTER_BACKGROUND[0] }}
                onClick={() => scroll('#stars2')}
              >
                2 Star Cluster
              </Badge>{' '}
            </div>
          </Grid>
        </MuiPickersUtilsProvider>

        <TabularNav className="my-5" />
      </Grid>
      {loading ? (
        <LoadingOverlay show={loading} />
      ) : err !== null ? (
        <Alert severity="error">{err}</Alert>
      ) : clusterData.length > 0 && tab === 0 ? (
        <>
          <ClusterBucket />
          <div id="stars5" className="my-5">
            <ClusterDataTable cluster={cluster4} stars={5} />
          </div>
          <div id="stars4" className="my-5">
            <ClusterDataTable cluster={cluster3} stars={4} />
          </div>
          <div id="stars3" className="my-5">
            <ClusterDataTable cluster={cluster2} stars={3} />
          </div>
          <div id="stars2" className="my-5">
            <ClusterDataTable cluster={cluster1} stars={2} />
          </div>
        </>
      ) : clusterData.length > 0 && tab === 1 ? (
        <Graphs />
      ) : hotels.length > 0 && tab === 2 ? (
        <HotelDataTable selectedDate={moment().format('YYYY-MM-DD')} />
      ) : hotels.length > 0 && tab === 3 ? (
        <SimpleMap />
      ) : (
        <></>
      )}
    </div>
  );
};
