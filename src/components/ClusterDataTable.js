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
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
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

export default function ClusterDataTable({ cluster, stars, selectedDate }) {
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
      let midAvgArr = [];
      cluster.map((e) => {
        if (e.midAVG != 'NaN') {
          midAvgArr.push(Math.round(e.midAVG));
        }
      });
      const sd = getStandardDeviation(midAvgArr);

      const avg = midAvgArr.reduce((a, b) => a + b) / midAvgArr.length;

      let _rateStrength = [];

      cluster.map((e, index) => {
        if (e.mean >= avg + 2 * sd) {
          _rateStrength.push('Very High');
        }
        if (e.mean >= avg + 1 * sd && e.mean < avg + 2 * sd) {
          _rateStrength.push('High');
        }
        if (e.mean >= avg - 1 * sd && e.mean < avg + 1 * sd) {
          _rateStrength.push('');
        }
        if (e.mean >= avg - 2 * sd && e.mean < avg - 1 * sd) {
          _rateStrength.push('Low');
        }
        if (e.mean <= avg - 2 * sd) {
          _rateStrength.push('Very Low');
        }
      });

      // console.log(`Bucket: ${stars} star sd: ${sd}, avg: ${avg},`);

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

  const getReportName = () => {
    let name = null;
    if (reqHotel.length > 0) {
      reqHotel.map((e, index) => {
        if (e.name !== null) {
          name = e.name;
          return;
        }
      });
    }

    return `${name}-Rate_Buckets-Cluster-${stars}-${moment(selectedDate).format(
      'YYYY-MM-DD'
    )}`;
  };

  return (
    <>
      {!load && rateStrength.length > 0 && cluster.length > 0 ? (
        <TableContainer component={Paper} className="my-5">
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <ReactHTMLTableToExcel
              className="btn btn-success download-table-xls-button"
              table={`clusters-${stars}-to-xls`}
              filename={getReportName()}
              sheet={getReportName()}
              buttonText="Export to XLS"
            />
          </div>
          <Box width={100}>
            <Table
              id={`clusters-${stars}-to-xls`}
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
                    className={classes.sticky + ' p-2'}
                    style={{ fontSize: '15px', width: '250px' }}
                  >
                    <span className="font-italic font-weight-bold">
                      Rate Strength Exception
                    </span>
                  </StyledTableCell>

                  {rateStrength.map((e, index) => (
                    <StyledTableCell
                      size="small"
                      key={index}
                      style={{ fontSize: '10px' }}
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
        // <LoadingOverlay show={load} />
        <></>
      )}
    </>
  );
}
