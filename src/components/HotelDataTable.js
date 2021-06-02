import React from 'react';
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
import { CLUSTER_BACKGROUND } from '../utils/const';

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

  const getClusterByPrice = (rate, ix) => {
    if (rate >= cluster1[ix].min && rate <= cluster1[ix].max) {
      // console.log(
      //   `${ix} => ${cluster1[ix].min} < ${rate} > ${cluster1[ix].max} `
      // );
      return 0;
    }
    if (rate >= cluster2[ix].min && rate <= cluster2[ix].max) {
      // console.log(
      //   `${ix} =>${cluster2[ix].min} < ${rate} > ${cluster2[ix].max} `
      // );
      return 1;
    }
    if (rate >= cluster3[ix].min && rate <= cluster3[ix].max) {
      // console.log(
      //   `${ix} =>${cluster3[ix].min} < ${rate} > ${cluster3[ix].max} `
      // );
      return 2;
    }
    if (rate >= cluster4[ix].min && rate <= cluster4[ix].max) {
      // console.log(
      //   `${ix} =>${cluster4[ix].min} < ${rate} > ${cluster4[ix].max} `
      // );
      return 3;
    }
  };

  const sortData = (sortBy, sortOrder) => {
    // alert(`sortData (${sortBy}, ${sortOrder})`);
    if (sortBy === 0) {
      if (sortOrder === 'asc') {
        hotels.sort(
          (a, b) => a.hotelName.localeCompare(b.hotelName) || b.stars - a.stars
        );
      } else {
        hotels.sort(
          (a, b) => b.hotelName.localeCompare(a.hotelName) || b.stars - a.stars
        );
      }
    }

    if (sortBy === 1) {
      if (sortOrder === 'asc') {
        hotels.sort(
          (a, b) => a.stars - b.stars || a.hotelName.localeCompare(b.hotelName)
        );
      } else {
        hotels.sort(
          (a, b) => b.stars - a.stars || a.hotelName.localeCompare(b.hotelName)
        );
      }
    }
  };

  const handleSort = async (sb, sd) => {
    setSortBy(sb);
    setSortDir(sd);

    await sortData(sb, sd);
  };

  const [hotelsList, setHotelsList] = useState(hotels);

  const handleHotelsFilter = async (event) => {
    if (event.target.value == 0) {
      const selectedHotels = [];
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

  return (
    <>
      {hotels.length > 0 &&
      cluster1.length > 0 &&
      cluster2.length > 0 &&
      cluster3.length > 0 &&
      cluster4.length > 0 ? (
        <>
          <Grid container justify="space-around" className="my-3">
            <FormGroup className={classes.formControl}>
              <InputLabel htmlFor="grouped-native-select">
                Hotels Filter
              </InputLabel>
              <Select
                native
                id="grouped-native-select"
                onChange={handleHotelsFilter}
              >
                <option value={1}>All Hotels</option>
                <option value={0}>Selected Hotels</option>
              </Select>
            </FormGroup>
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
                bodyStyle={{ overflow: 'visible' }}
              >
                <TableHead>
                  <StyledTableCell size="small">#</StyledTableCell>
                  <StyledTableCell
                    style={{ fontWeight: 'bold', width: '250px', zIndex: 100 }}
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
                  {hotels[0].prices.map((d, i) =>
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
                        style={{ fontWeight: 'bold', width: '250px' }}
                      >
                        {_hotel.hotelName}
                      </StyledTableCell>
                      <StyledTableCell size="small">
                        {_hotel.stars}
                      </StyledTableCell>
                      {_hotel.prices.map((dt, ix) => {
                        return dt !== null ? (
                          <StyledTableCell
                            size="small"
                            style={{
                              backgroundColor:
                                CLUSTER_BACKGROUND[
                                  getClusterByPrice(dt.price, ix)
                                ],
                            }}
                          >
                            {dt.price}
                          </StyledTableCell>
                        ) : (
                          <StyledTableCell size="small">N/A</StyledTableCell>
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
