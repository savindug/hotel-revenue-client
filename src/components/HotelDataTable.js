import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  makeStyles,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  TableSortLabel,
  withStyles,
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';
import { Alert } from 'bootstrap';
import moment from 'moment';
import { LoadingOverlay } from './UI/LoadingOverlay';
import { AssignmentReturn, DirectionsBike } from '@material-ui/icons';
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
const useStyles = makeStyles({
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
});

export default function HotelDataTable({ selectedDate }) {
  const classes = useStyles();
  const [dates, setDates] = useState([]);
  const [sortDir, setSortDir] = useState();

  const [sortBy, setSortBy] = useState();

  // const [hotelsList, setHotelsList] = useState([]);
  const getClusterDataSet = useSelector((state) => state.clusterDataSet);
  const { loading, err, cluster1, cluster2, cluster3, cluster4, hotels } =
    getClusterDataSet;

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
        hotels.sort((a, b) => a.hotelName.localeCompare(b.hotelName));
      } else {
        hotels.sort((a, b) => b.hotelName.localeCompare(a.hotelName));
      }
    }

    if (sortBy === 1) {
      if (sortOrder === 'asc') {
        hotels.sort((a, b) => a.stars - b.stars);
      } else {
        hotels.sort((a, b) => b.stars - a.stars);
      }
    }
  };

  const handleSort = async (sb, sd) => {
    setSortBy(sb);
    setSortDir(sd);

    await sortData(sb, sd);
  };

  return (
    <>
      {hotels.length > 0 &&
      cluster1.length > 0 &&
      cluster2.length > 0 &&
      cluster3.length > 0 &&
      cluster4.length > 0 ? (
        <>
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
                    className={classes.sticky}
                    style={{ fontWeight: 'bold', width: '250px', zIndex: 100 }}
                  >
                    <TableSortLabel
                      active={sortBy === 0}
                      direction={sortDir}
                      onClick={() => {
                        handleSort(0, sortDir === 'asc' ? 'desc' : 'asc');
                      }}
                    >
                      Hotels
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
