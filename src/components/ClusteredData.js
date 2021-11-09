import { Alert, Autocomplete } from '@material-ui/lab';
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
  TextField,
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
import BucketMovements from './BucketMovements';
import { CompareArrowsOutlined } from '@material-ui/icons';
import SimilarityScore from './SimilarityScore';
import SimilarityScoreWe from './SimilarityScoreWe';
import UnClusteredMatrix from './UnClusteredMatrix';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  tabularNavStyle: {
    backgroundColor: '#516B8F',
    fontFamily: FONT_FAMILY,
    fontWeight: 'bold',
  },
}));

export const ClusteredData = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [tab, setTab] = useState(-1);

  const [selectedProperty, setSelectedProperty] = useState(0);

  const [selectedMarket, setSelectedMarket] = useState(0);

  const [marketOptions, setMarketOptions] = useState([]);

  const [propertyOptions, setPropertyOptions] = useState([]);

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
  const { user, reports } = auth;

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

      if (reports.length > 0) {
        let property_opts = [];
        reports.map(async (rp) => {
          if (rp.destination == option) {
            property_opts.push(rp.property);
            // console.log(`report found: ${JSON.stringify(rp)}`);
          }
        });
        setSelectedProperty(property_opts[0]);
      }

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
    if (clusterData.length > 0) {
      setTab(4);
    }
  }, [dispatch, clusterData]);

  useEffect(() => {
    async function getClusters(market_id, property_id, report_date) {
      await dispatch(
        fetchClusterData(
          market_id,
          moment().format('YYYY-MM-DD'),
          90,
          property_id,
          report_date
        )
      );
    }

    async function getHotels(market_id, property_id, report_date) {
      await dispatch(
        fetchHotelData(
          market_id,
          moment().format('YYYY-MM-DD'),
          90,
          property_id,
          report_date
        )
      );
    }

    async function autoFetchproperties(mrkt) {
      // console.log(`selectedMarket: ${mrkt}`);
      await dispatch(fetchHotelsList(mrkt));
    }

    if (reports.length > 0) {
      setSelectedMarket(reports[0].destination);
      setSelectedProperty(reports[0].property);

      getClusters(
        reports[0].destination,
        reports[0].property,
        reports[0].report_date
      );
      getHotels(
        reports[0].destination,
        reports[0].property,
        reports[0].report_date
      );

      autoFetchproperties(reports[0].destination);
    }
  }, []);

  const get_market_by_id = (id) => {
    const market = markets.find((m) => m.id == id);
    return market;
  };

  useEffect(() => {
    const setMarketOptionsHook = async () => {
      // console.log(user, reports);
      if (reports.length > 0) {
        const reports_temp = [];
        reports.map(async (rp) => {
          // console.log(`market found: ${get_market_by_id(rp.destination)}`);
          reports_temp.push(get_market_by_id(rp.destination));
        });

        const market_opts = [...new Set(reports_temp)];

        setMarketOptions(market_opts);
        // console.log('marketOptions: ' + JSON.stringify(reports_temp));
      }
    };

    const setPropertyOptionsHook = async () => {
      // console.log(user, reports);
      if (reports.length > 0) {
        const property_arr = [];
        const reports_temp = reports.map(async (rp) => {
          property_arr.push(rp.property);
        });
        setPropertyOptions([...new Set(property_arr)]);
        // console.log('PropertiesOptions: ' + propertyOptions);
      }
    };

    setMarketOptionsHook();
    setPropertyOptionsHook();
  }, []);

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

  const TabularNav = () => {
    const [tabularNavCls] = useState(
      'text-light border-bottom-0 border-secondary ' + classes.tabularNavStyle
    );
    return (
      <Nav variant="tabs" justify="space-around">
        <Nav.Item>
          <Nav.Link
            className={tab === 4 ? tabularNavCls : 'text-dark font-weight-bold'}
            eventKey="link-1"
            disabled={loading}
            onClick={() => setTab(4)}
          >
            Hotels Map
          </Nav.Link>{' '}
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            className={tab === 0 ? tabularNavCls : 'text-dark font-weight-bold'}
            eventKey="link-0"
            disabled={loading}
            onClick={() => setTab(0)}
          >
            Rate Buckets
          </Nav.Link>
        </Nav.Item>{' '}
        {/* <Nav.Item>
          <Nav.Link
            className={tab === 7 ? tabularNavCls : 'text-dark font-weight-bold'}
            eventKey="link-1"
            disabled={loading}
            onClick={() => setTab(7)}
          >
            Unclustered Matrix
          </Nav.Link>
        </Nav.Item>{' '} */}
        <Nav.Item>
          <Nav.Link
            className={tab === 1 ? tabularNavCls : 'text-dark font-weight-bold'}
            eventKey="link-0"
            disabled={loading}
            onClick={() => setTab(1)}
          >
            Bucket Movements
          </Nav.Link>
        </Nav.Item>{' '}
        <Nav.Item>
          <Nav.Link
            className={tab === 2 ? tabularNavCls : 'text-dark font-weight-bold'}
            eventKey="link-1"
            disabled={loading}
            onClick={() => setTab(2)}
          >
            Visuals
          </Nav.Link>
        </Nav.Item>{' '}
        <Nav.Item>
          <Nav.Link
            className={tab === 3 ? tabularNavCls : 'text-dark font-weight-bold'}
            eventKey="link-1"
            disabled={loading}
            onClick={() => setTab(3)}
          >
            Hotel RADAR
          </Nav.Link>
        </Nav.Item>{' '}
        <Nav.Item>
          <Nav.Link
            className={tab === 5 ? tabularNavCls : 'text-dark font-weight-bold'}
            eventKey="link-1"
            disabled={loading}
            onClick={() => setTab(5)}
          >
            Similarity - Weekdays
          </Nav.Link>
        </Nav.Item>{' '}
        <Nav.Item>
          <Nav.Link
            className={tab === 6 ? tabularNavCls : 'text-dark font-weight-bold'}
            eventKey="link-1"
            disabled={loading}
            onClick={() => setTab(6)}
          >
            Similarity - Weekends
          </Nav.Link>
        </Nav.Item>
      </Nav>
    );
  };

  return (
    <div style={{ backgroundColor: 'white', fontFamily: FONT_FAMILY }}>
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
                  if (marketOptions.length > 0) {
                    // if (user.role === 'admin' || user.role === 'manager') {
                    return marketOptions.map((d, index) => (
                      // setMarketOptions([...marketOptions, d.name]),
                      <option value={d.id} key={index}>
                        &nbsp;{d.name}&nbsp;
                      </option>
                    ));
                  }
                  //  else {
                  //   if (user.application.destinations.length > 0) {
                  //     const allowedMatrkets =
                  //       user.application.destinations.filter(({ id: id1 }) =>
                  //         markets.some(({ id: id2 }) => id2 === id1)
                  //       );
                  //     return allowedMatrkets.length > 0 ? (
                  //       allowedMatrkets.map((d, index) => (
                  //         // setMarketOptions([...marketOptions, d.name]),
                  //         <option value={d.id} key={index}>
                  //           &nbsp;{d.name}&nbsp;
                  //         </option>
                  //       ))
                  //     ) : (
                  //       <></>
                  //     );
                  //   }
                  // }
                  // }
                })()}
              </Select>
              {/* <Autocomplete
                sx={{ width: 300 }}
                value={selectedMarket}
                disableClearable
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => handleMarketChange(newValue.id)}
                id="controllable-states-demo"
                options={marketOptions}
                renderInput={(params) => (
                  <TextField {...params} label="Destination" />
                )}
              /> */}
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
                    // if (user.role === 'admin' || user.role === 'manager') {
                    //   return hotelList.map((d, index) => (
                    //     <option value={d.id} key={index}>
                    //       &nbsp;{d.name}&nbsp;
                    //     </option>
                    //   ));
                    // } else {
                    if (propertyOptions.length > 0) {
                      // const allowedProperties = propertyOptions.filter((op) =>
                      //   hotelList.some(({ id: id2 }) => id2 === op)
                      // );
                      const allowedProperties = hotelList.filter((o1) =>
                        propertyOptions.some((o2) => o1.id === o2)
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
                    // }
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

            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="grouped-native-select">Currency</InputLabel>
              <Select
                native
                id="grouped-native-select"
                onChange={handlePropertyChange}
                style={{ backgroundColor: 'white', fontFamily: FONT_FAMILY }}
                disabled
              >
                {selectedMarket == 457987 ? (
                  <option>&nbsp;EUR&nbsp;</option>
                ) : (
                  <option>&nbsp;USD&nbsp;</option>
                )}
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="grouped-native-select">Source</InputLabel>
              <Select
                native
                id="grouped-native-select"
                onChange={handlePropertyChange}
                style={{ backgroundColor: 'white', fontFamily: FONT_FAMILY }}
                disabled
              >
                <option>Expedia</option>
              </Select>
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
                5 Star Bucket
              </Badge>{' '}
              <Badge
                className="p-2 cursor-pointer"
                style={{ backgroundColor: CLUSTER_BACKGROUND[2] }}
                onClick={() => scroll('#stars4')}
              >
                4 Star Bucket
              </Badge>{' '}
              <Badge
                className="p-2 cursor-pointer"
                style={{ backgroundColor: CLUSTER_BACKGROUND[1] }}
                onClick={() => scroll('#stars3')}
              >
                3 Star Bucket
              </Badge>{' '}
              <Badge
                className="p-2 cursor-pointer"
                style={{ backgroundColor: CLUSTER_BACKGROUND[0] }}
                onClick={() => scroll('#stars2')}
              >
                2 Star Bucket
              </Badge>{' '}
              <Badge
                className="p-2 cursor-pointer"
                style={{ backgroundColor: '#9E9E9E' }}
                // onClick={() => scroll('#stars2')}
              >
                Outliers
              </Badge>
            </div>
          </Grid>
        </MuiPickersUtilsProvider>

        <TabularNav />
      </Grid>
      {loading ? (
        <LoadingOverlay show={loading} />
      ) : err !== null ? (
        <Alert severity="error">{err}</Alert>
      ) : clusterData.length > 0 && tab === 0 ? (
        <>
          <ClusterBucket selectedDate={selectedDate} />
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
      ) : // : clusterData.length > 0 && tab === 7 ? (
      //   <>
      //     <div id="stars5" className="my-5">
      //       <UnClusteredMatrix cluster={cluster4} stars={5} />
      //     </div>
      //     <div id="stars4" className="my-5">
      //       <UnClusteredMatrix cluster={cluster3} stars={4} />
      //     </div>
      //     <div id="stars3" className="my-5">
      //       <UnClusteredMatrix cluster={cluster2} stars={3} />
      //     </div>
      //     <div id="stars2" className="my-5">
      //       <UnClusteredMatrix cluster={cluster1} stars={2} />
      //     </div>
      //   </>
      // )
      clusterData.length > 0 && tab === 1 ? (
        <BucketMovements selectedDate={selectedDate} />
      ) : clusterData.length > 0 && tab === 2 ? (
        <Graphs selectedDate={selectedDate} />
      ) : hotels.length > 0 && tab === 3 ? (
        <HotelDataTable selectedDate={selectedDate} />
      ) : hotels.length > 0 && tab === 4 ? (
        <SimpleMap />
      ) : hotels.length > 0 && tab === 5 ? (
        <SimilarityScore selectedDate={selectedDate} />
      ) : hotels.length > 0 && tab === 6 ? (
        <SimilarityScoreWe selectedDate={selectedDate} />
      ) : (
        <></>
      )}
    </div>
  );
};
