import {
  Box,
  makeStyles,
  TableCell,
  TableContainer,
  TableRow,
  TableSortLabel,
  withStyles,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import { CLUSTER_BACKGROUND, FONT_FAMILY } from '../utils/const';
import { LoadingOverlay } from './UI/LoadingOverlay';
import { useDispatch, useSelector } from 'react-redux';
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
    fontWeight: 'bolder',
  },
  body: {
    fontSize: 15,
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

export default function UnClusteredMatrix({ cluster, stars }) {
  const classes = useStyles();
  const getClusterDataSet = useSelector((state) => state.clusterDataSet);
  const { clusterData, loading, err, cluster1, cluster2, cluster3, cluster4 } =
    getClusterDataSet;

  const [load, setLoad] = useState(true);

  useEffect(() => {
    //setStars((cluster.index += 2));
    setLoad(true);
    //console.log(`no of Hotels length : ${noOfHotels.length} => ${noOfHotels}`);
    setLoad(false);
  }, []);

  return (
    <>
      {!load ? (
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
                  style={{
                    backgroundColor: CLUSTER_BACKGROUND[stars - 2],
                  }}
                  className={classes.sticky}
                >
                  <TableSortLabel disabled>
                    {' '}
                    {`${stars} Star Matrix`}
                  </TableSortLabel>{' '}
                  <hr />
                  <TableSortLabel disabled> Days Out</TableSortLabel>
                </StyledTableCell>
                {cluster.map((e, index) =>
                  (() => {
                    let date = moment(e.date).format('dddd').substring(0, 3);
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
                        {`${date.toUpperCase()}\n${moment(e.date).format(
                          'MM/DD'
                        )}`}{' '}
                        <hr />
                        {index}
                      </StyledTableCell>
                    );
                  })()
                )}
              </TableHead>
              <TableBody>
                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className={classes.sticky}
                    style={{ fontWeight: 'bold', width: '250px' }}
                  >
                    Highest Rate
                  </StyledTableCell>

                  {[...Array(90).keys()].map((e, index) => {
                    let hotelsSet = [];
                    if (stars == 2) {
                      hotelsSet = [
                        ...cluster1[index].stars2.map((e) => e.rate),
                        ...cluster2[index].stars2.map((e) => e.rate),
                        ...cluster3[index].stars2.map((e) => e.rate),
                        ...cluster4[index].stars2.map((e) => e.rate),
                      ];
                    }
                    if (stars == 3) {
                      hotelsSet = [
                        ...cluster1[index].stars3.map((e) => e.rate),
                        ...cluster2[index].stars3.map((e) => e.rate),
                        ...cluster3[index].stars3.map((e) => e.rate),
                        ...cluster4[index].stars3.map((e) => e.rate),
                      ];
                    }
                    if (stars == 4) {
                      hotelsSet = [
                        ...cluster1[index].stars4.map((e) => e.rate),
                        ...cluster2[index].stars4.map((e) => e.rate),
                        ...cluster3[index].stars4.map((e) => e.rate),
                        ...cluster4[index].stars4.map((e) => e.rate),
                      ];
                    }
                    if (stars == 5) {
                      hotelsSet = [
                        ...cluster1[index].stars5.map((e) => e.rate),
                        ...cluster2[index].stars5.map((e) => e.rate),
                        ...cluster3[index].stars5.map((e) => e.rate),
                        ...cluster4[index].stars5.map((e) => e.rate),
                      ];
                    }

                    return (
                      <StyledTableCell
                        size="small"
                        key={index}
                        className={classes.rates}
                      >
                        {Math.max(...hotelsSet)}
                      </StyledTableCell>
                    );
                  })}
                </StyledTableRow>

                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className={classes.sticky}
                    style={{ fontWeight: 'bold', width: '250px' }}
                  >
                    Average Rate
                  </StyledTableCell>

                  {[...Array(90).keys()].map((e, index) => {
                    let hotelsSet = [];
                    if (stars == 2) {
                      hotelsSet = [
                        ...cluster1[index].stars2.map((e) => e.rate),
                        ...cluster2[index].stars2.map((e) => e.rate),
                        ...cluster3[index].stars2.map((e) => e.rate),
                        ...cluster4[index].stars2.map((e) => e.rate),
                      ];
                    }
                    if (stars == 3) {
                      hotelsSet = [
                        ...cluster1[index].stars3.map((e) => e.rate),
                        ...cluster2[index].stars3.map((e) => e.rate),
                        ...cluster3[index].stars3.map((e) => e.rate),
                        ...cluster4[index].stars3.map((e) => e.rate),
                      ];
                    }
                    if (stars == 4) {
                      hotelsSet = [
                        ...cluster1[index].stars4.map((e) => e.rate),
                        ...cluster2[index].stars4.map((e) => e.rate),
                        ...cluster3[index].stars4.map((e) => e.rate),
                        ...cluster4[index].stars4.map((e) => e.rate),
                      ];
                    }
                    if (stars == 5) {
                      hotelsSet = [
                        ...cluster1[index].stars5.map((e) => e.rate),
                        ...cluster2[index].stars5.map((e) => e.rate),
                        ...cluster3[index].stars5.map((e) => e.rate),
                        ...cluster4[index].stars5.map((e) => e.rate),
                      ];
                    }

                    let tot = 0;
                    hotelsSet.map((e) => {
                      //console.log(e);
                      tot += e;
                    });
                    let avg = tot / hotelsSet.length;
                    return (
                      <StyledTableCell
                        size="small"
                        key={index}
                        className={classes.rates}
                      >
                        {parseInt(avg, 10)}
                      </StyledTableCell>
                    );
                  })}
                </StyledTableRow>

                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className={classes.sticky}
                    style={{ fontWeight: 'bold', width: '250px' }}
                  >
                    Lowest Rate
                  </StyledTableCell>

                  {[...Array(90).keys()].map((e, index) => {
                    let hotelsSet = [];
                    if (stars == 2) {
                      hotelsSet = [
                        ...cluster1[index].stars2.map((e) => e.rate),
                        ...cluster2[index].stars2.map((e) => e.rate),
                        ...cluster3[index].stars2.map((e) => e.rate),
                        ...cluster4[index].stars2.map((e) => e.rate),
                      ];
                    }
                    if (stars == 3) {
                      hotelsSet = [
                        ...cluster1[index].stars3.map((e) => e.rate),
                        ...cluster2[index].stars3.map((e) => e.rate),
                        ...cluster3[index].stars3.map((e) => e.rate),
                        ...cluster4[index].stars3.map((e) => e.rate),
                      ];
                    }
                    if (stars == 4) {
                      hotelsSet = [
                        ...cluster1[index].stars4.map((e) => e.rate),
                        ...cluster2[index].stars4.map((e) => e.rate),
                        ...cluster3[index].stars4.map((e) => e.rate),
                        ...cluster4[index].stars4.map((e) => e.rate),
                      ];
                    }
                    if (stars == 5) {
                      hotelsSet = [
                        ...cluster1[index].stars5.map((e) => e.rate),
                        ...cluster2[index].stars5.map((e) => e.rate),
                        ...cluster3[index].stars5.map((e) => e.rate),
                        ...cluster4[index].stars5.map((e) => e.rate),
                      ];
                    }

                    return (
                      <StyledTableCell
                        size="small"
                        key={index}
                        className={classes.rates}
                      >
                        {Math.min(...hotelsSet)}
                      </StyledTableCell>
                    );
                  })}
                </StyledTableRow>
              </TableBody>
            </Table>
            <br />
          </Box>
        </TableContainer>
      ) : (
        <LoadingOverlay show={load} />
      )}
    </>
  );
}
