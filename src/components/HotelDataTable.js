import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Checkbox,
  FormControl,
  FormGroup,
  Grid,
  InputLabel,
  ListItemIcon,
  ListItemText,
  makeStyles,
  MenuItem,
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
import {
  CLUSTER_BACKGROUND,
  FONT_FAMILY,
  MenuProps,
  multiSelectStyles,
} from '../utils/const';
import SearchBar from 'material-ui-search-bar';

import ReactHTMLTableToExcel from 'react-html-table-to-excel';

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

export default function HotelDataTable({ selectedDate }) {
  const options = [2, 3, 4, 5];

  const classes = useStyles();
  const multiSelectClasses = multiSelectStyles();

  const [dates, setDates] = useState([]);
  const [sortDir, setSortDir] = useState('desc');

  const [selectedStars, setSelectedStars] = useState([]);
  const [selectedBuckets, setSelectedBuckets] = useState([]);

  const isAllSelectedStars =
    options.length > 0 && selectedStars.length === options.length;

  const isAllSelectedBuckets =
    options.length > 0 && selectedBuckets.length === options.length;

  const [sortBy, setSortBy] = useState(1);

  // const [hotelsList, setHotelsList] = useState([]);
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
  } = getClusterDataSet;

  const auth = useSelector((state) => state.auth);
  const { user } = auth;

  const [hotelsList, setHotelsList] = useState([]);

  const [originalRows, setOriginalRows] = useState([]);

  const [nights, setNights] = useState(0);

  const [searched, setSearched] = useState('');

  const tableRef = useRef(null);

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

    return `${name}-Hotle_Radar-${moment(selectedDate).format('YYYY-MM-DD')}`;
  };

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

  useEffect(() => {
    // console.log(`selectedDate: ${selectedDate}`);
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

    // if (
    //   (cluster1[ix].min != undefined || cluster1[ix].min != null) &&
    //   (cluster1[ix].max != undefined || cluster1[ix].max != null)
    // ) {
    //   if (rate >= cluster1[ix].min && rate <= cluster1[ix].max) {
    //     // console.log(
    //     //   `${ix} => ${cluster1[ix].min} < ${rate} > ${cluster1[ix].max} `
    //     // );
    //     return 0;
    //   }
    // }
    // if (
    //   (cluster2[ix].min != undefined || cluster2[ix].min != null) &&
    //   (cluster2[ix].max != undefined || cluster2[ix].max != null)
    // ) {
    //   if (rate >= cluster2[ix].min && rate <= cluster2[ix].max) {
    //     // console.log(
    //     //   `${ix} =>${cluster2[ix].min} < ${rate} > ${cluster2[ix].max} `
    //     // );
    //     return 1;
    //   }
    // }

    // if (
    //   (cluster3[ix].min != undefined || cluster3[ix].min != null) &&
    //   (cluster3[ix].max != undefined || cluster3[ix].max != null)
    // ) {
    //   if (rate >= cluster3[ix].min && rate <= cluster3[ix].max) {
    //     // console.log(
    //     //   `${ix} =>${cluster3[ix].min} < ${rate} > ${cluster3[ix].max} `
    //     // );
    //     return 2;
    //   }
    // }
    // if (
    //   (cluster4[ix].min != undefined || cluster4[ix].min != null) &&
    //   (cluster4[ix].max != undefined || cluster4[ix].max != null)
    // ) {
    //   if (rate >= cluster4[ix].min && rate <= cluster4[ix].max) {
    //     // console.log(
    //     //   `${ix} =>${cluster4[ix].min} < ${rate} > ${cluster4[ix].max} `
    //     // );
    //     return 3;
    //   }
    // }
  };

  const sortData = (sortBy, sortOrder) => {
    // alert(`sortData (${sortBy}, ${sortOrder})`);
    if (sortBy === 0) {
      if (sortOrder === 'asc') {
        hotelsList.sort(
          (a, b) => a.hotelName.localeCompare(b.hotelName) || b.stars - a.stars
        );
      } else {
        hotelsList.sort(
          (a, b) => b.hotelName.localeCompare(a.hotelName) || b.stars - a.stars
        );
      }
    }

    if (sortBy === 1) {
      if (sortOrder === 'asc') {
        hotelsList.sort(
          (a, b) => a.stars - b.stars || a.hotelName.localeCompare(b.hotelName)
        );
      } else {
        hotelsList.sort(
          (a, b) => b.stars - a.stars || a.hotelName.localeCompare(b.hotelName)
        );
      }
    }
  };

  const handleSort = async (sb, sd) => {
    setSortBy(sb);
    setSortDir(sd);

    await sortData(sb, sd);

    //console.log('hotelList ', hotelsList);
  };

  const handleHotelsFilter = async (event) => {
    if (event.target.value == 0) {
      const selectedHotels = [hotels[0]];
      user.application.candidate_properties.map((_filterHotel) =>
        hotels.some((hotel) => {
          if (hotel.hotelID === _filterHotel.id) {
            selectedHotels.push(hotel);
          }
        })
      );
      setHotelsList(selectedHotels);
    } else {
      setHotelsList(hotels);
    }
  };

  const handleNightsFilter = async (event) => {
    setNights(event.target.value);
  };

  const handleBucketsChange = (event) => {
    const value = event.target.value;
    if (value[value.length - 1] === 'all') {
      setSelectedBuckets(
        selectedBuckets.length === options.length ? [] : options
      );
      return;
    }
    setSelectedBuckets(value);
  };

  const handleStarsChange = (event) => {
    const value = event.target.value;
    if (value[value.length - 1] === 'all') {
      setSelectedStars(selectedStars.length === options.length ? [] : options);
      return;
    }
    setSelectedStars(value);
  };

  useEffect(() => {
    const handleStarsSelect = () => {
      if (selectedStars.length > 0) {
        const selectedHotels = [];
        selectedStars.map((star) => {
          originalRows.some((_filterHotel) => {
            if (star === Math.floor(_filterHotel.stars)) {
              selectedHotels.push(_filterHotel);
            }
          });
        });
        setHotelsList(
          selectedHotels.sort(
            (a, b) =>
              b.stars - a.stars || a.hotelName.localeCompare(b.hotelName)
          )
        );
      }
    };
    handleStarsSelect();
  }, [selectedStars]);

  useEffect(() => {
    const handleStarsSelect = () => {
      if (selectedBuckets.length > 0) {
        const selectedHotels = [];
        selectedBuckets.map((bucket) => {
          hotelsList.some((_filterHotel) => {
            if (bucket == _filterHotel.freq_bucket) {
              selectedHotels.push(_filterHotel);
            }
          });
        });
        setHotelsList(
          selectedHotels.sort(
            (a, b) =>
              b.stars - a.stars || a.hotelName.localeCompare(b.hotelName)
          )
        );
      }
    };
    handleStarsSelect();
  }, [selectedBuckets]);

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

  return (
    <>
      {hotels.length > 0 && originalRows.length > 0 ? (
        <>
          <Grid container justify="space-evenly" className="my-3">
            <FormGroup className={classes.formControl}>
              <SearchBar
                value={searched}
                onChange={(searchVal) => setSearched(searchVal)}
                onCancelSearch={() => cancelSearch()}
              />
            </FormGroup>
            <FormGroup className={classes.formControl}>
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
                <option value={0}>Analysis Set</option>
              </Select>
            </FormGroup>

            <FormControl className={classes.formControl}>
              <InputLabel id="mutiple-select-label">Stars</InputLabel>
              <Select
                labelId="mutiple-select-label"
                multiple
                value={selectedStars}
                onChange={handleStarsChange}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}
              >
                <MenuItem
                  value="all"
                  classes={{
                    root: isAllSelectedStars ? classes.selectedAll : '',
                  }}
                >
                  <ListItemIcon>
                    <Checkbox
                      classes={{ indeterminate: classes.indeterminateColor }}
                      checked={isAllSelectedStars}
                      indeterminate={
                        selectedStars.length > 0 &&
                        selectedStars.length < options.length
                      }
                    />
                  </ListItemIcon>
                  <ListItemText
                    classes={{ primary: classes.selectAllText }}
                    primary="Select All"
                  />
                </MenuItem>
                {options.map((option) => (
                  <MenuItem key={option} value={option}>
                    <ListItemIcon>
                      <Checkbox checked={selectedStars.indexOf(option) > -1} />
                    </ListItemIcon>
                    <ListItemText primary={option} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl className={classes.formControl}>
              <InputLabel id="mutiple-select-label">Bucket</InputLabel>
              <Select
                labelId="mutiple-select-label"
                multiple
                value={selectedBuckets}
                onChange={handleBucketsChange}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}
              >
                <MenuItem
                  value="all"
                  classes={{
                    root: isAllSelectedBuckets ? classes.selectedAll : '',
                  }}
                >
                  <ListItemIcon>
                    <Checkbox
                      classes={{ indeterminate: classes.indeterminateColor }}
                      checked={isAllSelectedBuckets}
                      indeterminate={
                        selectedBuckets.length > 0 &&
                        selectedBuckets.length < options.length
                      }
                    />
                  </ListItemIcon>
                  <ListItemText
                    classes={{ primary: classes.selectAllText }}
                    primary="Select All"
                  />
                </MenuItem>
                {options.map((option) => (
                  <MenuItem key={option} value={option}>
                    <ListItemIcon>
                      <Checkbox
                        checked={selectedBuckets.indexOf(option) > -1}
                      />
                    </ListItemIcon>
                    <ListItemText primary={option} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <ReactHTMLTableToExcel
                id="test-table-xls-button"
                className="btn btn-success download-table-xls-button"
                table="table-to-xls"
                filename={getReportName()}
                sheet={getReportName()}
                buttonText="Export to XLS"
              />
            </FormControl>
          </Grid>

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
                ref={tableRef}
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
                      <TableSortLabel
                        active={sortBy === 0}
                        direction={sortDir}
                        onClick={() => {
                          handleSort(0, sortDir === 'asc' ? 'desc' : 'asc');
                        }}
                      >
                        Hotel Name
                      </TableSortLabel>
                      <hr />
                      <TableSortLabel disabled>Days Out</TableSortLabel>
                      {/* <TableSortLabel onClick={handleSort(0)}></TableSortLabel> */}
                    </StyledTableCell>
                    <StyledTableCell>
                      <TableSortLabel
                        active={sortBy === 1}
                        direction={sortDir}
                        onClick={() => {
                          handleSort(1, sortDir === 'asc' ? 'desc' : 'asc');
                        }}
                      >
                        Stars
                      </TableSortLabel>
                    </StyledTableCell>
                    <StyledTableCell className="text-center">
                      Freq Bucket
                    </StyledTableCell>
                    {cluster1.map((e, i) =>
                      (() => {
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
                            <hr />
                            {daysOut}
                          </StyledTableCell>
                        );
                      })()
                    )}
                  </StyledTableRow>
                  {/* <StyledTableRow>
                    <StyledTableCell size="small">0</StyledTableCell>
                    <StyledTableCell
                      style={{
                        fontWeight: 'bold',
                        width: '250px',
                        fontFamily: FONT_FAMILY,
                      }}
                    >
                      Days Out
                    </StyledTableCell>
                    <StyledTableCell size="small"></StyledTableCell>
                    {[...Array(report_len).keys()].map((e, index) => (
                      <StyledTableCell size="small">{index}</StyledTableCell>
                    ))}
                  </StyledTableRow> */}
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
                        _hotel.freq_bucket = mode(cluster_arr);
                        return (
                          <StyledTableCell className={classes.rates}>
                            {_hotel.freq_bucket}
                          </StyledTableCell>
                        );
                      })()}

                      {_hotel.prices.map((dt, ix) => {
                        return dt !== null ? (
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
                              {getPrice(dt.price) > 0 ? (
                                <sup className="text-light font-weight-bold">
                                  {getPrice(dt.price) + 1}
                                </sup>
                              ) : (
                                <></>
                              )}
                            </span>
                          </StyledTableCell>
                        ) : (
                          <StyledTableCell
                            size="small"
                            className={classes.rates}
                          >
                            --
                          </StyledTableCell>
                        );
                      })}
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
