import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  makeStyles,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
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
import { AssignmentReturn } from '@material-ui/icons';

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

  const clusterBG = ['#BFBFBF', '#CCC0DA', '#C4D79B', '#DCE6F1'];
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

  // const [page, setPage] = React.useState(0);
  // const [rowsPerPage, setRowsPerPage] = React.useState(25);

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(+event.target.value);
  //   setPage(0);
  // };

  // useEffect(() => {
  //   const fetchHotelList = async () => {
  //     let hotelsArr = [];

  //     await hotels
  //       .slice(rowsPerPage * page, rowsPerPage * page + rowsPerPage)
  //       .map((hotel) => {
  //         hotelsArr.push(hotel);
  //       });

  //     setHotelsList(hotelsArr);
  //   };

  //   fetchHotelList();
  // }, [hotels, rowsPerPage, page]);

  // useEffect(() => {
  //   const datesList = async () => {
  //     let dateRange = [];

  //     for (let i = 0; i < 90; i++) {
  //       dateRange.push(moment(selectedDate).add(i, 'd').format('MM/DD'));
  //     }

  //     await setDates(dateRange);
  //   };

  //   datesList();
  // }, [dates]);

  // const DateColumns = (priceArr) => {
  //   let dateArr = [];
  //   dates.map((d) => {
  //     dateArr.push('N/A');
  //   });

  //   //console.log(`dateArr => ${dateArr}, length: ${dateArr.length}`);

  //   priceArr.map((rate) => {
  //     let ins = dates.findIndex((x) => x === moment(rate.date).format('MM/DD'));
  //     if (ins !== -1) {
  //       dateArr[ins] = rate.price;
  //     }
  //   });

  //   return (
  //     <>
  //       {dateArr.map((dt) => {
  //         return <StyledTableCell size="small">{dt}</StyledTableCell>;
  //       })}
  //     </>
  //   );
  // };

  const getClusterByPrice = (rate, ix) => {
    console.log('rate: ' + rate + 'cluster1.min: ' + cluster1.min);
    if (rate >= cluster1[ix].min && rate <= cluster1[ix].max) {
      //console.log(`${cluster1.min} < ${rate} > ${cluster1.max} `);
      return 0;
    }
    if (rate >= cluster2[ix].min && rate <= cluster2[ix].max) {
      //console.log(`${cluster2.min} < ${rate} > ${cluster2.max} `);
      return 1;
    }
    if (rate >= cluster3[ix].min && rate <= cluster3[ix].max) {
      //console.log(`${cluster3.min} < ${rate} > ${cluster3.max} `);
      return 2;
    }
    if (rate >= cluster4[ix].min && rate <= cluster4[ix].max) {
      //console.log(`${cluster4.min} < ${rate} > ${cluster4.max} `);
      return 3;
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
                  </StyledTableCell>
                  <StyledTableCell size="small">Stars</StyledTableCell>
                  {hotels[0].prices.map((d, i) =>
                    (() => {
                      let date = moment(selectedDate)
                        .add(i, 'd')
                        .format('YYYY-MM-DD');
                      let day = moment(date).format('dddd').substring(0, 3);
                      console.log('selectedDate+: ' + date + ', day: ' + day);
                      return (
                        <StyledTableCell
                          size="small"
                          key={i}
                          className={
                            day === 'Sat' || day === 'Fri'
                              ? 'bg-secondary text-light'
                              : ''
                          }
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
