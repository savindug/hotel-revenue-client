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
import { useDispatch, useSelector } from 'react-redux';
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
  root: {},
}))(TableRow);
const useStyles = makeStyles({
  table: {
    '& .MuiTableCell-root': {
      borderLeft: '1px solid rgba(224, 224, 224, 1)',
    },
  },
});

export default function ClusterBucket({ cluster, stars }) {
  const classes = useStyles();

  const clusterBG = ['#BFBFBF', '#CCC0DA', '#C4D79B', '#DCE6F1'];

  const getClusterDataSet = useSelector((state) => state.clusterDataSet);
  const { loading, err, reqHotel } = getClusterDataSet;

  return (
    <>
      {!loading ? (
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
                  Your Property
                </StyledTableCell>
                <StyledTableCell size="small">Stars</StyledTableCell>
                {reqHotel.map((e, index) =>
                  (() => {
                    let date = moment(e.checkIn).format('dddd').substring(0, 3);
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
                        {`${date.toUpperCase()}\n${moment(e.checkIn).format(
                          'MM/DD'
                        )}`}
                      </StyledTableCell>
                    );
                  })()
                )}
              </TableHead>
              <TableBody>
                <StyledTableRow>
                  <StyledTableCell
                    size="medium"
                    component="th"
                    scope="col"
                    className="d-flex"
                    style={{ fontWeight: 'bold', width: '250px' }}
                  >
                    {reqHotel[0].name}
                  </StyledTableCell>

                  <StyledTableCell size="small">
                    {reqHotel[0].stars}
                  </StyledTableCell>
                  {reqHotel.map((e, index) => (
                    <StyledTableCell
                      size="small"
                      key={index}
                      style={{ backgroundColor: clusterBG[e.cluster - 2] }}
                    >
                      {e.rate}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className="d-flex"
                    style={{ fontWeight: 'bold', width: '250px' }}
                  >
                    Current Clustered Bucket
                  </StyledTableCell>

                  <StyledTableCell size="small">
                    {reqHotel[0].stars}
                  </StyledTableCell>
                  {reqHotel.map((e, index) => (
                    <StyledTableCell size="small" key={index}>
                      {e.cluster}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>

                <StyledTableRow>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className="d-flex"
                    style={{ fontWeight: 'bold', width: '250px' }}
                  >
                    Clustered Rate Bucket Position
                  </StyledTableCell>

                  <StyledTableCell size="small">
                    {reqHotel[0].stars}
                  </StyledTableCell>
                  {reqHotel.map((e, index) => (
                    <StyledTableCell
                      size="small"
                      key={index}
                      style={{ fontWeight: 'bold', fontSize: '12px' }}
                    >
                      {e.pos}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>

                <StyledTableRow>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className="d-flex"
                    style={{ fontWeight: 'bold', width: '250px' }}
                  >
                    Clustered Rate Bucket Rank (Highest to Lowest)
                  </StyledTableCell>

                  <StyledTableCell size="small">
                    {reqHotel[0].stars}
                  </StyledTableCell>
                  {reqHotel.map((e, index) => (
                    <StyledTableCell
                      size="small"
                      key={index}
                      style={{ fontSize: '11px' }}
                    >
                      {e.rank}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              </TableBody>
            </Table>
            <br />
          </Box>
        </TableContainer>
      ) : (
        <>loading</>
      )}
    </>
  );
}
