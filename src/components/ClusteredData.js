import { Alert } from '@material-ui/lab';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClusterData } from '../redux/actions/cluster.actions';
import DataTable from './DataTable';
import { LoadingOverlay } from './UI/LoadingOverlay';
import MomentUtils from '@date-io/moment';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { Grid } from '@material-ui/core';
import moment from 'moment';

export const ClusteredData = () => {
  const dispatch = useDispatch();
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
  } = getClusterDataSet;

  const handdleDatePicker = (date) => {
    setSelectedDate(moment(date).format('YYYY-MM-DD'));
  };

  useEffect(() => {
    dispatch(fetchClusterData('1447930', selectedDate));
  }, [selectedDate, dispatch]);

  return (
    <div>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Grid container justify="space-around">
          <h1>Clustered Hotel Rates</h1>
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
      {loading ? (
        <LoadingOverlay show={loading} />
      ) : err ? (
        <Alert severity="error">{err}</Alert>
      ) : clusterData.length > 0 ? (
        <>
          <DataTable cluster={cluster4} stars={5} />
          <DataTable cluster={cluster3} stars={4} />
          <DataTable cluster={cluster2} stars={3} />
          <DataTable cluster={cluster1} stars={2} />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};
