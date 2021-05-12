import { Alert } from '@material-ui/lab';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchClusterData,
  fetchHotelData,
  fetchHotelsList,
  fetchMarkets,
} from '../redux/actions/cluster.actions';
import { LoadingOverlay } from './UI/LoadingOverlay';
import MomentUtils from '@date-io/moment';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  Select,
} from '@material-ui/core';
import moment from 'moment';
import HotelDataTable from './HotelDataTable';
import { Badge, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ClusterBucket from './ClusterBucket';
import { Graphs } from './Graphs';
import img_star_bucktet from '../assets/imgs/star-buckets.png';
import SimpleMap from './SimpleMap';
import ClusterDataTable from './ClusterDataTable';
import { CLUSTER_BACKGROUND } from '../utils/const';

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
  const [selectedDate, setSelectedDate] = useState(
    moment().format('YYYY-MM-DD')
  );
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
  } = getClusterDataSet;

  const auth = useSelector((state) => state.auth);
  const { user, auth_loading, auth_err, isLoggedIn } = auth;

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

      await getHotelList(option);
    }
  };

  useEffect(() => {
    async function getMarkets() {
      await dispatch(fetchMarkets());
    }
    getMarkets();
    console.log('selected market => ' + selectedMarket);
  }, [dispatch]);

  useEffect(() => {
    async function getClusters() {
      await dispatch(
        fetchClusterData(selectedMarket, selectedDate, 90, selectedProperty)
      );
    }

    async function getHotels() {
      await dispatch(
        fetchHotelData(selectedMarket, selectedDate, 90, selectedProperty)
      );
    }

    if (selectedMarket > 0 && selectedProperty > 0) {
      getClusters();
      getHotels();
    }
  }, [selectedDate, dispatch, selectedProperty]);

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
            Clustered Matrix
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
    <div>
      <Grid className="position-relative">
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Grid container justify="space-around" className="mb-3">
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="grouped-native-select">
                Destination
              </InputLabel>
              <Select
                native
                defaultValue=""
                id="grouped-native-select"
                onChange={handleMarketChange}
                value={selectedMarket}
              >
                <option value={-100}>Destinations</option>
                {(() => {
                  if (markets.length > 0) {
                    if (user.role === 'admin' || user.role === 'manager') {
                      return markets.map((d, index) => (
                        <option value={d.id} key={index}>
                          {d.id} | {d.name}
                        </option>
                      ));
                    } else {
                      if (user.application.destinations.length > 0) {
                        const allowedMatrkets =
                          user.application.destinations.filter(({ id: id1 }) =>
                            markets.some(({ id: id2 }) => id2 === id1)
                          );
                        console.log('allowedMatrkets => ' + allowedMatrkets);
                        return allowedMatrkets.length > 0 ? (
                          allowedMatrkets.map((d, index) => (
                            <option value={d.id} key={index}>
                              {d.id} | {d.name}
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
                defaultValue=""
                id="grouped-native-select"
                onChange={handlePropertyChange}
                value={selectedProperty}
              >
                {/* {selectedMarket === 1447930 ? (
                  <option value={106399}>The Palms Hotel & Spa</option>
                ) : selectedMarket === 1535616 ? (
                  <option value={454244}>
                    Hilton Garden Inn New York-Times Square Central
                  </option>
                ) : (
                  <></>
                )} */}
                <option value={-100}>Properties</option>
                {(() => {
                  if (hotelList.length > 0) {
                    if (user.role === 'admin' || user.role === 'manager') {
                      return hotelList.map((d, index) => (
                        <option value={d.id} key={index}>
                          {d.id} | {d.name}
                        </option>
                      ));
                    } else {
                      if (user.application.properties.length > 0) {
                        const allowedProperties =
                          user.application.properties.filter(({ id: id1 }) =>
                            hotelList.some(({ id: id2 }) => id2 === id1)
                          );
                        console.log('allowedMatrkets => ' + allowedProperties);
                        return allowedProperties.length > 0 ? (
                          allowedProperties.map((d, index) => (
                            <option value={d.id} key={index}>
                              {d.id} | {d.name}
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
                label="Select the Date"
                value={selectedDate}
                onChange={(date) => handdleDatePicker(date)}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                autoOk={true}
                disabled
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
                className="p-2"
                style={{ backgroundColor: CLUSTER_BACKGROUND[3] }}
              >
                5 Star Cluster
              </Badge>{' '}
              <Badge
                className="p-2"
                style={{ backgroundColor: CLUSTER_BACKGROUND[2] }}
              >
                4 Star Cluster
              </Badge>{' '}
              <Badge
                className="p-2"
                style={{ backgroundColor: CLUSTER_BACKGROUND[1] }}
              >
                3 Star Cluster
              </Badge>{' '}
              <Badge
                className="p-2"
                style={{ backgroundColor: CLUSTER_BACKGROUND[0] }}
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
          <ClusterDataTable cluster={cluster4} stars={5} />
          <ClusterDataTable cluster={cluster3} stars={4} />
          <ClusterDataTable cluster={cluster2} stars={3} />
          <ClusterDataTable cluster={cluster1} stars={2} />
        </>
      ) : clusterData.length > 0 && tab === 1 ? (
        <Graphs />
      ) : hotels.length > 0 && tab === 2 ? (
        <HotelDataTable selectedDate={selectedDate} />
      ) : hotels.length > 0 && tab === 3 ? (
        <SimpleMap />
      ) : (
        <></>
      )}
    </div>
  );
};
