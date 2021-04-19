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

export default function DataTable({ cluster, stars }) {
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
              stickyHeader
              bodyStyle={{ overflow: 'visible' }}
            >
              <TableHead>
                <StyledTableCell
                  className="d-flex"
                  style={{ fontWeight: 'bold', width: '250px' }}
                >
                  {`${stars} Star Cluster Matrix`}
                </StyledTableCell>
                <StyledTableCell size="small">Stars</StyledTableCell>
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
                    size="medium"
                    component="th"
                    scope="col"
                    className="d-flex"
                    style={{ fontWeight: 'bold', width: '250px' }}
                  >
                    Number of Hotels
                  </StyledTableCell>
                  <StyledTableCell size="small">{stars}</StyledTableCell>
                  {cluster.map((e, index) => (
                    <StyledTableCell size="small" key={index}>
                      {e.items !== 'NaN' ? Math.round(e.items) : 'N/A'}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className="d-flex"
                    style={{ fontWeight: 'bold', width: '250px' }}
                  >
                    Average Rate
                  </StyledTableCell>
                  <StyledTableCell size="small">{stars}</StyledTableCell>
                  {cluster.map((e, index) => (
                    <StyledTableCell size="small" key={index}>
                      {e.mean !== 'NaN' ? Math.round(e.mean) : 'N/A'}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>

                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className="d-flex"
                    style={{ fontWeight: 'bold', width: '250px' }}
                  >
                    Most Repeated rate (mode)
                  </StyledTableCell>
                  <StyledTableCell size="small">{stars}</StyledTableCell>
                  {cluster.map((e, index) => (
                    <StyledTableCell size="small" key={index}>
                      {e.mod !== 'NaN' ? Math.round(e.mod) : 'N/A'}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>

                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className="d-flex"
                    style={{ fontWeight: 'bold', width: '250px' }}
                  >
                    Middle Rate
                  </StyledTableCell>
                  <StyledTableCell size="small">{stars}</StyledTableCell>
                  {cluster.map((e, index) => (
                    <StyledTableCell size="small" key={index}>
                      {e.median !== 'NaN' ? Math.round(e.median) : 'N/A'}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className="d-flex"
                    style={{ fontWeight: 'bold', width: '250px' }}
                  >
                    &emsp;Highest Rate
                  </StyledTableCell>
                  <StyledTableCell size="small">{stars}</StyledTableCell>
                  {cluster.map((e, index) => (
                    <StyledTableCell size="small" key={index}>
                      {e.max !== 'NaN' ? Math.round(e.max) : 'N/A'}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className="d-flex"
                    style={{ fontWeight: 'bold', width: '250px' }}
                  >
                    &emsp;&emsp;Average of the Highest Rate
                  </StyledTableCell>
                  <StyledTableCell size="small">{stars}</StyledTableCell>
                  {cluster.map((e, index) => (
                    <StyledTableCell size="small" key={index}>
                      {e.highAVG !== 'NaN' ? Math.round(e.highAVG) : 'N/A'}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className="d-flex"
                    style={{ fontWeight: 'bold', width: '250px' }}
                  >
                    &emsp;&emsp;Average of the Middle Rate
                  </StyledTableCell>
                  <StyledTableCell size="small">{stars}</StyledTableCell>
                  {cluster.map((e, index) => (
                    <StyledTableCell size="small" key={index}>
                      {e.midAVG !== 'NaN' ? Math.round(e.midAVG) : 'N/A'}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className="d-flex"
                    style={{ fontWeight: 'bold', width: '250px' }}
                  >
                    &emsp;&emsp;Average of the Lowest Rate
                  </StyledTableCell>
                  <StyledTableCell size="small">{stars}</StyledTableCell>
                  {cluster.map((e, index) => (
                    <StyledTableCell size="small" key={index}>
                      {e.lowAVG !== 'NaN' ? Math.round(e.lowAVG) : 'N/A'}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className="d-flex"
                    style={{ fontWeight: 'bold', width: '250px' }}
                  >
                    &emsp;Lowest Rate
                  </StyledTableCell>
                  <StyledTableCell size="small">{stars}</StyledTableCell>
                  {cluster.map((e, index) => (
                    <StyledTableCell size="small" key={index}>
                      {e.min !== 'NaN' ? Math.round(e.min) : 'N/A'}
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
