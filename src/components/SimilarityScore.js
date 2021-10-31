import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  FormGroup,
  Grid,
  InputLabel,
  makeStyles,
  Select,
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
import { CLUSTER_BACKGROUND, FONT_FAMILY } from '../utils/const';
import SearchBar from 'material-ui-search-bar';

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
}));

export default function SimilarityScore({ selectedDate }) {
  const classes = useStyles();
  const [dates, setDates] = useState([]);
  const [sortDir, setSortDir] = useState('desc');

  const [sortBy, setSortBy] = useState(1);

  const getClusterDataSet = useSelector((state) => state.clusterDataSet);
  const {
    loading,
    err,
    cluster1,
    cluster2,
    cluster3,
    cluster4,
    hotels,
    reqHotel,
  } = getClusterDataSet;

  const auth = useSelector((state) => state.auth);
  const { user } = auth;

  const [hotelsList, setHotelsList] = useState([]);

  const [originalRows, setOriginalRows] = useState([]);

  const [nights, setNights] = useState(0);

  const [binding, setBinding] = useState(true);

  const [searched, setSearched] = useState('');

  const requestSearch = (searchedVal) => {
    // setSearched(searchedVal);
    const filteredRows = originalRows.filter((row) => {
      return row.hotelName.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setHotelsList(filteredRows);
  };

  const cancelSearch = () => {
    setSearched('');
    requestSearch(searched);
  };

  useEffect(() => {
    requestSearch(searched);
  }, [searched]);

  const getSimilarityRank = (arr) => {
    var sorted = arr.slice().sort(function (a, b) {
      return a.similiarity_score - b.similiarity_score;
    });

    var rank = 1;
    for (var i = 0; i < sorted.length; i++) {
      // increase rank only if current score less than previous
      if (
        i > 0 &&
        sorted[i].similiarity_score > sorted[i - 1].similiarity_score
      ) {
        rank++;
      }
      sorted[i].similarityRank = rank;
    }

    // console.log(sorted);
    return sorted;
  };

  useEffect(() => {
    const similarityScoreRateings = () => {
      setBinding(true);
      [...Array(90).keys()].map((d, i) => {
        hotels.map((_hotel, id) => {
          if (_hotel.prices[i] != null) {
            // _hotel.score = `${reqHotel[i].rate} - ${
            //   _hotel.prices[i].price[getPrice(_hotel.prices[i].price)]
            // }`;
            _hotel.prices[i].score = Math.abs(
              reqHotel[i].rate -
                _hotel.prices[i].price[getPrice(_hotel.prices[i].price)]
            );
          }
        });
      });
      [...Array(90).keys()].map((d, i) => {
        let score_arr = [];
        hotels.map((_hotel, id) => {
          if (_hotel.prices[i] != null) {
            let n_hotel = {
              checkIn: _hotel.checkIn,
              hotelID: _hotel.hotelID,
              hotelName: _hotel.hotelName,
              price: _hotel.prices[i].price[getPrice(_hotel.prices[i].price)],
              similiarity_score: _hotel.prices[i].score,
            };
            score_arr.push(n_hotel);
          }
        });

        const ranks_arr = getSimilarityRank(score_arr);
        hotels.map((_hotel, id) => {
          if (_hotel.prices[i] != null) {
            _hotel.prices[i].similarityRank = ranks_arr.find(
              (x) => x.hotelID == _hotel.hotelID
            ).similarityRank;
          }
        });
      });
      hotels.map((_hotel, id) => {
        const rate_arr = [];
        _hotel.prices.map((item) => {
          if (item !== null) {
            const day = moment(item.date).format('dddd').substring(0, 3);
            if (day === 'Sat' || day === 'Fri') {
            } else {
              rate_arr.push(item.similarityRank);
            }
          }
        });

        const rate_arr_len = rate_arr.filter((x) => x !== null).length;

        _hotel.similarityScore =
          rate_arr.reduce((a, b) => a + b, 0) / rate_arr_len;
      });
      setBinding(false);
      // console.log(hotels.sort((a, b) => a.similarityScore - b.similarityScore));
    };

    similarityScoreRateings();
    setOriginalRows(
      hotels.sort((a, b) => a.similarityScore - b.similarityScore)
    );
    setHotelsList(hotels.sort((a, b) => a.similarityScore - b.similarityScore));
  }, []);

  const getClusterByPrice = (rate, ix) => {
    if (
      (cluster1[ix].min != undefined || cluster1[ix].min != null) &&
      (cluster1[ix].max != undefined || cluster1[ix].max != null)
    ) {
      if (rate >= cluster1[ix].min && rate <= cluster1[ix].max) {
        // console.log(
        //   `${ix} => ${cluster1[ix].min} < ${rate} > ${cluster1[ix].max} `
        // );
        return 0;
      }
    }
    if (
      (cluster2[ix].min != undefined || cluster2[ix].min != null) &&
      (cluster2[ix].max != undefined || cluster2[ix].max != null)
    ) {
      if (rate >= cluster2[ix].min && rate <= cluster2[ix].max) {
        // console.log(
        //   `${ix} =>${cluster2[ix].min} < ${rate} > ${cluster2[ix].max} `
        // );
        return 1;
      }
    }

    if (
      (cluster3[ix].min != undefined || cluster3[ix].min != null) &&
      (cluster3[ix].max != undefined || cluster3[ix].max != null)
    ) {
      if (rate >= cluster3[ix].min && rate <= cluster3[ix].max) {
        // console.log(
        //   `${ix} =>${cluster3[ix].min} < ${rate} > ${cluster3[ix].max} `
        // );
        return 2;
      }
    }
    if (
      (cluster4[ix].min != undefined || cluster4[ix].min != null) &&
      (cluster4[ix].max != undefined || cluster4[ix].max != null)
    ) {
      if (rate >= cluster4[ix].min && rate <= cluster4[ix].max) {
        // console.log(
        //   `${ix} =>${cluster4[ix].min} < ${rate} > ${cluster4[ix].max} `
        // );
        return 3;
      }
    }
  };

  // const handleHotelsFilter = async (event) => {
  //   if (event.target.value == 0) {
  //     const selectedHotels = [hotels[0]];
  //     user.application.candidate_properties.map((_filterHotel) =>
  //       hotels.some((hotel) => {
  //         if (hotel.hotelID === _filterHotel.id) {
  //           selectedHotels.push(hotel);
  //         }
  //       })
  //     );
  //     setHotelsList(selectedHotels);
  //   } else {
  //     setHotelsList(hotels);
  //   }
  // };

  const handleNightsFilter = async (event) => {
    setNights(event.target.value);
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

  const checkHotelAvailability = (id, day) => {
    const hotels_arr = Array.prototype.concat(
      cluster1[day].unwanted,
      cluster2[day].unwanted,
      cluster3[day].unwanted,
      cluster4[day].unwanted
    );

    const exists = hotels_arr.some((obj) => obj.id == id);

    if (exists) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      {hotels.length > 0 &&
      originalRows.length > 0 &&
      cluster1.length > 0 &&
      cluster2.length > 0 &&
      cluster3.length > 0 &&
      !binding &&
      cluster4.length > 0 ? (
        <>
          <Grid container justify="space-evenly" className="my-3">
            <FormGroup className={classes.formControl}>
              <SearchBar
                value={searched}
                onChange={(searchVal) => setSearched(searchVal)}
                onCancelSearch={() => cancelSearch()}
              />
            </FormGroup>
            {/* <FormGroup className={classes.formControl}>
              <InputLabel
                htmlFor="grouped-native-select"
                style={{ backgroundColor: 'white', fontFamily: FONT_FAMILY }}
              >
                Hotels Filter
              </InputLabel>
              <Select
                native
                id="grouped-native-select"
                onChange={handleHotelsFilter}
                style={{ backgroundColor: 'white', fontFamily: FONT_FAMILY }}
              >
                <option value={1}>All Hotels</option>
                <option value={0}>Selected Hotels</option>
              </Select>
            </FormGroup> */}
          </Grid>

          <TableContainer
            component={Paper}
            className={classes.container + ' mt-3'}
          >
            <Box width={100}>
              <Table
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
                      {/* <TableSortLabel
                        active={sortBy === 0}
                        direction={sortDir}
                        // onClick={() => {
                        //   handleSort(0, sortDir === 'asc' ? 'desc' : 'asc');
                        // }}
                      > */}
                      Hotel Name
                      {/* </TableSortLabel> */}
                      <hr />
                      <TableSortLabel disabled>Days Out</TableSortLabel>
                      {/* <TableSortLabel onClick={handleSort(0)}></TableSortLabel> */}
                    </StyledTableCell>
                    <StyledTableCell size="small">
                      {/* <TableSortLabel
                        active={sortBy === 1}
                        direction={sortDir}
                        onClick={() => {
                          handleSort(1, sortDir === 'asc' ? 'desc' : 'asc');
                        }}
                      > */}
                      Stars
                      {/* </TableSortLabel> */}
                    </StyledTableCell>
                    <StyledTableCell className="text-center">
                      Freq Bucket
                    </StyledTableCell>
                    {[...Array(90).keys()].map((d, i) =>
                      (() => {
                        let date = moment(selectedDate)
                          .add(i, 'd')
                          .format('YYYY-MM-DD');
                        let day = moment(date).format('dddd').substring(0, 3);
                        // console.log('selectedDate+: ' + date + ', day: ' + day);
                        if (!(day === 'Sat' || day === 'Fri')) {
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
                              {`${day.toUpperCase()}\n${moment(date).format(
                                'MM/DD'
                              )}`}{' '}
                              <hr />
                              {i}
                            </StyledTableCell>
                          );
                        }
                      })()
                    )}
                  </StyledTableRow>
                </TableHead>

                <TableBody>
                  {hotelsList.map((_hotel, index) => (
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

                        return (
                          <StyledTableCell className={classes.rates}>
                            {mode(cluster_arr)}
                          </StyledTableCell>
                        );
                      })()}
                      {_hotel.prices.map((dt, ix) =>
                        (() => {
                          let day = moment(selectedDate)
                            .add(ix, 'd')
                            .format('YYYY-MM-DD');
                          const date = moment(day)
                            .format('dddd')
                            .substring(0, 3);

                          if (!(date === 'Sat' || date === 'Fri')) {
                            if (dt !== null) {
                              return (
                                <StyledTableCell
                                  size="small"
                                  className={classes.rates}
                                  style={
                                    checkHotelAvailability(_hotel.hotelID, ix)
                                      ? {
                                          backgroundColor:
                                            CLUSTER_BACKGROUND[
                                              getClusterByPrice(
                                                dt.price[getPrice(dt.price)],
                                                ix
                                              )
                                            ],
                                        }
                                      : { backgroundColor: '#9E9E9E' }
                                  }
                                >
                                  <span className="font-weight-bold">
                                    {dt.price[getPrice(dt.price)]}&nbsp;
                                    <sup className="text-light font-weight-bold">
                                      {dt.similarityRank}
                                    </sup>
                                    {/* {getPrice(dt.price) > 0 ? (
                              <sup className="text-light font-weight-bold">
                                {getPrice(dt.price) + 1}
                              </sup>
                            ) : (
                              <></>
                            )} */}
                                  </span>
                                </StyledTableCell>
                              );
                            } else {
                              return (
                                <StyledTableCell
                                  size="small"
                                  className={classes.rates}
                                >
                                  --
                                </StyledTableCell>
                              );
                            }
                          }
                        })()
                      )}
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
              <br />
            </Box>
          </TableContainer>
          {/* <TablePagination
            rowsPerPageOptions={[10, 25]}
            component="div"
            count={hotels.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          /> */}
        </>
      ) : (
        <></>
      )}
    </>
  );
}
