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
  table: {
    '& .MuiTableCell-root': {
      borderLeft: '1px solid rgba(224, 224, 224, 1)',
    },
  },
});

export default function HotelDataTable() {
  const classes = useStyles();
  const [dates, setDates] = useState([]);
  const [hotelsList, setHotelsList] = useState([]);

  const getClusterDataSet = useSelector((state) => state.clusterDataSet);
  const { loading, err, hotels, quary } = getClusterDataSet;

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    const fetchHotelList = async () => {
      let hotelsArr = [];

      await hotels
        .slice(rowsPerPage * page, rowsPerPage * page + rowsPerPage)
        .map((hotel) => {
          hotelsArr.push(hotel);
        });

      setHotelsList(hotelsArr);
    };

    fetchHotelList();
  }, [hotels, rowsPerPage, page]);

  useEffect(() => {
    const hotelsList = async () => {
      let dateRange = [];

      for (let i = 0; i < 90; i++) {
        dateRange.push(moment(quary.CheckIn).subtract(i, 'd').format('MM/DD'));
      }

      await setDates(dateRange);
    };

    hotelsList();
  }, [quary.CheckIn, dates]);

  const DateColumns = (priceArr) => {
    let dateArr = [];
    dates.map((d) => {
      dateArr.push('N/A');
    });

    //console.log(`dateArr => ${dateArr}, length: ${dateArr.length}`);

    priceArr.map((rate) => {
      let ins = dates.findIndex((x) => x === moment(rate.date).format('MM/DD'));
      if (ins !== -1) {
        dateArr[ins] = rate.price;
      }
    });

    return (
      <>
        {dateArr.map((dt) => {
          return <StyledTableCell size="small">{dt}</StyledTableCell>;
        })}
      </>
    );
  };

  return (
    <>
      {loading ? (
        <LoadingOverlay show={loading} />
      ) : err ? (
        <Alert severity="error">{err}</Alert>
      ) : hotelsList.length > 0 && dates.length > 0 ? (
        <>
          <TableContainer component={Paper} className="my-5">
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
                  {dates.map((d) => {
                    return <StyledTableCell size="small">{d}</StyledTableCell>;
                  })}
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
                        className="d-flex"
                        style={{ fontWeight: 'bold', width: '250px' }}
                      >
                        {_hotel.hotelName}
                      </StyledTableCell>
                      <StyledTableCell size="small">
                        {_hotel.stars}
                      </StyledTableCell>
                      {DateColumns(_hotel.prices)}
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
              <br />
            </Box>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25]}
            component="div"
            count={hotels.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
}
