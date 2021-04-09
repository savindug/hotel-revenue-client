import { Alert } from '@material-ui/lab';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchClusterData,
  fetchHotelData,
} from '../redux/actions/cluster.actions';
import DataTable from './DataTable';
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
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ClusterBucket from './ClusterBucket';
import { Graphs } from './Graphs';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

export const ClusteredData = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [tab, setTab] = useState(0);
  const [selectedDate, setSelectedDate] = useState(
    moment().format('YYYY-MM-DD')
  );
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
  } = getClusterDataSet;

  const handdleDatePicker = (date) => {
    setSelectedDate(moment(date).format('YYYY-MM-DD'));
  };

  useEffect(() => {}, []);

  useEffect(() => {
    async function getClusters() {
      await dispatch(
        fetchClusterData(
          1447930,
          moment(selectedDate).subtract(90, 'd').format('YYYY-MM-DD'),
          90,
          106399
        )
      );
    }

    // async function getHotels() {
    //   await dispatch(fetchHotelData('1447930', selectedDate, 90));
    // }
    getClusters();
    // getHotels();
  }, [selectedDate, dispatch]);

  const TabularNav = () => {
    const [tabularNavCls] = useState(
      'bg-secondary text-light border-bottom-0 border-secondary'
    );
    return (
      <Nav variant="tabs">
        <Nav.Item>
          <Nav.Link
            className={tab === 0 ? tabularNavCls : 'text-dark'}
            eventKey="link-0"
            disabled={loading}
            onClick={() => setTab(0)}
          >
            Clustered Matrix
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            className={tab === 1 ? tabularNavCls : 'text-dark'}
            eventKey="link-1"
            disabled={loading}
            onClick={() => setTab(1)}
          >
            Clustered Graphs
          </Nav.Link>
        </Nav.Item>
      </Nav>
    );
  };

  return (
    <div>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Grid container justify="space-around">
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="grouped-native-select">
              Destination ID
            </InputLabel>
            <Select native defaultValue="" id="grouped-native-select">
              <option value={1447930}>1447930</option>
              {/* <optgroup label="Category 1">
                <option value={1}>Option 1</option>
                <option value={2}>Option 2</option>
              </optgroup>
              <optgroup label="Category 2">
                <option value={3}>Option 3</option>
                <option value={4}>Option 4</option>
              </optgroup> */}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="grouped-native-select">
              Select Property
            </InputLabel>
            <Select native defaultValue="" id="grouped-native-select">
              <option value={106399}>106399</option>
            </Select>
          </FormControl>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="YYYY-MM-DD"
            margin="normal"
            id="date-picker-inline"
            label="Select the Date"
            maxDate={new Date()}
            value={selectedDate}
            onChange={(date) => handdleDatePicker(date)}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            autoOk={true}
          />
        </Grid>
      </MuiPickersUtilsProvider>

      <TabularNav />
      {loading ? (
        <LoadingOverlay show={loading} />
      ) : err ? (
        <Alert severity="error">{err}</Alert>
      ) : clusterData.length > 0 && tab === 0 ? (
        <>
          <ClusterBucket />
          <DataTable cluster={cluster4} stars={5} />
          <DataTable cluster={cluster3} stars={4} />
          <DataTable cluster={cluster2} stars={3} />
          <DataTable cluster={cluster1} stars={2} />
        </>
      ) : clusterData.length > 0 && tab === 1 ? (
        <Graphs />
      ) : (
        <></>
      )}
    </div>
  );
};
