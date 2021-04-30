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
    maxHeight: 500,
  },
  table: {
    '& .MuiTableCell-root': {
      borderLeft: '1px solid rgba(224, 224, 224, 1)',
    },
  },
});

export default function HotelDataTable({ selectedDate }) {
  const classes = useStyles();
  const [dates, setDates] = useState([]);
  const [sortBy, setSortBy] = useState({
    col: 0,
    dir: 0,
  });

  const clusterBG = ['#E6B8B8', '#CCC0DA', '#C4D79B', '#DCE6F1'];
  // const [hotelsList, setHotelsList] = useState([]);
  const getClusterDataSet = useSelector((state) => state.clusterDataSet);
  const {
    loading,
    err,
    cluster1,
    cluster2,
    cluster3,
    cluster4,
    hotels,
  } = getClusterDataSet;

  const getClusterByPrice = (rate, ix) => {
    if (rate >= cluster1[ix].min && rate <= cluster1[ix].max) {
      console.log(
        `${ix} => ${cluster1[ix].min} < ${rate} > ${cluster1[ix].max} `
      );
      return 0;
    }
    if (rate >= cluster2[ix].min && rate <= cluster2[ix].max) {
      console.log(
        `${ix} =>${cluster2[ix].min} < ${rate} > ${cluster2[ix].max} `
      );
      return 1;
    }
    if (rate >= cluster3[ix].min && rate <= cluster3[ix].max) {
      console.log(
        `${ix} =>${cluster3[ix].min} < ${rate} > ${cluster3[ix].max} `
      );
      return 2;
    }
    if (rate >= cluster4[ix].min && rate <= cluster4[ix].max) {
      console.log(
        `${ix} =>${cluster4[ix].min} < ${rate} > ${cluster4[ix].max} `
      );
      return 3;
    }
  };

  // useEffect(() => {
  //   if (hotels.length > 0) {
  //     if (sortBy.col === 0 && sortBy.dir === 0) {
  //       hotels.sort((a, b) => a.stars - b.stars);
  //     }
  //     if (sortBy.col === 0 && sortBy.dir === 1) {
  //       hotels.sort((a, b) => b.name - a.name);
  //     }

  //     if (sortBy.col === 1 && sortBy.dir === 0) {
  //       hotels.sort((a, b) => a.stars - b.stars);
  //     }
  //     if (sortBy.col === 1 && sortBy.dir === 1) {
  //       hotels.sort((a, b) => b.stars - a.stars);
  //     }
  //   }
  // }, [sortBy, hotels]);

  const handleSort = (col) => {
    setSortBy({
      col: col,
      dir: sortBy.dir === 0 ? 1 : 0,
    });
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
                    className="d-flex"
                    style={{ fontWeight: 'bold', width: '250px' }}
                  >
                    Hotels
                    {/* <TableSortLabel onClick={handleSort(0)}></TableSortLabel> */}
                  </StyledTableCell>
                  <StyledTableCell size="small">Stars</StyledTableCell>
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
                              ? 'bg-secondary text-light text-center'
                              : 'text-center'
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
                        className="d-flex"
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
                                clusterBG[getClusterByPrice(dt.price, ix)],
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
