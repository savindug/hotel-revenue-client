import {
  makeStyles,
  TableBody,
  TableContainer,
  TableCell,
  TableRow,
  TableSortLabel,
  withStyles,
  Box,
} from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Nav } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { FONT_FAMILY } from '../utils/const';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  tabularNavStyle: {
    backgroundColor: '#607D8B',
    fontFamily: FONT_FAMILY,
    fontWeight: 'bold',
  },
  container: {
    maxHeight: window.innerHeight - 275,
  },
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
    display: 'flex',
  },
  rates: {
    fontFamily: FONT_FAMILY,
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
    fontWeight: 'bold',
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

export const EuclidianDistance = ({ selectedDate }) => {
  const classes = useStyles();

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
    reqHotel,
  } = getClusterDataSet;

  const [hotelsEU, setHotelsEU] = useState([]);

  const tableRef = useRef(null);

  const getClusterByPrice = (rate, ix) => {
    let clustered = [];
    let res;

    if (cluster1.length > 0 && cluster1[ix]) {
      clustered.push(cluster1[ix]);
    }
    if (cluster2.length > 0 && cluster2[ix]) {
      clustered.push(cluster2[ix]);
    }
    if (cluster3.length > 0 && cluster3[ix]) {
      clustered.push(cluster3[ix]);
    }
    if (cluster4.length > 0 && cluster4[ix]) {
      clustered.push(cluster4[ix]);
    }

    clustered.sort((a, b) => a.mean - b.mean);

    // console.log(clustered);

    try {
      clustered.map((cl, id) => {
        if (rate >= cl.min && rate <= cl.max) {
          res = id;
          return;
        }
      });
    } catch (e) {}

    return res;
  };

  const getPrice = (arr) => {
    const price = arr.findIndex((e) => e > 0);
    return price;
  };

  const calculateDistance = (p1, p2) => {
    var b = p2.cluster - p1.cluster;
    var c = p2.ratings - p1.ratings;
    var d = p2.rate - p1.rate;

    return Math.sqrt(b * b + c * c + d * d);

    // return Math.abs(p2.rate - p1.rate);
  };

  const [times, setTimes] = useState(0);

  useEffect(() => {
    const getED = () => {
      let new_h = [];
      [...Array(30).keys()].map((d, i) => {
        hotels.map((_hotel, id) => {
          if (_hotel.prices[i] != null) {
            let p1 = {
              cluster: getClusterByPrice(reqHotel[i].rate, i),
              rate: reqHotel[i].rate,
              ratings: reqHotel[i].raings,
            };

            let p2 = {
              cluster: getClusterByPrice(
                _hotel.prices[i].price[getPrice(_hotel.prices[i].price)],
                i
              ),
              rate: _hotel.prices[i].price[getPrice(_hotel.prices[i].price)],
              ratings: _hotel.ratings,
            };

            _hotel.prices[i].euclidean_distance = parseFloat(
              calculateDistance(p2, p1)
            ).toFixed(2);

            new_h.push(_hotel);
          }
        });
      });
      setTimes(times + 1);
    };

    if (hotels.length > 0 && times < 1) {
      getED();
    }
  }, []);

  const mode = (arr) => {
    return arr
      .sort(
        (a, b) =>
          arr.filter((v) => v === a).length - arr.filter((v) => v === b).length
      )
      .pop();
  };

  return (
    <>
      {hotels.length > 0 ? (
        <>
          {' '}
          <button onclick="exportTableToCSV('EuclidianDistances.csv')">
            Export HTML Table To CSV File
          </button>
          <TableContainer
            component={Paper}
            className={classes.container + ' mt-3'}
          >
            <Box width={100}>
              <Table
                id="table-to-xls"
                className={classes.table}
                size="medium"
                aria-label="customized table"
                stickyHeader
                bodystyle={{ overflow: 'visible' }}
              >
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell size="small">#</StyledTableCell>
                    <StyledTableCell
                      style={{
                        fontWeight: 'bold',
                        width: '250px',
                        zIndex: 100,
                        fontFamily: FONT_FAMILY,
                      }}
                    >
                      Hotel Name
                      <hr />
                      <TableSortLabel disabled>Days Out</TableSortLabel>
                    </StyledTableCell>
                    <StyledTableCell>Stars</StyledTableCell>
                    <StyledTableCell className="text-center">
                      Freq Bucket
                    </StyledTableCell>
                    <StyledTableCell>Ratings</StyledTableCell>
                    {cluster1.map((e, i) =>
                      (() => {
                        if (i <= 30) {
                          let _date = moment(e.date);
                          let daysOut = _date.diff(selectedDate, 'days');
                          let day = _date.format('dddd').substring(0, 3);

                          // console.log('selectedDate+: ' + date + ', day: ' + day);
                          return (
                            <StyledTableCell
                              size="small"
                              key={i}
                              className={
                                day === 'Sat' || day === 'Fri'
                                  ? 'bg-secondary text-light text-center '
                                  : 'text-center '
                              }
                              style={{ fontSize: '12px' }}
                            >
                              {`${
                                day === 'Sat' || day === 'Fri' ? 'WEND' : 'WDAY'
                              }\n${day.toUpperCase()}\n${moment(_date).format(
                                'MM/DD'
                              )}`}{' '}
                              <div class="dropdown-divider"></div>
                              {daysOut}
                            </StyledTableCell>
                          );
                        }
                      })()
                    )}
                  </StyledTableRow>
                </TableHead>

                <TableBody>
                  {hotels.map((_hotel, index) => (
                    <StyledTableRow>
                      <StyledTableCell size="small">
                        {index + 1}
                      </StyledTableCell>
                      <StyledTableCell
                        size="medium"
                        component="th"
                        scope="col"
                        className={classes.sticky}
                        style={{ fontWeight: 'bold', width: '300px' }}
                      >
                        {_hotel.hotelName}
                      </StyledTableCell>
                      <StyledTableCell size="small" className={classes.rates}>
                        {_hotel.stars}
                      </StyledTableCell>
                      {(() => {
                        let cluster_arr = [];
                        _hotel.prices.map((dt, ix) => {
                          if (dt !== null) {
                            cluster_arr.push(
                              getClusterByPrice(
                                dt.price[getPrice(dt.price)],
                                ix
                              ) + 2
                            );
                          }
                        });
                        _hotel.freq_bucket = mode(cluster_arr);
                        return (
                          <StyledTableCell className={classes.rates}>
                            {_hotel.freq_bucket}
                          </StyledTableCell>
                        );
                      })()}
                      <StyledTableCell size="small" className={classes.rates}>
                        {_hotel.ratings}
                      </StyledTableCell>

                      {_hotel.prices.map((dt, ix) => {
                        return ix <= 30 && dt !== null ? (
                          <StyledTableCell
                            size="small"
                            className={classes.rates}
                          >
                            <span className="font-weight-bold">
                              {dt.price[getPrice(dt.price)]}
                            </span>
                          </StyledTableCell>
                        ) : (
                          <></>
                        );
                      })}
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
              <br />
            </Box>
          </TableContainer>{' '}
        </>
      ) : (
        <></>
      )}
    </>
  );
};
