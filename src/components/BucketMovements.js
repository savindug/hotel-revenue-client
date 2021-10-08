import {
  Box,
  makeStyles,
  TableCell,
  TableContainer,
  TableRow,
  TableSortLabel,
  withStyles,
} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { CLUSTER_BACKGROUND, FONT_FAMILY } from '../utils/const';
import { useEffect, useState } from 'react';

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
  root: {},
}))(TableRow);
const useStyles = makeStyles({
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
    display: 'block',
  },
  rates: {
    fontFamily: FONT_FAMILY,
  },
});

export default function BucketMovements({ selectedDate }) {
  const classes = useStyles();

  const getClusterDataSet = useSelector((state) => state.clusterDataSet);
  const { loading, reqHotel, cluster1, cluster2, cluster3, cluster4, hotels } =
    getClusterDataSet;

  const getFilterHotels = (arr) => {
    if (hotels.length > 0) {
      const allowedMatrkets = arr.filter(({ id: id1 }) =>
        hotels.some(({ hotelID: id2 }) => id2 === id1)
      );
      return allowedMatrkets;
    }
  };

  const getPricingUps = (stars) => {
    [...Array(90).keys()].map((day) => {});
  };

  return (
    <>
      {!loading ? (
        <>
          <TableContainer component={Paper} className="my-5">
            <Box width={100}>
              <Table
                className={classes.table}
                size="medium"
                aria-label="customized table"
                bodyStyle={{ overflow: 'visible' }}
              >
                <TableHead>
                  <StyledTableCell
                    style={{ fontWeight: 'bold', width: '250px' }}
                    className={classes.sticky}
                  >
                    Net Bucket Movements <hr />
                    Days Out
                  </StyledTableCell>
                  {/* <StyledTableCell size="small">Stars</StyledTableCell> */}
                  {[...Array(90).keys()].map((e, index) =>
                    (() => {
                      let day = moment(selectedDate)
                        .add(index, 'd')
                        .format('YYYY-MM-DD');
                      let date = moment(day).format('dddd').substring(0, 3);
                      return (
                        <StyledTableCell
                          size="small"
                          key={index}
                          className={
                            date === 'Sat' || date === 'Fri'
                              ? 'bg-secondary text-light text-center'
                              : 'text-center'
                          }
                          style={{ fontSize: '12px' }}
                        >
                          {`${date.toUpperCase()}\n${moment(day).format(
                            'MM/DD'
                          )}`}
                          <hr />
                          {index}
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
                      style={{
                        fontWeight: 'bold',
                        width: '250px',
                        backgroundColor: CLUSTER_BACKGROUND[3],
                      }}
                    >
                      5 Star Pricing Down
                    </StyledTableCell>
                    {/* <StyledTableCell size="small"></StyledTableCell> */}
                    {[...Array(90).keys()].map((e, index) =>
                      (() => {
                        let hotel_count = 0;
                        hotel_count =
                          hotel_count + cluster2[index].stars5.length;
                        hotel_count =
                          hotel_count + cluster1[index].stars5.length;
                        hotel_count =
                          hotel_count + cluster3[index].stars5.length;
                        return (
                          <StyledTableCell
                            size="small"
                            key={index}
                            style={{ fontSize: '14px' }}
                            className={classes.rates}
                          >
                            {hotel_count}
                          </StyledTableCell>
                        );
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
                        backgroundColor: CLUSTER_BACKGROUND[2],
                      }}
                    >
                      4 Star Pricing Up
                    </StyledTableCell>
                    {/* <StyledTableCell size="small"></StyledTableCell> */}
                    {[...Array(90).keys()].map((e, index) =>
                      (() => {
                        let hotel_count = 0;
                        hotel_count =
                          hotel_count + cluster4[index].stars4.length;
                        return (
                          <StyledTableCell
                            size="small"
                            key={index}
                            style={{ fontSize: '14px' }}
                            className={classes.rates}
                          >
                            {hotel_count}
                          </StyledTableCell>
                        );
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
                        backgroundColor: CLUSTER_BACKGROUND[2],
                      }}
                    >
                      4 Star Pricing Down
                    </StyledTableCell>
                    {/* <StyledTableCell size="small"></StyledTableCell> */}
                    {[...Array(90).keys()].map((e, index) =>
                      (() => {
                        let hotel_count = 0;
                        hotel_count =
                          hotel_count + cluster2[index].stars4.length;
                        hotel_count =
                          hotel_count + cluster1[index].stars4.length;
                        return (
                          <StyledTableCell
                            size="small"
                            key={index}
                            style={{ fontSize: '14px' }}
                            className={classes.rates}
                          >
                            {hotel_count}
                          </StyledTableCell>
                        );
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
                        backgroundColor: CLUSTER_BACKGROUND[1],
                      }}
                    >
                      3 Star Pricing Up
                    </StyledTableCell>
                    {/* <StyledTableCell size="small"></StyledTableCell> */}
                    {[...Array(90).keys()].map((e, index) =>
                      (() => {
                        let hotel_count = 0;
                        hotel_count =
                          hotel_count + cluster3[index].stars3.length;
                        hotel_count =
                          hotel_count + cluster4[index].stars3.length;
                        return (
                          <StyledTableCell
                            size="small"
                            key={index}
                            style={{ fontSize: '14px' }}
                            className={classes.rates}
                          >
                            {hotel_count}
                          </StyledTableCell>
                        );
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
                        backgroundColor: CLUSTER_BACKGROUND[1],
                      }}
                    >
                      3 Star Pricing Down
                    </StyledTableCell>
                    {/* <StyledTableCell size="small"></StyledTableCell> */}
                    {[...Array(90).keys()].map((e, index) =>
                      (() => {
                        let hotel_count = 0;
                        hotel_count =
                          hotel_count + cluster1[index].stars3.length;
                        return (
                          <StyledTableCell
                            size="small"
                            key={index}
                            style={{ fontSize: '14px' }}
                            className={classes.rates}
                          >
                            {hotel_count}
                          </StyledTableCell>
                        );
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
                        backgroundColor: CLUSTER_BACKGROUND[0],
                      }}
                    >
                      2 Star Pricing Up
                    </StyledTableCell>
                    {/* <StyledTableCell size="small"></StyledTableCell> */}
                    {[...Array(90).keys()].map((e, index) =>
                      (() => {
                        let hotel_count = 0;
                        hotel_count =
                          hotel_count + cluster2[index].stars2.length;
                        hotel_count =
                          hotel_count + cluster3[index].stars2.length;
                        hotel_count =
                          hotel_count + cluster4[index].stars2.length;
                        return (
                          <StyledTableCell
                            size="small"
                            key={index}
                            style={{ fontSize: '14px' }}
                            className={classes.rates}
                          >
                            {hotel_count}
                          </StyledTableCell>
                        );
                      })()
                    )}
                  </StyledTableRow>
                </TableBody>
              </Table>
            </Box>
          </TableContainer>

          <TableContainer component={Paper} className="my-5">
            <Box width={100}>
              <Table
                className={classes.table}
                aria-label="customized table"
                bodyStyle={{ overflow: 'visible' }}
              >
                <TableHead>
                  <StyledTableCell
                    style={{ fontWeight: 'bold', width: '250px' }}
                    className={classes.sticky}
                  >
                    Hotels Count <hr />
                    Days Out
                  </StyledTableCell>
                  {/* <StyledTableCell size="small">Stars</StyledTableCell> */}
                  {[...Array(90).keys()].map((e, index) =>
                    (() => {
                      let day = moment(selectedDate)
                        .add(index, 'd')
                        .format('YYYY-MM-DD');
                      let date = moment(day).format('dddd').substring(0, 3);
                      return (
                        <StyledTableCell
                          size="small"
                          key={index}
                          className={
                            date === 'Sat' || date === 'Fri'
                              ? 'bg-secondary text-light text-center'
                              : 'text-center'
                          }
                          style={{ fontSize: '12px' }}
                        >
                          {`${date.toUpperCase()}\n${moment(day).format(
                            'MM/DD'
                          )}`}
                          <hr />
                          {index}
                        </StyledTableCell>
                      );
                    })()
                  )}
                </TableHead>
                <TableBody>
                  <StyledTableRow>
                    <StyledTableCell
                      component="th"
                      scope="row"
                      className={classes.sticky}
                      style={{
                        fontWeight: 'bold',
                        width: '250px',
                        backgroundColor: CLUSTER_BACKGROUND[3],
                        borderTop: '2px solid grey',
                      }}
                    >
                      5 Star Cluster Hotels
                      <div className="text-center">
                        <hr />
                        5-stars <hr /> 4-stars <hr /> 3-stars
                        <hr />
                        2-stars{' '}
                      </div>
                    </StyledTableCell>
                    {/* <StyledTableCell size="small"></StyledTableCell> */}
                    {cluster4.map((day, index) => (
                      <StyledTableCell
                        component="th"
                        scope="row"
                        key={index}
                        style={{
                          fontSize: '14px',
                          borderTop: '2px solid grey',
                        }}
                        className={classes.rates}
                      >
                        <p className="font-weight-bold">
                          {getFilterHotels(day.stars2).length +
                            getFilterHotels(day.stars3).length +
                            getFilterHotels(day.stars4).length +
                            getFilterHotels(day.stars5).length}
                        </p>
                        <hr />
                        {getFilterHotels(day.stars5).length} <hr />{' '}
                        {getFilterHotels(day.stars4).length} <hr />{' '}
                        {getFilterHotels(day.stars3).length} <hr />{' '}
                        {getFilterHotels(day.stars2).length}
                      </StyledTableCell>
                    ))}
                  </StyledTableRow>
                  <StyledTableRow>
                    <StyledTableCell
                      component="th"
                      scope="row"
                      className={classes.sticky}
                      style={{
                        fontWeight: 'bold',
                        width: '250px',
                        backgroundColor: CLUSTER_BACKGROUND[2],
                        borderTop: '2px solid grey',
                      }}
                    >
                      4 Star Cluster Hotels
                      <div className="text-center">
                        <hr />
                        5-stars <hr /> 4-stars <hr /> 3-stars
                        <hr />
                        2-stars{' '}
                      </div>
                    </StyledTableCell>
                    {/* <StyledTableCell size="small"></StyledTableCell> */}
                    {cluster3.map((day, index) => (
                      <StyledTableCell
                        component="th"
                        scope="row"
                        key={index}
                        style={{
                          fontSize: '14px',
                          borderTop: '2px solid grey',
                        }}
                        className={classes.rates}
                      >
                        <p className="font-weight-bold">
                          {getFilterHotels(day.stars2).length +
                            getFilterHotels(day.stars3).length +
                            getFilterHotels(day.stars4).length +
                            getFilterHotels(day.stars5).length}
                        </p>
                        <hr />
                        {getFilterHotels(day.stars5).length} <hr />{' '}
                        {getFilterHotels(day.stars4).length} <hr />{' '}
                        {getFilterHotels(day.stars3).length} <hr />{' '}
                        {getFilterHotels(day.stars2).length}
                      </StyledTableCell>
                    ))}
                  </StyledTableRow>

                  <StyledTableRow>
                    <StyledTableCell
                      component="th"
                      scope="row"
                      className={classes.sticky}
                      style={{
                        fontWeight: 'bold',
                        width: '250px',
                        backgroundColor: CLUSTER_BACKGROUND[1],
                        borderTop: '2px solid grey',
                      }}
                    >
                      3 Star Cluster hotels
                      <div className="text-center">
                        <hr />
                        5-stars <hr /> 4-stars <hr /> 3-stars
                        <hr />
                        2-stars{' '}
                      </div>
                    </StyledTableCell>
                    {/* <StyledTableCell size="small"></StyledTableCell> */}
                    {cluster2.map((day, index) => (
                      <StyledTableCell
                        component="th"
                        scope="row"
                        key={index}
                        style={{
                          fontSize: '14px',
                          borderTop: '2px solid grey',
                        }}
                        className={classes.rates}
                      >
                        <p className="font-weight-bold">
                          {getFilterHotels(day.stars2).length +
                            getFilterHotels(day.stars3).length +
                            getFilterHotels(day.stars4).length +
                            getFilterHotels(day.stars5).length}
                        </p>
                        <hr />
                        {getFilterHotels(day.stars5).length} <hr />{' '}
                        {getFilterHotels(day.stars4).length} <hr />{' '}
                        {getFilterHotels(day.stars3).length} <hr />{' '}
                        {getFilterHotels(day.stars2).length}
                      </StyledTableCell>
                    ))}
                  </StyledTableRow>

                  <StyledTableRow>
                    <StyledTableCell
                      component="th"
                      scope="row"
                      className={classes.sticky}
                      style={{
                        fontWeight: 'bold',
                        width: '250px',
                        backgroundColor: CLUSTER_BACKGROUND[0],
                        borderTop: '2px solid grey',
                      }}
                    >
                      2 Star Cluster Hotels
                      <div className="text-center">
                        <hr />
                        5-stars <hr /> 4-stars <hr /> 3-stars
                        <hr />
                        2-stars{' '}
                      </div>
                    </StyledTableCell>
                    {/* <StyledTableCell size="small"></StyledTableCell> */}
                    {cluster1.map((day, index) => (
                      <StyledTableCell
                        component="th"
                        scope="row"
                        key={index}
                        style={{
                          fontSize: '14px',
                          borderTop: '2px solid grey',
                        }}
                        className={classes.rates}
                      >
                        <p className="font-weight-bold">
                          {getFilterHotels(day.stars2).length +
                            getFilterHotels(day.stars3).length +
                            getFilterHotels(day.stars4).length +
                            getFilterHotels(day.stars5).length}
                        </p>
                        <hr />
                        {getFilterHotels(day.stars5).length} <hr />{' '}
                        {getFilterHotels(day.stars4).length} <hr />{' '}
                        {getFilterHotels(day.stars3).length} <hr />{' '}
                        {getFilterHotels(day.stars2).length}
                      </StyledTableCell>
                    ))}
                  </StyledTableRow>
                </TableBody>
              </Table>
            </Box>
          </TableContainer>
        </>
      ) : (
        <>loading</>
      )}
    </>
  );
}
