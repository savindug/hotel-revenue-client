import {
  Box,
  makeStyles,
  TableCell,
  TableContainer,
  TableRow,
  withStyles,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
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
    display: 'flex',
  },
});

export default function ClusterDataTable({ cluster, stars }) {
  const classes = useStyles();

  const [load, setLoad] = useState(true);

  useEffect(() => {
    //setStars((cluster.index += 2));

    setLoad(true);

    const setClusterAtributes = () => {};

    setClusterAtributes();
    setLoad(false);

    //console.log(`no of Hotels length : ${noOfHotels.length} => ${noOfHotels}`);
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
                  className={classes.sticky}
                  style={{
                    backgroundColor: CLUSTER_BACKGROUND[stars - 2],
                  }}
                >
                  {`${stars} Star Cluster Matrix`}
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
                        )}`}
                      </StyledTableCell>
                    );
                  })()
                )}
              </TableHead>
              <TableBody>
                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    className={classes.sticky}
                    size="medium"
                    component="th"
                    scope="col"
                    style={{ fontWeight: 'bold', width: '250px' }}
                  >
                    Number of Hotels
                  </StyledTableCell>

                  {cluster.map((e, index) => (
                    <StyledTableCell size="small" key={index}>
                      {e.items !== 'NaN' && e.items >= 3
                        ? Math.round(e.items)
                        : e.items !== 'NaN' && e.items < 3
                        ? 'NED'
                        : 'N/A'}
                    </StyledTableCell>
                  ))}
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

                  {cluster.map((e, index) => (
                    <StyledTableCell size="small" key={index}>
                      {e.mean !== 'NaN' && e.items >= 3
                        ? Math.round(e.mean)
                        : e.mean !== 'NaN' && e.items < 3
                        ? 'NED'
                        : 'N/A'}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>

                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className={classes.sticky}
                    style={{ fontWeight: 'bold', width: '250px' }}
                  >
                    Most Repeated rate (mode)
                  </StyledTableCell>

                  {cluster.map((e, index) => (
                    <StyledTableCell size="small" key={index}>
                      {e.mod !== 'NaN' && e.items >= 3
                        ? Math.round(e.mod)
                        : e.mod !== 'NaN' && e.items < 3
                        ? 'NED'
                        : 'N/A'}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>

                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className={classes.sticky}
                    style={{ fontWeight: 'bold', width: '250px' }}
                  >
                    Middle Rate
                  </StyledTableCell>

                  {cluster.map((e, index) => (
                    <StyledTableCell size="small" key={index}>
                      {e.median !== 'NaN' && e.items >= 3
                        ? Math.round(e.median)
                        : e.median !== 'NaN' && e.items < 3
                        ? 'NED'
                        : 'N/A'}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className={classes.sticky}
                    style={{ fontWeight: 'bold', width: '250px' }}
                  >
                    &emsp;Highest Rate
                  </StyledTableCell>

                  {cluster.map((e, index) => (
                    <StyledTableCell size="small" key={index}>
                      {e.max !== 'NaN' && e.items >= 3
                        ? Math.round(e.max)
                        : e.max !== 'NaN' && e.items < 3
                        ? 'NED'
                        : 'N/A'}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className={classes.sticky}
                    style={{ fontWeight: 'bold', width: '250px' }}
                  >
                    &emsp;&emsp;Average of Highest Rates
                  </StyledTableCell>

                  {cluster.map((e, index) => (
                    <StyledTableCell size="small" key={index}>
                      {e.highAVG !== 'NaN' && e.items >= 3
                        ? Math.round(e.highAVG)
                        : e.highAVG !== 'NaN' && e.items < 3
                        ? 'NED'
                        : 'N/A'}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className={classes.sticky}
                    style={{ fontWeight: 'bold', width: '250px' }}
                  >
                    &emsp;&emsp;Average of Middle Rates
                  </StyledTableCell>

                  {cluster.map((e, index) => (
                    <StyledTableCell size="small" key={index}>
                      {e.midAVG !== 'NaN' && e.items >= 3
                        ? Math.round(e.midAVG)
                        : e.midAVG !== 'NaN' && e.items < 3
                        ? 'NED'
                        : 'N/A'}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className={classes.sticky}
                    style={{ fontWeight: 'bold', width: '250px' }}
                  >
                    &emsp;&emsp;Average of Lowest Rates
                  </StyledTableCell>

                  {cluster.map((e, index) => (
                    <StyledTableCell size="small" key={index}>
                      {e.lowAVG !== 'NaN' && e.items >= 3
                        ? Math.round(e.lowAVG)
                        : e.lowAVG !== 'NaN' && e.items < 3
                        ? 'NED'
                        : 'N/A'}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className={classes.sticky}
                    style={{ fontWeight: 'bold', width: '250px' }}
                  >
                    &emsp;Lowest Rate
                  </StyledTableCell>

                  {cluster.map((e, index) => (
                    <StyledTableCell size="small" key={index}>
                      {e.min !== 'NaN' && e.items >= 3
                        ? Math.round(e.min)
                        : e.min !== 'NaN' && e.items < 3
                        ? 'NED'
                        : 'N/A'}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              </TableBody>
            </Table>
            <br />
          </Box>
        </TableContainer>
      ) : (
        <></>
      )}
    </>
  );
}
