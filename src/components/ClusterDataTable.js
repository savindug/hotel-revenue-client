import {
  Box,
  makeStyles,
  TableCell,
  TableContainer,
  TableRow,
  TableSortLabel,
  withStyles,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import { CLUSTER_BACKGROUND, FONT_FAMILY } from '../utils/const';
import { LoadingOverlay } from './UI/LoadingOverlay';
import { useSelector } from 'react-redux';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
    fontWeight: 'bolder',
  },
  body: {
    fontSize: 15,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);
const useStyles = makeStyles({
  table: {
    '& .MuiTableCell-root': {
      borderLeft: '1px solid rgba(224, 224, 224, 1)',
    },
  },
  sticky: {
    position: 'sticky',
    left: 0,
    background: 'white',
    boxShadow: '2px 2px 2px grey',
    display: 'block',
  },
  rates: {
    fontFamily: FONT_FAMILY,
  },
});

export default function ClusterDataTable({ cluster, stars }) {
  const classes = useStyles();

  const getClusterDataSet = useSelector((state) => state.clusterDataSet);
  const { loading, reqHotel } = getClusterDataSet;

  const [load, setLoad] = useState(true);

  const [rateStrength, setRateStrength] = useState([]);

  useEffect(() => {
    //setStars((cluster.index += 2));
    setLoad(true);
    //console.log(`no of Hotels length : ${noOfHotels.length} => ${noOfHotels}`);

    function getStandardDeviation(array) {
      if (array.length === 0) {
        return 0;
      }
      const n = array.length;
      const mean = array.reduce((a, b) => a + b) / n;
      return Math.sqrt(
        array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n
      );
    }

    const rateStrengthHandler = () => {
      const midAvgArr = cluster.map((e) =>
        e.midAVG != 'NaN' ? Math.round(e.midAVG) : 0
      );
      const sd = getStandardDeviation(midAvgArr);

      const avg = midAvgArr.reduce((a, b) => a + b) / midAvgArr.length;

      let _rateStrength = [];

      reqHotel.map((e, index) => {
        if (e.rate >= avg + 2 * sd) {
          _rateStrength.push('Very High');
        }
        if (e.rate >= avg + 1 * sd && e.rate < avg + 2 * sd) {
          _rateStrength.push('High');
        }
        if (e.rate >= avg - 1 * sd && e.rate < avg + 1 * sd) {
          _rateStrength.push('Low');
        }
        if (e.rate >= avg - 2 * sd && e.rate < avg - 1 * sd) {
          _rateStrength.push('Very Low');
        }
      });

      // console.log(
      //   `_rateStrength: ${_rateStrength}, sd: ${sd}, avg: ${avg}, midAvgArr.length: ${midAvgArr.length}, midAvgArr: ${midAvgArr}`
      // );

      setRateStrength(_rateStrength);
    };

    if (cluster.length > 0 && reqHotel.length > 0) {
      rateStrengthHandler();
    }

    setLoad(false);
  }, []);

  return (
    <>
      {!load && rateStrength.length > 0 ? (
        <TableContainer component={Paper} className="my-5">
          <Box width={100}>
            <Table
              className={classes.table}
              size="medium"
              aria-label="customized table"
              bodyStyle={{ overflow: 'visible' }}
            >
              <TableHead>
                <StyledTableCell
                  style={{
                    backgroundColor: CLUSTER_BACKGROUND[stars - 2],
                  }}
                  className={classes.sticky}
                >
                  <TableSortLabel disabled>
                    {' '}
                    {`${stars} Star Bucket Matrix`}
                  </TableSortLabel>{' '}
                  <hr />
                  <TableSortLabel disabled> Days Out</TableSortLabel>
                </StyledTableCell>
                {cluster.map((e, index) =>
                  (() => {
                    let date = moment(e.date).format('dddd').substring(0, 3);
                    return (
                      <StyledTableCell
                        size="small"
                        key={index}
                        className={
                          date === 'Sat' || date === 'Fri'
                            ? 'bg-secondary text-light text-center'
                            : 'text-center'
                        }
                        style={{ fontSize: '12px' }}
                      >
                        {`${date.toUpperCase()}\n${moment(e.date).format(
                          'MM/DD'
                        )}`}{' '}
                        <hr />
                        {index}
                      </StyledTableCell>
                    );
                  })()
                )}
              </TableHead>
              <TableBody>
                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className={classes.sticky}
                    style={{ fontSize: '14px', width: '250px' }}
                  >
                    <span className="font-italic font-weight-bold">
                      Rate Strength Exception for 90 Days
                    </span>
                  </StyledTableCell>

                  {rateStrength.map((e, index) => (
                    <StyledTableCell
                      size="small"
                      key={index}
                      style={{ fontSize: '12px' }}
                    >
                      <span className="">{e}</span>
                    </StyledTableCell>
                  ))}
                </StyledTableRow>

                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className={classes.sticky}
                    style={{ fontWeight: 'bold', width: '250px' }}
                  >
                    Average Rate
                  </StyledTableCell>

                  {cluster.map((e, index) => (
                    <StyledTableCell
                      size="small"
                      key={index}
                      className={classes.rates}
                    >
                      {e.mean !== 'NaN' && e.items > 0
                        ? Math.round(e.mean)
                        : e.mean !== 'NaN' && e.items < 0
                        ? 'NED'
                        : 'N/A'}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>

                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className={classes.sticky}
                    style={{ fontWeight: 'bold', width: '250px' }}
                  >
                    Most Repeated rate
                  </StyledTableCell>

                  {cluster.map((e, index) => (
                    <StyledTableCell
                      size="small"
                      key={index}
                      className={classes.rates}
                    >
                      {e.mod !== 'NaN' && e.items > 0
                        ? Math.round(e.mod)
                        : e.mod !== 'NaN' && e.items < 0
                        ? 'NED'
                        : 'N/A'}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>

                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className={classes.sticky}
                    style={{ fontWeight: 'bold', width: '250px' }}
                  >
                    Middle Rate
                  </StyledTableCell>

                  {cluster.map((e, index) => (
                    <StyledTableCell
                      size="small"
                      key={index}
                      className={classes.rates}
                    >
                      {e.median !== 'NaN' && e.items > 0
                        ? Math.round(e.median)
                        : e.median !== 'NaN' && e.items < 0
                        ? 'NED'
                        : 'N/A'}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className={classes.sticky}
                    style={{ fontWeight: 'bold', width: '250px' }}
                  >
                    &emsp;Highest Rate
                  </StyledTableCell>

                  {cluster.map((e, index) => (
                    <StyledTableCell
                      size="small"
                      key={index}
                      className={classes.rates}
                    >
                      {e.max !== 'NaN' && e.items > 0
                        ? Math.round(e.max)
                        : e.max !== 'NaN' && e.items < 0
                        ? 'NED'
                        : 'N/A'}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className={classes.sticky}
                    style={{
                      fontWeight: 'bold',
                      width: '250px',
                      borderTop: '2px solid grey',
                    }}
                  >
                    &emsp;&emsp;Average of Highest Rates
                  </StyledTableCell>

                  {cluster.map((e, index) => (
                    <StyledTableCell
                      size="small"
                      key={index}
                      className={classes.rates}
                      style={{
                        borderTop: '3px solid grey',
                      }}
                    >
                      {e.highAVG !== 'NaN' && e.items > 0
                        ? Math.round(e.highAVG)
                        : e.highAVG !== 'NaN' && e.items < 0
                        ? 'NED'
                        : 'N/A'}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className={classes.sticky}
                    style={{ fontWeight: 'bold', width: '250px' }}
                  >
                    &emsp;&emsp;Average of Middle Rates
                  </StyledTableCell>

                  {cluster.map((e, index) => (
                    <StyledTableCell
                      size="small"
                      key={index}
                      className={classes.rates}
                    >
                      {e.midAVG !== 'NaN' && e.items > 0
                        ? Math.round(e.midAVG)
                        : e.midAVG !== 'NaN' && e.items < 0
                        ? 'NED'
                        : 'N/A'}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className={classes.sticky}
                    style={{
                      fontWeight: 'bold',
                      width: '250px',
                      borderBottom: '3px solid grey',
                    }}
                  >
                    &emsp;&emsp;Average of Lowest Rates
                  </StyledTableCell>

                  {cluster.map((e, index) => (
                    <StyledTableCell
                      size="small"
                      key={index}
                      className={classes.rates}
                      style={{
                        borderBottom: '3px solid grey',
                      }}
                    >
                      {e.lowAVG !== 'NaN' && e.items > 0
                        ? Math.round(e.lowAVG)
                        : e.lowAVG !== 'NaN' && e.items < 0
                        ? 'NED'
                        : 'N/A'}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className={classes.sticky}
                    style={{ fontWeight: 'bold', width: '250px' }}
                  >
                    &emsp;Lowest Rate
                  </StyledTableCell>

                  {cluster.map((e, index) => (
                    <StyledTableCell
                      size="small"
                      key={index}
                      className={classes.rates}
                    >
                      {e.min !== 'NaN' && e.items > 0
                        ? Math.round(e.min)
                        : e.min !== 'NaN' && e.items < 0
                        ? 'NED'
                        : 'N/A'}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              </TableBody>
            </Table>
            <br />
          </Box>
        </TableContainer>
      ) : (
        <LoadingOverlay show={load} />
      )}
    </>
  );
}
