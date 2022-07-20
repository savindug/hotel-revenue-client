import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  makeStyles,
  TableCell,
  TableContainer,
  TableRow,
  TableSortLabel,
  withStyles,
} from '@material-ui/core';
import { useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import {
  CLUSTER_BACKGROUND,
  FONT_FAMILY,
  multiSelectStyles,
} from '../utils/const';

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

const useStyles = makeStyles((theme) => ({
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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  rates: {
    fontFamily: FONT_FAMILY,
  },
  tabularNavStyle: {
    backgroundColor: '#607D8B',
    fontFamily: FONT_FAMILY,
    fontWeight: 'bold',
  },
}));

export default function HotelRanks({ selectedDate }) {
  const classes = useStyles();

  const getClusterDataSet = useSelector((state) => state.clusterDataSet);
  const {
    loading,
    err,
    reqHotel,
    cluster1,
    cluster2,
    cluster3,
    cluster4,
    hotels,
    report_len,
    ratingCluster,
  } = getClusterDataSet;

  const auth = useSelector((state) => state.auth);
  const { user } = auth;

  const [hotelsList, setHotelsList] = useState([]);

  const [originalRows, setOriginalRows] = useState([]);

  const [load, setLoad] = useState(false);

  const [date_select, setDate_select] = useState(0);

  const [hotel_list_by_date, set_hotel_list_by_date] = useState([]);

  const [reqHotelStrategyZone, setReqHotelStrategyZone] = useState(undefined);

  const getReqHotelID = () => {
    let id = '';
    reqHotel.map((e, index) => {
      if (e.hotelID !== null && e.hotelID != 'N/A') {
        id = e.hotelID;
      }
    });
    return id;
  };

  useEffect(() => {
    if (reqHotel.length > 0) {
      getReqHotelID();
    }
  }, [reqHotel]);

  useEffect(() => {
    const sort_price_by_date = async () => {
      let hotel_prices = [];
      if (hotelsList.length > 0) {
        hotelsList.map((_hotel, ix) => {
          let dt = _hotel.prices[date_select];

          if (dt != null) {
            hotel_prices.push({
              hotelID: _hotel.hotelID,
              hotelName: _hotel.hotelName,
              stars: _hotel.stars,
              price: dt.price[getPrice(dt.price)],
            });
          }
        });
      }

      set_hotel_list_by_date(
        hotel_prices.sort(
          (a, b) => b.price - a.price || a.hotelName.localeCompare(b.hotelName)
        )
      );
    };

    if (hotelsList.length > 0 && date_select >= 0) {
      sort_price_by_date();
    }
  }, [date_select, hotelsList]);

  const getAverage = (array) => {
    if (array.length > 0) {
      let avg = array.reduce((a, b) => a + b) / array.length;
      return avg;
    } else {
      return -1;
    }
  };

  const getStandardDeviation = (array) => {
    const n = array.length;
    if (n > 0) {
      const mean = array.reduce((a, b) => a + b) / n;
      return Math.sqrt(
        array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n
      );
    } else {
      return -1;
    }
  };

  const getRankedHotels = (arr) => {
    var sorted = arr
      .filter((e) => e.rate != 'NaN')
      .sort((a, b) => b.rate - a.rate);

    var rank = 1;
    for (var i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i].rate < sorted[i - 1].rate) {
        rank++;
      }
      sorted[i].day_rank = rank;
    }

    // console.log(sorted);
    return sorted;
  };

  useEffect(() => {
    // console.log(`selectedDate: ${selectedDate}`);

    const CalculateHotelRanks = async () => {
      setLoad(true);
      let ranked_hotels_list = [];
      if (hotels.length > 0) {
        await [...Array(report_len).keys()].map((e, index) => {
          let hotel_rates_by_day = [];
          hotels.map((_hotel) => {
            let dt = _hotel.prices[index];

            try {
              if (
                dt !== null &&
                checkHotelAvailability(_hotel.hotelID, index)
              ) {
                hotel_rates_by_day.push({
                  hotel_id: _hotel.hotelID,
                  hotel_name: _hotel.hotelName,
                  rate: dt.price[getPrice(dt.price)],
                  date: dt.date,
                });
              }
            } catch (error) {}
          });

          let ranked_hotels = getRankedHotels(hotel_rates_by_day);
          ranked_hotels_list.push(ranked_hotels);

          hotels.map((_hotel) => {
            let dt = _hotel.prices[index];

            try {
              if (
                dt !== null &&
                checkHotelAvailability(_hotel.hotelID, index)
              ) {
                let day_rank = ranked_hotels.findIndex(
                  (e) => e.hotel_id == _hotel.hotelID
                );
                if (day_rank >= 0) {
                  dt.day_rank = day_rank;
                }
              }
            } catch (error) {}
          });
        });

        hotels.map((_hotel) => {
          let rank_stdev_wd = [];
          let rank_stdev_we = [];
          let rank_arr_wd = [];
          let ranks_arr_we = [];
          let ranks_arr_w = [];
          _hotel.prices.map((dt, ix) => {
            if (dt !== null) {
              const day = moment(dt.date).format('dddd').substring(0, 3);

              if (checkHotelAvailability(_hotel.hotelID, ix)) {
                ranks_arr_w.push(dt.day_rank);
                if (day === 'Sat' || day === 'Fri') {
                  ranks_arr_we.push(dt.day_rank);
                  rank_stdev_we.push(dt.day_rank);
                } else {
                  rank_arr_wd.push(dt.day_rank);
                  rank_stdev_wd.push(dt.day_rank);
                }
              }
            }

            let avg_rank_wd = getAverage(rank_arr_wd);
            let avg_rank_we = getAverage(ranks_arr_we);
            let avg_rank = getAverage(ranks_arr_w);
            let stdev_wd = getStandardDeviation(rank_stdev_wd);
            let stdev_we = getStandardDeviation(rank_stdev_we);

            _hotel.avg_rank_wd = avg_rank_wd;
            _hotel.avg_rank_we = avg_rank_we;
            _hotel.avg_rank = avg_rank;
            _hotel.stdev_wd = stdev_wd;
            _hotel.stdev_we = stdev_we;

            _hotel.upper_bound_wd = Math.ceil(
              avg_rank_wd - 2 * _hotel.stdev_wd
            );
            _hotel.lower_bound_wd = Math.ceil(
              avg_rank_wd + 2 * _hotel.stdev_wd
            );

            _hotel.upper_start_wd = Math.ceil(
              avg_rank_wd - 1 * _hotel.stdev_wd
            );
            _hotel.lower_start_wd = Math.ceil(
              avg_rank_wd + 1 * _hotel.stdev_wd
            );

            _hotel.upper_bound_we = Math.ceil(
              avg_rank_we - 2 * _hotel.stdev_we
            );
            _hotel.lower_bound_we = Math.ceil(
              avg_rank_we + 2 * _hotel.stdev_we
            );
            _hotel.upper_start_we = Math.ceil(
              avg_rank_wd - 1 * _hotel.stdev_wd
            );
            _hotel.lower_start_we = Math.ceil(
              avg_rank_wd + 1 * _hotel.stdev_wd
            );
          });
        });

        hotels.map((_hotel) => {
          _hotel.prices.map((dt, ix) => {
            if (dt !== null) {
              let day = moment(dt.date).format('dddd').substring(0, 3);

              if (day === 'Sat' || day === 'Fri') {
                dt.upper_bound_rate = ranked_hotels_list[ix].find(
                  (obj, i) => obj.day_rank == _hotel.upper_bound_we
                );

                dt.upper_start_rate = ranked_hotels_list[ix].find(
                  (obj, i) => obj.day_rank == _hotel.upper_start_we
                );

                dt.lower_bound_rate = ranked_hotels_list[ix].find(
                  (obj, i) => obj.day_rank == _hotel.lower_bound_we
                );

                dt.lower_start_rate = ranked_hotels_list[ix].find(
                  (obj, i) => obj.day_rank == _hotel.lower_start_we
                );

                if (dt.upper_bound_rate == undefined) {
                  dt.upper_bound_rate = ranked_hotels_list[ix][0];
                }

                if (dt.lower_bound_rate == undefined) {
                  dt.lower_bound_rate =
                    ranked_hotels_list[ix][ranked_hotels_list[ix].length - 1];
                }
              } else {
                dt.upper_bound_rate = ranked_hotels_list[ix].find(
                  (obj, i) => obj.day_rank == _hotel.upper_bound_wd
                );
                dt.upper_start_rate = ranked_hotels_list[ix].find(
                  (obj, i) => obj.day_rank == _hotel.upper_start_wd
                );
                dt.lower_bound_rate = ranked_hotels_list[ix].find(
                  (obj, i) => obj.day_rank == _hotel.lower_bound_wd
                );
                dt.lower_start_rate = ranked_hotels_list[ix].find(
                  (obj, i) => obj.day_rank == _hotel.lower_start_wd
                );

                if (dt.upper_bound_rate == undefined) {
                  dt.upper_bound_rate = ranked_hotels_list[ix][0];
                }

                if (dt.lower_bound_rate == undefined) {
                  dt.lower_bound_rate =
                    ranked_hotels_list[ix][ranked_hotels_list[ix].length - 1];
                }
              }

              if (
                dt.lower_bound_rate != undefined &&
                dt.upper_bound_rate != undefined &&
                dt.upper_start_rate &&
                dt.lower_start_rate
              ) {
                if (
                  dt.price[getPrice(dt.price)] >= dt.lower_bound_rate.rate &&
                  dt.price[getPrice(dt.price)] < dt.lower_start_rate.rate
                ) {
                  dt.qr = 'LOW';
                } else if (
                  dt.price[getPrice(dt.price)] >= dt.lower_start_rate.rate &&
                  dt.price[getPrice(dt.price)] < dt.upper_start_rate.rate
                ) {
                  dt.qr = 'MID';
                } else if (
                  dt.price[getPrice(dt.price)] >= dt.upper_start_rate.rate &&
                  dt.price[getPrice(dt.price)] <= dt.upper_bound_rate.rate
                ) {
                  dt.qr = 'HIGH';
                }
              }
            }
          });
        });

        const req_hotel_data = hotels.find(
          (e) => e.hotelName == reqHotel[0].name
        );
        setReqHotelStrategyZone(req_hotel_data);
      }
      setLoad(false);
    };

    CalculateHotelRanks();
    // console.log(hotels);

    setOriginalRows(
      hotels.sort(
        (a, b) => b.stars - a.stars || a.hotelName.localeCompare(b.hotelName)
      )
    );
    setHotelsList(
      hotels.sort(
        (a, b) => b.stars - a.stars || a.hotelName.localeCompare(b.hotelName)
      )
    );
  }, []);

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

  const checkHotelAvailability = (id, day) => {
    let clustered = [];

    if (cluster1.length > 0 && cluster1[day]) {
      clustered.push(cluster1[day].unwanted);
    }
    if (cluster2.length > 0 && cluster2[day]) {
      clustered.push(cluster2[day].unwanted);
    }
    if (cluster3.length > 0 && cluster3[day]) {
      clustered.push(cluster3[day].unwanted);
    }
    if (cluster4.length > 0 && cluster4[day]) {
      clustered.push(cluster4[day].unwanted);
    }
    let hotels_arr = [];

    for (var i = 0; i < clustered.length; i++) {
      hotels_arr = hotels_arr.concat(clustered[i]);
    }

    const exists = hotels_arr.some((obj) => obj.id == id);

    if (exists) {
      return true;
    } else {
      return false;
    }
  };

  const daily_fetch_len = selectedDate
    ? moment(moment(selectedDate).add(90, 'days'))
        .endOf('month')
        .day('sunday')
        .diff(selectedDate, 'days')
    : 0;

  return (
    <>
      {' '}
      {hotels.length > 0 &&
      originalRows.length > 0 &&
      !load &&
      reqHotelStrategyZone != undefined ? (
        <>
          <TableContainer
            component={Paper}
            className={classes.container + ' mt-3'}
          >
            <TableContainer component={Paper} className="my-5">
              <Box width={100}>
                <Table
                  className={classes.table}
                  size="medium"
                  aria-label="customized table"
                  bodyStyle={{ overflow: 'visible' }}
                  stickyHeader
                >
                  <TableHead>
                    <StyledTableCell
                      style={{
                        width: '250px',
                        zIndex: 100,
                        fontFamily: FONT_FAMILY,
                      }}
                    >
                      <TableSortLabel disabled>
                        Rate Strategy Zone
                      </TableSortLabel>{' '}
                      <hr />
                      <TableSortLabel disabled>Days Out</TableSortLabel>
                    </StyledTableCell>
                    {reqHotel.map((e, index) =>
                      (() => {
                        let _date = moment(e.checkIn);
                        let daysOut = _date.diff(selectedDate, 'days');
                        let date = _date.format('dddd').substring(0, 3);
                        return (
                          <StyledTableCell
                            size="small"
                            key={index}
                            className={
                              date === 'Sat' || date === 'Fri'
                                ? 'bg-secondary text-light text-center'
                                : 'text-center'
                            }
                            style={{
                              fontSize: '12px',
                              borderRight:
                                index == daily_fetch_len
                                  ? '5px solid rgba(66, 66, 66, 1)'
                                  : '',
                            }}
                          >
                            <>
                              {date === 'Sat' || date === 'Fri'
                                ? 'WEND'
                                : 'WDAY'}
                            </>
                            <br />
                            <>{date.toUpperCase()}</>
                            <br />
                            <>{moment(e.checkIn).format('MM/DD')}</>{' '}
                            <div class="dropdown-divider"></div>
                            {daysOut}
                          </StyledTableCell>
                        );
                      })()
                    )}
                  </TableHead>
                  <TableBody>
                    <StyledTableRow>
                      <StyledTableCell
                        size="small"
                        component="th"
                        scope="row"
                        className={classes.sticky}
                        style={{ fontWeight: 'bold', width: '250px' }}
                      >
                        Rate Strategy Position
                      </StyledTableCell>

                      {[...Array(report_len).keys()].map((e, index) =>
                        (() => {
                          if (reqHotelStrategyZone.prices[index] != null) {
                            return (
                              <StyledTableCell
                                size="small"
                                key={index}
                                style={{
                                  fontWeight: 'bold',
                                  fontSize: '12px',
                                  borderRight:
                                    index == daily_fetch_len
                                      ? '5px solid rgba(66, 66, 66, 1)'
                                      : '',
                                }}
                                className={classes.rates}
                              >
                                {reqHotelStrategyZone.prices[index].qr}
                              </StyledTableCell>
                            );
                          } else {
                            return (
                              <StyledTableCell
                                size="small"
                                key={index}
                                style={{
                                  borderRight:
                                    index == daily_fetch_len
                                      ? '5px solid rgba(66, 66, 66, 1)'
                                      : '',
                                }}
                                className={classes.rates}
                              >
                                N/A
                              </StyledTableCell>
                            );
                          }
                        })()
                      )}
                    </StyledTableRow>

                    <StyledTableRow>
                      <StyledTableCell
                        size="small"
                        component="th"
                        scope="row"
                        className={classes.sticky}
                        style={{ fontWeight: 'bold', width: '250px' }}
                      >
                        Upper Bound
                      </StyledTableCell>

                      {[...Array(report_len).keys()].map((e, index) =>
                        (() => {
                          if (reqHotelStrategyZone.prices[index] != null) {
                            if (
                              reqHotelStrategyZone.prices[index]
                                .upper_bound_rate
                            ) {
                              return (
                                <StyledTableCell
                                  size="small"
                                  key={index}
                                  style={{
                                    borderRight:
                                      index == daily_fetch_len
                                        ? '5px solid rgba(66, 66, 66, 1)'
                                        : '',
                                  }}
                                  className={classes.rates}
                                >
                                  {
                                    reqHotelStrategyZone.prices[index]
                                      .upper_bound_rate.rate
                                  }
                                </StyledTableCell>
                              );
                            } else {
                              return (
                                <StyledTableCell
                                  size="small"
                                  key={index}
                                  style={{
                                    fontWeight: 'bold',

                                    borderRight:
                                      index == daily_fetch_len
                                        ? '5px solid rgba(66, 66, 66, 1)'
                                        : '',
                                  }}
                                  className={classes.rates}
                                >
                                  N/A
                                </StyledTableCell>
                              );
                            }
                          } else {
                            return (
                              <StyledTableCell
                                size="small"
                                key={index}
                                style={{
                                  fontWeight: 'bold',

                                  borderRight:
                                    index == daily_fetch_len
                                      ? '5px solid rgba(66, 66, 66, 1)'
                                      : '',
                                }}
                                className={classes.rates}
                              >
                                N/A
                              </StyledTableCell>
                            );
                          }
                        })()
                      )}
                    </StyledTableRow>

                    <StyledTableRow>
                      <StyledTableCell
                        size="small"
                        component="th"
                        scope="row"
                        className={classes.sticky}
                        style={{
                          fontWeight: 'bold',
                          width: '250px',
                          zIndex: 100,
                        }}
                      >
                        &emsp;High Range
                      </StyledTableCell>

                      {[...Array(report_len).keys()].map((e, index) =>
                        (() => {
                          if (reqHotelStrategyZone.prices[index] != null) {
                            if (
                              reqHotelStrategyZone.prices[index]
                                .upper_start_rate
                            ) {
                              return (
                                <StyledTableCell
                                  size="small"
                                  key={index}
                                  style={{
                                    borderRight:
                                      index == daily_fetch_len
                                        ? '5px solid rgba(66, 66, 66, 1)'
                                        : '',
                                  }}
                                  className={classes.rates}
                                >
                                  {parseFloat(
                                    reqHotelStrategyZone.prices[index]
                                      .upper_start_rate.rate
                                  ).toFixed(0)}
                                </StyledTableCell>
                              );
                            } else {
                              return (
                                <StyledTableCell
                                  size="small"
                                  key={index}
                                  style={{
                                    borderRight:
                                      index == daily_fetch_len
                                        ? '5px solid rgba(66, 66, 66, 1)'
                                        : '',
                                  }}
                                  className={classes.rates}
                                >
                                  N/A
                                </StyledTableCell>
                              );
                            }
                          } else {
                            return (
                              <StyledTableCell
                                size="small"
                                key={index}
                                style={{
                                  borderRight:
                                    index == daily_fetch_len
                                      ? '5px solid rgba(66, 66, 66, 1)'
                                      : '',
                                }}
                                className={classes.rates}
                              >
                                N/A
                              </StyledTableCell>
                            );
                          }
                        })()
                      )}
                    </StyledTableRow>

                    <StyledTableRow>
                      <StyledTableCell
                        size="small"
                        component="th"
                        scope="row"
                        className={classes.sticky}
                        style={{
                          fontWeight: 'bold',
                          width: '250px',
                          zIndex: 100,
                        }}
                      >
                        &emsp;Middle Range
                      </StyledTableCell>

                      {[...Array(report_len).keys()].map((e, index) =>
                        (() => {
                          if (reqHotelStrategyZone.prices[index] != null) {
                            if (
                              reqHotelStrategyZone.prices[index]
                                .lower_start_rate
                            ) {
                              return (
                                <StyledTableCell
                                  size="small"
                                  key={index}
                                  style={{
                                    borderRight:
                                      index == daily_fetch_len
                                        ? '5px solid rgba(66, 66, 66, 1)'
                                        : '',
                                  }}
                                  className={classes.rates}
                                >
                                  {parseFloat(
                                    reqHotelStrategyZone.prices[index]
                                      .lower_start_rate.rate
                                  ).toFixed(0)}
                                </StyledTableCell>
                              );
                            } else {
                              return (
                                <StyledTableCell
                                  size="small"
                                  key={index}
                                  style={{
                                    borderRight:
                                      index == daily_fetch_len
                                        ? '5px solid rgba(66, 66, 66, 1)'
                                        : '',
                                  }}
                                  className={classes.rates}
                                >
                                  N/A
                                </StyledTableCell>
                              );
                            }
                          } else {
                            return (
                              <StyledTableCell
                                size="small"
                                key={index}
                                style={{
                                  borderRight:
                                    index == daily_fetch_len
                                      ? '5px solid rgba(66, 66, 66, 1)'
                                      : '',
                                }}
                                className={classes.rates}
                              >
                                N/A
                              </StyledTableCell>
                            );
                          }
                        })()
                      )}
                    </StyledTableRow>

                    <StyledTableRow>
                      <StyledTableCell
                        size="small"
                        component="th"
                        scope="row"
                        className={classes.sticky}
                        style={{
                          fontWeight: 'bold',
                          width: '250px',
                          zIndex: 100,
                        }}
                      >
                        Lower Bound
                      </StyledTableCell>

                      {[...Array(report_len).keys()].map((e, index) =>
                        (() => {
                          if (reqHotelStrategyZone.prices[index] != null) {
                            if (
                              reqHotelStrategyZone.prices[index]
                                .lower_bound_rate
                            ) {
                              return (
                                <StyledTableCell
                                  size="small"
                                  key={index}
                                  style={{
                                    borderRight:
                                      index == daily_fetch_len
                                        ? '5px solid rgba(66, 66, 66, 1)'
                                        : '',
                                  }}
                                  className={classes.rates}
                                >
                                  {
                                    reqHotelStrategyZone.prices[index]
                                      .lower_bound_rate.rate
                                  }
                                </StyledTableCell>
                              );
                            } else {
                              return (
                                <StyledTableCell
                                  size="small"
                                  key={index}
                                  style={{
                                    borderRight:
                                      index == daily_fetch_len
                                        ? '5px solid rgba(66, 66, 66, 1)'
                                        : '',
                                  }}
                                  className={classes.rates}
                                >
                                  N/A
                                </StyledTableCell>
                              );
                            }
                          } else {
                            return (
                              <StyledTableCell
                                size="small"
                                key={index}
                                style={{
                                  borderRight:
                                    index == daily_fetch_len
                                      ? '5px solid rgba(66, 66, 66, 1)'
                                      : '',
                                }}
                                className={classes.rates}
                              >
                                N/A
                              </StyledTableCell>
                            );
                          }
                        })()
                      )}
                    </StyledTableRow>
                  </TableBody>
                </Table>
                <br />
              </Box>
            </TableContainer>
          </TableContainer>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
