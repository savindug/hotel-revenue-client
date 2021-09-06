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
  const classes = useStyles();
  const [dates, setDates] = useState([]);
  const [sortDir, setSortDir] = useState('desc');

  const [sortBy, setSortBy] = useState(1);

  // const [hotelsList, setHotelsList] = useState([]);
  const getClusterDataSet = useSelector((state) => state.clusterDataSet);
  const { loading, err, cluster1, cluster2, cluster3, cluster4, hotels } =
    getClusterDataSet;

  const auth = useSelector((state) => state.auth);
  const { user } = auth;

  const [hotelsList, setHotelsList] = useState([]);

  const [nights, setNights] = useState(0);

  const getClusterByPrice = (rate, ix) => {
    if (
      (cluster1[ix].min != undefined || cluster1[ix].min != null) &&
      (cluster2[ix].min != undefined || cluster2[ix].min != null)
    ) {
      if (rate >= cluster1[ix].min && rate < cluster2[ix].min) {
        // console.log(
        //   `${ix} => ${cluster1[ix].min} < ${rate} > ${cluster1[ix].max} `
        // );
        return 0;
      }
    }
    if (
      (cluster3[ix].min != undefined || cluster3[ix].min != null) &&
      (cluster2[ix].min != undefined || cluster2[ix].min != null)
    ) {
      if (rate >= cluster2[ix].min && rate < cluster3[ix].min) {
        // console.log(
        //   `${ix} =>${cluster2[ix].min} < ${rate} > ${cluster2[ix].max} `
        // );
        return 1;
      }
    }

    if (
      (cluster3[ix].min != undefined || cluster3[ix].min != null) &&
      (cluster4[ix].min != undefined || cluster4[ix].min != null)
    ) {
      if (rate >= cluster3[ix].min && rate < cluster4[ix].min) {
        // console.log(
        //   `${ix} =>${cluster3[ix].min} < ${rate} > ${cluster3[ix].max} `
        // );
        return 2;
      }
    }
    if (cluster4[ix].min != undefined || cluster4[ix].min != null) {
      if (rate >= cluster4[ix].min) {
        // console.log(
        //   `${ix} =>${cluster4[ix].min} < ${rate} > ${cluster4[ix].max} `
        // );
        return 3;
      }
    }
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

  useEffect(() => {
    console.log(`selectedDate: ${selectedDate}`);
    setHotelsList(
      hotels.sort(
        (a, b) => b.stars - a.stars || a.hotelName.localeCompare(b.hotelName)
      )
    );
  }, []);

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

  const getPrice = (arr) => {
    const price = arr.findIndex((e) => e > 0);
    return price;
  };

  return (
    <>
      {hotels.length > 0 &&
      hotelsList.length > 0 &&
      cluster1.length > 0 &&
      cluster2.length > 0 &&
      cluster3.length > 0 &&
      cluster4.length > 0 ? (
        <>
          <Grid container justify="space-around" className="my-3">
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
                <option value={0}>Selected Hotels</option>
              </Select>
            </FormGroup>

            {/* <FormGroup className={classes.formControl}>
              <InputLabel
                htmlFor="grouped-native-select"
                style={{ backgroundColor: 'white', fontFamily: FONT_FAMILY }}
              >
                Nights
              </InputLabel>
              <Select
                native
                id="grouped-native-select"
                onChange={handleNightsFilter}
                style={{ backgroundColor: 'white', fontFamily: FONT_FAMILY }}
              >
                <option value={0}>1</option>
                <option value={1}>2</option>
                <option value={2}>3</option>
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
                    {/* <TableSortLabel onClick={handleSort(0)}></TableSortLabel> */}
                  </StyledTableCell>
                  <StyledTableCell size="small">
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
                  {[...Array(90).keys()].map((d, i) =>
                    (() => {
                      let date = moment(selectedDate)
                        .add(i, 'd')
                        .format('YYYY-MM-DD');
                      let day = moment(date).format('dddd').substring(0, 3);
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
                          {`${day.toUpperCase()}\n${moment(date).format(
                            'MM/DD'
                          )}`}
                        </StyledTableCell>
                      );
                    })()
                  )}
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
                      {_hotel.prices.map((dt, ix) => {
                        return dt !== null ? (
                          <StyledTableCell
                            size="small"
                            className={classes.rates}
                            style={{
                              backgroundColor:
                                CLUSTER_BACKGROUND[
                                  getClusterByPrice(
                                    dt.price[getPrice(dt.price)],
                                    ix
                                  )
                                ],
                            }}
                          >
                            <span className="font-weight-bold">
                              {dt.price[getPrice(dt.price)]}&nbsp;
                              <sup className="text-light font-weight-bold">
                                {getPrice(dt.price) + 1}
                              </sup>
                            </span>
                          </StyledTableCell>
                        ) : (
                          <StyledTableCell
                            size="small"
                            className={classes.rates}
                          >
                            N/A
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
