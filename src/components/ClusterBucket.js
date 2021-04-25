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

  const clusterBG = ['#E6B8B8', '#CCC0DA', '#C4D79B', '#DCE6F1'];

  const getClusterDataSet = useSelector((state) => state.clusterDataSet);
  const { loading, err, reqHotel, cluster1,
    cluster2,
    cluster3,
    cluster4,
    hotels } = getClusterDataSet;


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
                        style={{ fontSize: '14px' }}
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
                    Cluster Outliers
                </StyledTableCell>
                  <StyledTableCell size="small">Stars</StyledTableCell>
                  {cluster1.map((e, index) =>
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
                  <StyledTableRow>
                    <StyledTableCell
                      size="small"
                      component="th"
                      scope="row"
                      className="d-flex"
                      style={{
                        fontWeight: 'bold', width: '250px', backgroundColor:
                          clusterBG[3]
                      }}
                    >
                      5 Star Pricing Up
                  </StyledTableCell>
                    <StyledTableCell size="small">
                    </StyledTableCell>
                    {cluster4.map((day, index) =>
                      (
                        <StyledTableCell
                          size="small"
                          key={index}
                          style={{ fontSize: '14px' }}
                        >
                          {day.outliers_up.length}
                        </StyledTableCell>
                      )
                    )}

                  </StyledTableRow>

                  <StyledTableRow>
                    <StyledTableCell
                      size="small"
                      component="th"
                      scope="row"
                      className="d-flex"
                      style={{
                        fontWeight: 'bold', width: '250px', backgroundColor:
                          clusterBG[3]
                      }}
                    >
                      5 Star Pricing Down
                  </StyledTableCell>
                    <StyledTableCell size="small">
                    </StyledTableCell>
                    {cluster4.map((day, index) =>
                      (
                        <StyledTableCell
                          size="small"
                          key={index}
                          style={{ fontSize: '14px' }}
                        >
                          {day.outliers_down.length}
                        </StyledTableCell>
                      )
                    )}

                  </StyledTableRow>

                  <StyledTableRow>
                    <StyledTableCell
                      size="small"
                      component="th"
                      scope="row"
                      className="d-flex"
                      style={{
                        fontWeight: 'bold', width: '250px', backgroundColor:
                          clusterBG[2]
                      }}
                    >
                      4 Star Pricing Up
                  </StyledTableCell>
                    <StyledTableCell size="small">
                    </StyledTableCell>
                    {cluster3.map((day, index) =>
                      (
                        <StyledTableCell
                          size="small"
                          key={index}
                          style={{ fontSize: '14px' }}
                        >
                          {day.outliers_up.length}
                        </StyledTableCell>
                      )
                    )}

                  </StyledTableRow>

                  <StyledTableRow>
                    <StyledTableCell
                      size="small"
                      component="th"
                      scope="row"
                      className="d-flex"
                      style={{
                        fontWeight: 'bold', width: '250px', backgroundColor:
                          clusterBG[2]
                      }}
                    >
                      4 Star Pricing Down
                  </StyledTableCell>
                    <StyledTableCell size="small">
                    </StyledTableCell>
                    {cluster3.map((day, index) =>
                      (
                        <StyledTableCell
                          size="small"
                          key={index}
                          style={{ fontSize: '14px' }}
                        >
                          {day.outliers_down.length}
                        </StyledTableCell>
                      )
                    )}

                  </StyledTableRow>

                  <StyledTableRow>
                    <StyledTableCell
                      size="small"
                      component="th"
                      scope="row"
                      className="d-flex"
                      style={{
                        fontWeight: 'bold', width: '250px', backgroundColor:
                          clusterBG[1]
                      }}
                    >
                      3 Star Pricing Up
                  </StyledTableCell>
                    <StyledTableCell size="small">
                    </StyledTableCell>
                    {cluster2.map((day, index) =>
                      (
                        <StyledTableCell
                          size="small"
                          key={index}
                          style={{ fontSize: '14px' }}
                        >
                          {day.outliers_up.length}
                        </StyledTableCell>
                      )
                    )}

                  </StyledTableRow>

                  <StyledTableRow>
                    <StyledTableCell
                      size="small"
                      component="th"
                      scope="row"
                      className="d-flex"
                      style={{
                        fontWeight: 'bold', width: '250px', backgroundColor:
                          clusterBG[1]
                      }}
                    >
                      3 Star Pricing Down
                  </StyledTableCell>
                    <StyledTableCell size="small">
                    </StyledTableCell>
                    {cluster2.map((day, index) =>
                      (
                        <StyledTableCell
                          size="small"
                          key={index}
                          style={{ fontSize: '14px' }}
                        >
                          {day.outliers_down.length}
                        </StyledTableCell>
                      )
                    )}

                  </StyledTableRow>

                  <StyledTableRow>
                    <StyledTableCell
                      size="small"
                      component="th"
                      scope="row"
                      className="d-flex"
                      style={{
                        fontWeight: 'bold', width: '250px', backgroundColor:
                          clusterBG[0]
                      }}
                    >
                      2 Star Pricing Up
                  </StyledTableCell>
                    <StyledTableCell size="small">
                    </StyledTableCell>
                    {cluster1.map((day, index) =>
                      (
                        <StyledTableCell
                          size="small"
                          key={index}
                          style={{ fontSize: '14px' }}
                        >
                          {day.outliers_up.length}
                        </StyledTableCell>
                      )
                    )}

                  </StyledTableRow>

                  <StyledTableRow>
                    <StyledTableCell
                      size="small"
                      component="th"
                      scope="row"
                      className="d-flex"
                      style={{
                        fontWeight: 'bold', width: '250px', backgroundColor:
                          clusterBG[0]
                      }}
                    >
                      2 Star Pricing Down
                  </StyledTableCell>
                    <StyledTableCell size="small">
                    </StyledTableCell>
                    {cluster1.map((day, index) =>
                      (
                        <StyledTableCell
                          size="small"
                          key={index}
                          style={{ fontSize: '14px' }}
                        >
                          {day.outliers_down.length}
                        </StyledTableCell>
                      )
                    )}

                  </StyledTableRow>
                </TableBody>
              </Table>
            </Box>
          </TableContainer>

        </>

      ) : (
          <>loading</>
        )
      }
    </>
  );
}
