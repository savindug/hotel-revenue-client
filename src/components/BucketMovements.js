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
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { CLUSTER_BACKGROUND, FONT_FAMILY } from '../utils/const';
import { useEffect, useState } from 'react';
import { ClusteredData } from './ClusteredData';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
    fontWeight: 'bolder',
  },
  body: {
    fontSize: 15,
    minWidth: 100,
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
    textAlign: 'center',
  },
});

export default function BucketMovements({ selectedDate }) {
  const classes = useStyles();

  const getClusterDataSet = useSelector((state) => state.clusterDataSet);
  const {
    loading,
    reqHotel,
    cluster1,
    cluster2,
    cluster3,
    cluster4,
    hotels,
    report_len,
    clusterData,
    comparison_report,
  } = getClusterDataSet;

  const [totalHotelCount, setTotalHotelCount] = useState(0);

  const [load, setLoad] = useState(true);

  const getFilterHotels = (arr) => {
    if (hotels.length > 0) {
      const allowedMatrkets = arr.filter(({ id: id1 }) =>
        hotels.some(({ hotelID: id2 }) => id2 === id1)
      );
      return allowedMatrkets;
    }
  };

  const checkHotelAvailability = (id, day) => {
    let clustered = [];

    if (cluster1.length > 0 && cluster1[day]) {
      clustered.push(cluster1[day].unwanted);
    }
    if (cluster2.length > 0 && cluster2[day]) {
      clustered.push(cluster2[day].unwanted);
    }
    if (cluster3.length > 0 && cluster3[day]) {
      clustered.push(cluster3[day].unwanted);
    }
    if (cluster4.length > 0 && cluster4[day]) {
      clustered.push(cluster4[day].unwanted);
    }

    let hotels_arr = [];

    for (var i = 0; i < clustered.length; i++) {
      hotels_arr = hotels_arr.concat(clustered[i]);
    }

    const exists = hotels_arr.some((obj) => obj.id == id);

    if (exists) {
      return true;
    } else {
      return false;
    }
  };

  const getPricingUps = (stars) => {
    [...Array(report_len).keys()].map((day) => {});
  };

  useEffect(() => {
    const CompareReport = async () => {
      setLoad(true);
      cluster1.map((e) => {
        if (e && e != undefined) {
          let dateMatch = comparison_report.cluster1.find((obj) => {
            try {
              if (obj && obj != undefined && obj != undefined) {
                if (
                  moment(e.date).format('YYYY-MM-DD') ===
                  moment(obj.date).format('YYYY-MM-DD')
                ) {
                  return obj;
                }
              }
            } catch (e) {}
          });

          if (dateMatch) {
            delete dateMatch.cluster;
            delete dateMatch.unwanted;

            e.comp_report = dateMatch;
          }
        }
      });

      cluster2.map((e) => {
        if (e && e != undefined) {
          let dateMatch = comparison_report.cluster2.find((obj) => {
            try {
              if (obj && obj != undefined && obj != undefined) {
                if (
                  moment(e.date).format('YYYY-MM-DD') ===
                  moment(obj.date).format('YYYY-MM-DD')
                ) {
                  return obj;
                }
              }
            } catch (e) {}
          });

          if (dateMatch) {
            delete dateMatch.cluster;
            delete dateMatch.unwanted;

            e.comp_report = dateMatch;
          }
        }
      });

      cluster3.map((e) => {
        if (e && e != undefined) {
          let dateMatch = comparison_report.cluster3.find((obj) => {
            try {
              if (obj && obj != undefined && obj != undefined) {
                if (
                  moment(e.date).format('YYYY-MM-DD') ===
                  moment(obj.date).format('YYYY-MM-DD')
                ) {
                  return obj;
                }
              }
            } catch (e) {}
          });

          if (dateMatch) {
            delete dateMatch.cluster;
            delete dateMatch.unwanted;

            e.comp_report = dateMatch;
          }
        }
      });

      cluster4.map((e) => {
        if (e && e != undefined) {
          let dateMatch = comparison_report.cluster1.find((obj) => {
            try {
              if (obj && obj != undefined && obj != undefined) {
                if (
                  moment(e.date).format('YYYY-MM-DD') ===
                  moment(obj.date).format('YYYY-MM-DD')
                ) {
                  return obj;
                }
              }
            } catch (e) {}
          });

          if (dateMatch) {
            delete dateMatch.cluster;
            delete dateMatch.unwanted;

            e.comp_report = dateMatch;
          }
        }
      });

      setLoad(false);
    };

    if (comparison_report && clusterData.length > 0) {
      CompareReport();
    }
  }, [comparison_report]);

  return (
    <>
      {!loading && hotels.length > 0 ? (
        <>
          <TableContainer component={Paper} className="my-5">
            <Box width={100}>
              <Table
                id="stars3"
                className={classes.table}
                aria-label="customized table"
                bodyStyle={{ overflow: 'visible' }}
                stickyHeader
              >
                <TableHead>
                  <StyledTableCell
                    style={{
                      fontWeight: 'bold',
                      width: '250px',
                      zIndex: 100,
                    }}
                  >
                    Bucket Size Index <hr />
                    Days Out
                  </StyledTableCell>
                  {/* <StyledTableCell size="small">Stars</StyledTableCell> */}
                  {cluster1.map((e, index) =>
                    (() => {
                      let _date = moment(e.date);
                      let daysOut = _date.diff(selectedDate, 'days');
                      let day = _date.format('dddd').substring(0, 3);
                      return (
                        <StyledTableCell
                          size="small"
                          key={index}
                          className={
                            day === 'Sat' || day === 'Fri'
                              ? 'bg-secondary text-light text-center'
                              : 'text-center'
                          }
                          style={{ fontSize: '12px' }}
                        >
                          <>
                            {day === 'Sat' || day === 'Fri' ? 'WEND' : 'WDAY'}
                          </>
                          <br />
                          <>{day.toUpperCase()}</>
                          <br />
                          <>{moment(e.date).format('MM/DD')}</>{' '}
                          <div class="dropdown-divider"></div>
                          {daysOut}
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
                        zIndex: 10,
                      }}
                    >
                      5 Star Bucket
                    </StyledTableCell>
                    {[...Array(report_len).keys()].map((e, index) =>
                      (() => {
                        let star_hotel_count = 0;
                        let hotel_count = 0;
                        let comp_hotel_count = 0;
                        let comp_star_hotel_count = 0;

                        if (cluster4.length > 0 && cluster4[index]) {
                          star_hotel_count += cluster4[index].unwanted.length;
                        }

                        if (cluster1.length > 0 && cluster1[index]) {
                          hotel_count += cluster1[index].stars5.length;
                        }
                        if (cluster2.length > 0 && cluster2[index]) {
                          hotel_count =
                            hotel_count + cluster2[index].stars5.length;
                        }
                        if (cluster3.length > 0 && cluster3[index]) {
                          hotel_count =
                            hotel_count + cluster3[index].stars5.length;
                        }
                        if (cluster4.length > 0 && cluster4[index]) {
                          hotel_count =
                            hotel_count + cluster4[index].stars5.length;
                        }

                        if (cluster4[index]) {
                          if (cluster4[index].comp_report) {
                            comp_star_hotel_count =
                              comp_star_hotel_count +
                              cluster4[index].comp_report.items;
                          }
                        }

                        if (cluster1[index]) {
                          if (cluster1[index].comp_report) {
                            comp_hotel_count =
                              comp_hotel_count +
                              cluster1[index].comp_report.stars5.length;
                          }
                        }

                        if (cluster2[index]) {
                          if (cluster2[index].comp_report) {
                            comp_hotel_count =
                              comp_hotel_count +
                              cluster2[index].comp_report.stars5.length;
                          }
                        }

                        if (cluster3[index]) {
                          if (cluster3[index].comp_report) {
                            comp_hotel_count =
                              comp_hotel_count +
                              cluster3[index].comp_report.stars5.length;
                          }
                        }

                        if (cluster4[index]) {
                          if (cluster4[index].comp_report) {
                            comp_hotel_count =
                              comp_hotel_count +
                              cluster4[index].comp_report.stars5.length;
                          }
                        }

                        const bucket_index = parseFloat(
                          star_hotel_count / hotel_count
                        ).toFixed(2);

                        const comp_bucket_index = parseFloat(
                          comp_star_hotel_count / comp_hotel_count
                        ).toFixed(2);

                        return (
                          <StyledTableCell
                            style={{
                              fontWeight: 'bold',
                            }}
                            className={classes.rates + ' text-center'}
                          >
                            <span>
                              {bucket_index == comp_bucket_index ? (
                                <></>
                              ) : bucket_index > comp_bucket_index ? (
                                <sup
                                  className={
                                    bucket_index > comp_bucket_index
                                      ? 'fa fa-long-arrow-up text-success'
                                      : 'fa fa-long-arrow-down text-danger'
                                  }
                                  aria-hidden="true"
                                >
                                  &nbsp;
                                </sup>
                              ) : (
                                <sub
                                  className={
                                    bucket_index > comp_bucket_index
                                      ? 'fa fa-long-arrow-up text-success'
                                      : 'fa fa-long-arrow-down text-danger'
                                  }
                                  aria-hidden="true"
                                >
                                  &nbsp;
                                </sub>
                              )}
                              {bucket_index}
                            </span>
                          </StyledTableCell>
                        );
                      })()
                    )}
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
                        zIndex: 10,
                      }}
                    >
                      4 Star Bucket
                    </StyledTableCell>
                    {[...Array(report_len).keys()].map((e, index) =>
                      (() => {
                        let star_hotel_count = 0;
                        let hotel_count = 0;
                        let comp_hotel_count = 0;
                        let comp_star_hotel_count = 0;

                        if (cluster3.length > 0 && cluster3[index]) {
                          star_hotel_count += cluster3[index].unwanted.length;
                        }

                        if (cluster1.length > 0 && cluster1[index]) {
                          hotel_count += cluster1[index].stars4.length;
                        }
                        if (cluster2.length > 0 && cluster2[index]) {
                          hotel_count =
                            hotel_count + cluster2[index].stars4.length;
                        }
                        if (cluster3.length > 0 && cluster3[index]) {
                          hotel_count =
                            hotel_count + cluster3[index].stars4.length;
                        }
                        if (cluster4.length > 0 && cluster4[index]) {
                          hotel_count =
                            hotel_count + cluster4[index].stars4.length;
                        }

                        if (cluster3[index]) {
                          if (cluster3[index].comp_report) {
                            comp_star_hotel_count =
                              comp_star_hotel_count +
                              cluster3[index].comp_report.items;
                          }
                        }

                        if (cluster1[index]) {
                          if (cluster1[index].comp_report) {
                            comp_hotel_count =
                              comp_hotel_count +
                              cluster1[index].comp_report.stars4.length;
                          }
                        }

                        if (cluster2[index]) {
                          if (cluster2[index].comp_report) {
                            comp_hotel_count =
                              comp_hotel_count +
                              cluster2[index].comp_report.stars4.length;
                          }
                        }

                        if (cluster3[index]) {
                          if (cluster3[index].comp_report) {
                            comp_hotel_count =
                              comp_hotel_count +
                              cluster3[index].comp_report.stars4.length;
                          }
                        }

                        if (cluster4[index]) {
                          if (cluster4[index].comp_report) {
                            comp_hotel_count =
                              comp_hotel_count +
                              cluster4[index].comp_report.stars4.length;
                          }
                        }

                        const bucket_index = parseFloat(
                          star_hotel_count / hotel_count
                        ).toFixed(2);

                        const comp_bucket_index = parseFloat(
                          comp_star_hotel_count / comp_hotel_count
                        ).toFixed(2);

                        return (
                          <StyledTableCell
                            style={{
                              fontWeight: 'bold',
                            }}
                            className={classes.rates + ' text-center'}
                          >
                            <span>
                              {bucket_index == comp_bucket_index ? (
                                <></>
                              ) : bucket_index > comp_bucket_index ? (
                                <sup
                                  className={
                                    bucket_index > comp_bucket_index
                                      ? 'fa fa-long-arrow-up text-success'
                                      : 'fa fa-long-arrow-down text-danger'
                                  }
                                  aria-hidden="true"
                                >
                                  &nbsp;
                                </sup>
                              ) : (
                                <sub
                                  className={
                                    bucket_index > comp_bucket_index
                                      ? 'fa fa-long-arrow-up text-success'
                                      : 'fa fa-long-arrow-down text-danger'
                                  }
                                  aria-hidden="true"
                                >
                                  &nbsp;
                                </sub>
                              )}
                              {bucket_index}
                            </span>
                          </StyledTableCell>
                        );
                      })()
                    )}
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
                        zIndex: 10,
                      }}
                    >
                      3 Star Bucket
                    </StyledTableCell>
                    {[...Array(report_len).keys()].map((e, index) =>
                      (() => {
                        let star_hotel_count = 0;
                        let hotel_count = 0;
                        let comp_hotel_count = 0;
                        let comp_star_hotel_count = 0;

                        if (cluster2.length > 0 && cluster2[index]) {
                          star_hotel_count += cluster2[index].unwanted.length;
                        }

                        if (cluster1.length > 0 && cluster1[index]) {
                          hotel_count += cluster1[index].stars3.length;
                        }
                        if (cluster2.length > 0 && cluster2[index]) {
                          hotel_count =
                            hotel_count + cluster2[index].stars3.length;
                        }
                        if (cluster3.length > 0 && cluster3[index]) {
                          hotel_count =
                            hotel_count + cluster3[index].stars3.length;
                        }
                        if (cluster4.length > 0 && cluster4[index]) {
                          hotel_count =
                            hotel_count + cluster4[index].stars3.length;
                        }

                        if (cluster2[index]) {
                          if (cluster2[index].comp_report) {
                            comp_star_hotel_count =
                              comp_star_hotel_count +
                              cluster2[index].comp_report.items;
                          }
                        }

                        if (cluster1[index]) {
                          if (cluster1[index].comp_report) {
                            comp_hotel_count =
                              comp_hotel_count +
                              cluster1[index].comp_report.stars3.length;
                          }
                        }

                        if (cluster2[index]) {
                          if (cluster2[index].comp_report) {
                            comp_hotel_count =
                              comp_hotel_count +
                              cluster2[index].comp_report.stars3.length;
                          }
                        }

                        if (cluster3[index]) {
                          if (cluster3[index].comp_report) {
                            comp_hotel_count =
                              comp_hotel_count +
                              cluster3[index].comp_report.stars3.length;
                          }
                        }

                        if (cluster4[index]) {
                          if (cluster4[index].comp_report) {
                            comp_hotel_count =
                              comp_hotel_count +
                              cluster4[index].comp_report.stars3.length;
                          }
                        }

                        const bucket_index = parseFloat(
                          star_hotel_count / hotel_count
                        ).toFixed(2);

                        const comp_bucket_index = parseFloat(
                          comp_star_hotel_count / comp_hotel_count
                        ).toFixed(2);

                        return (
                          <StyledTableCell
                            style={{
                              fontWeight: 'bold',
                            }}
                            className={classes.rates + ' text-center'}
                          >
                            <span>
                              {bucket_index == comp_bucket_index ? (
                                <></>
                              ) : bucket_index > comp_bucket_index ? (
                                <sup
                                  className={
                                    bucket_index > comp_bucket_index
                                      ? 'fa fa-long-arrow-up text-success'
                                      : 'fa fa-long-arrow-down text-danger'
                                  }
                                  aria-hidden="true"
                                >
                                  &nbsp;
                                </sup>
                              ) : (
                                <sub
                                  className={
                                    bucket_index > comp_bucket_index
                                      ? 'fa fa-long-arrow-up text-success'
                                      : 'fa fa-long-arrow-down text-danger'
                                  }
                                  aria-hidden="true"
                                >
                                  &nbsp;
                                </sub>
                              )}
                              {bucket_index}
                            </span>
                          </StyledTableCell>
                        );
                      })()
                    )}
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
                        zIndex: 10,
                      }}
                    >
                      2 Star Bucket
                    </StyledTableCell>
                    {[...Array(report_len).keys()].map((e, index) =>
                      (() => {
                        let star_hotel_count = 0;
                        let hotel_count = 0;
                        let comp_hotel_count = 0;
                        let comp_star_hotel_count = 0;

                        if (cluster1.length > 0 && cluster1[index]) {
                          star_hotel_count += cluster1[index].unwanted.length;
                        }

                        if (cluster1.length > 0 && cluster1[index]) {
                          hotel_count += cluster1[index].stars2.length;
                        }
                        if (cluster2.length > 0 && cluster2[index]) {
                          hotel_count =
                            hotel_count + cluster2[index].stars2.length;
                        }
                        if (cluster3.length > 0 && cluster3[index]) {
                          hotel_count =
                            hotel_count + cluster3[index].stars2.length;
                        }
                        if (cluster4.length > 0 && cluster4[index]) {
                          hotel_count =
                            hotel_count + cluster4[index].stars2.length;
                        }

                        if (cluster1[index]) {
                          if (cluster1[index].comp_report) {
                            comp_star_hotel_count =
                              comp_star_hotel_count +
                              cluster1[index].comp_report.items;
                          }
                        }

                        if (cluster1[index]) {
                          if (cluster1[index].comp_report) {
                            comp_hotel_count =
                              comp_hotel_count +
                              cluster1[index].comp_report.stars2.length;
                          }
                        }

                        if (cluster2[index]) {
                          if (cluster2[index].comp_report) {
                            comp_hotel_count =
                              comp_hotel_count +
                              cluster2[index].comp_report.stars2.length;
                          }
                        }

                        if (cluster3[index]) {
                          if (cluster3[index].comp_report) {
                            comp_hotel_count =
                              comp_hotel_count +
                              cluster3[index].comp_report.stars2.length;
                          }
                        }

                        if (cluster4[index]) {
                          if (cluster4[index].comp_report) {
                            comp_hotel_count =
                              comp_hotel_count +
                              cluster4[index].comp_report.stars2.length;
                          }
                        }

                        const bucket_index = parseFloat(
                          star_hotel_count / hotel_count
                        ).toFixed(2);

                        const comp_bucket_index = parseFloat(
                          comp_star_hotel_count / comp_hotel_count
                        ).toFixed(2);

                        return (
                          <StyledTableCell
                            style={{
                              fontWeight: 'bold',
                            }}
                            className={classes.rates + ' text-center'}
                          >
                            <span>
                              {bucket_index == comp_bucket_index ? (
                                <></>
                              ) : bucket_index > comp_bucket_index ? (
                                <sup
                                  className={
                                    bucket_index > comp_bucket_index
                                      ? 'fa fa-long-arrow-up text-success'
                                      : 'fa fa-long-arrow-down text-danger'
                                  }
                                  aria-hidden="true"
                                >
                                  &nbsp;
                                </sup>
                              ) : (
                                <sub
                                  className={
                                    bucket_index > comp_bucket_index
                                      ? 'fa fa-long-arrow-up text-success'
                                      : 'fa fa-long-arrow-down text-danger'
                                  }
                                  aria-hidden="true"
                                >
                                  &nbsp;
                                </sub>
                              )}
                              {bucket_index}
                            </span>
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
                size="medium"
                aria-label="customized table"
                bodyStyle={{ overflow: 'visible' }}
                stickyHeader
              >
                <TableHead>
                  <StyledTableCell
                    style={{ fontWeight: 'bold', width: '250px', zIndex: 100 }}
                  >
                    Net Bucket Movements <hr />
                    Days Out
                  </StyledTableCell>
                  {cluster1.map((e, index) =>
                    (() => {
                      let _date = moment(e.date);
                      let daysOut = _date.diff(selectedDate, 'days');
                      let day = _date.format('dddd').substring(0, 3);
                      return (
                        <StyledTableCell
                          size="small"
                          key={index}
                          className={
                            day === 'Sat' || day === 'Fri'
                              ? 'bg-secondary text-light text-center'
                              : 'text-center'
                          }
                          style={{ fontSize: '12px' }}
                        >
                          <>
                            {day === 'Sat' || day === 'Fri' ? 'WEND' : 'WDAY'}
                          </>
                          <br />
                          <>{day.toUpperCase()}</>
                          <br />
                          <>{moment(e.date).format('MM/DD')}</>{' '}
                          <div class="dropdown-divider"></div>
                          {daysOut}
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
                    {[...Array(report_len).keys()].map((e, index) =>
                      (() => {
                        let hotel_count = 0;
                        if (cluster2.length > 0 && cluster2[index]) {
                          hotel_count =
                            hotel_count + cluster2[index].stars5.length;
                        }
                        if (cluster1.length > 0 && cluster1[index]) {
                          hotel_count =
                            hotel_count + cluster1[index].stars5.length;
                        }
                        if (cluster3.length > 0 && cluster3[index]) {
                          hotel_count =
                            hotel_count + cluster3[index].stars5.length;
                        }
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
                    {[...Array(report_len).keys()].map((e, index) =>
                      (() => {
                        let hotel_count = 0;
                        if (cluster4.length > 0 && cluster4[index]) {
                          hotel_count =
                            hotel_count + cluster4[index].stars4.length;
                        }

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
                    {[...Array(report_len).keys()].map((e, index) =>
                      (() => {
                        let hotel_count = 0;
                        if (cluster1.length > 0 && cluster1[index]) {
                          hotel_count =
                            hotel_count + cluster1[index].stars4.length;
                        }
                        if (cluster2.length > 0 && cluster2[index]) {
                          hotel_count =
                            hotel_count + cluster2[index].stars4.length;
                        }

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
                    {[...Array(report_len).keys()].map((e, index) =>
                      (() => {
                        let hotel_count = 0;
                        if (cluster3.length > 0 && cluster3[index]) {
                          hotel_count =
                            hotel_count + cluster3[index].stars3.length;
                        }
                        if (cluster4.length > 0 && cluster4[index]) {
                          hotel_count =
                            hotel_count + cluster4[index].stars3.length;
                        }

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
                    {[...Array(report_len).keys()].map((e, index) =>
                      (() => {
                        let hotel_count = 0;
                        if (cluster1.length > 0 && cluster1[index]) {
                          hotel_count =
                            hotel_count + cluster1[index].stars3.length;
                        }
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
                    {[...Array(report_len).keys()].map((e, index) =>
                      (() => {
                        let hotel_count = 0;
                        if (cluster2.length > 0 && cluster2[index]) {
                          hotel_count =
                            hotel_count + cluster2[index].stars2.length;
                        }
                        if (cluster3.length > 0 && cluster3[index]) {
                          hotel_count =
                            hotel_count + cluster3[index].stars2.length;
                        }
                        if (cluster4.length > 0 && cluster4[index]) {
                          hotel_count =
                            hotel_count + cluster4[index].stars2.length;
                        }
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

          {cluster4.length > 0 ? (
            <TableContainer component={Paper} className="my-5">
              <Box width={100}>
                <Table
                  id="stars5"
                  className={classes.table}
                  aria-label="customized table"
                  bodyStyle={{ overflow: 'visible' }}
                  stickyHeader
                >
                  <TableHead>
                    <StyledTableCell
                      style={{
                        fontWeight: 'bold',
                        width: '250px',
                        zIndex: 100,
                      }}
                    >
                      5 Star Hotels Count <div class="dropdown-divider"></div>
                      Days Out
                    </StyledTableCell>
                    {/* <StyledTableCell size="small">Stars</StyledTableCell> */}
                    {cluster1.map((e, index) =>
                      (() => {
                        let _date = moment(e.date);
                        let daysOut = _date.diff(selectedDate, 'days');
                        let day = _date.format('dddd').substring(0, 3);
                        return (
                          <StyledTableCell
                            size="small"
                            key={index}
                            className={
                              day === 'Sat' || day === 'Fri'
                                ? 'bg-secondary text-light text-center'
                                : 'text-center'
                            }
                            style={{ fontSize: '12px' }}
                          >
                            <>
                              {day === 'Sat' || day === 'Fri' ? 'WEND' : 'WDAY'}
                            </>
                            <br />
                            <>{day.toUpperCase()}</>
                            <br />
                            <>{moment(e.date).format('MM/DD')}</>{' '}
                            <div class="dropdown-divider"></div>
                            {daysOut}
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
                        <p className="font-weight-bold">Hotels Showing Rates</p>
                        <div className="text-center">
                          <Divider />
                          5-stars <Divider /> 4-stars <Divider /> 3-stars
                          <Divider />
                          2-stars{' '}
                        </div>
                      </StyledTableCell>
                      {/* <StyledTableCell size="small"></StyledTableCell> */}
                      {cluster4.length > 0 ? (
                        cluster4.map((day, index) => (
                          <StyledTableCell
                            component="th"
                            scope="row"
                            key={index}
                            style={{
                              fontSize: '14px',
                              borderTop: '2px solid grey',
                            }}
                            className={classes.rates + ' text-center'}
                          >
                            <p className="font-weight-bold">
                              {day
                                ? getFilterHotels(day.stars2).length +
                                  getFilterHotels(day.stars3).length +
                                  getFilterHotels(day.stars4).length +
                                  getFilterHotels(day.stars5).length
                                : 0}
                            </p>
                            <Divider />
                            {day ? getFilterHotels(day.stars5).length : 0}{' '}
                            <Divider />{' '}
                            {day ? getFilterHotels(day.stars4).length : 0}{' '}
                            <Divider />{' '}
                            {day ? getFilterHotels(day.stars3).length : 0}{' '}
                            <Divider />{' '}
                            {day ? getFilterHotels(day.stars2).length : 0}
                          </StyledTableCell>
                        ))
                      ) : (
                        <></>
                      )}
                    </StyledTableRow>
                  </TableBody>
                </Table>
              </Box>
            </TableContainer>
          ) : (
            <></>
          )}

          {cluster3.length > 0 ? (
            <TableContainer component={Paper} className="my-5">
              <Box width={100}>
                <Table
                  id="stars4"
                  className={classes.table}
                  aria-label="customized table"
                  bodyStyle={{ overflow: 'visible' }}
                  stickyHeader
                >
                  <TableHead>
                    <StyledTableCell
                      style={{
                        fontWeight: 'bold',
                        width: '250px',
                        zIndex: 100,
                      }}
                    >
                      4 Star Hotels Count <hr />
                      Days Out
                    </StyledTableCell>
                    {/* <StyledTableCell size="small">Stars</StyledTableCell> */}
                    {cluster1.map((e, index) =>
                      (() => {
                        let _date = moment(e.date);
                        let daysOut = _date.diff(selectedDate, 'days');
                        let day = _date.format('dddd').substring(0, 3);
                        return (
                          <StyledTableCell
                            size="small"
                            key={index}
                            className={
                              day === 'Sat' || day === 'Fri'
                                ? 'bg-secondary text-light text-center'
                                : 'text-center'
                            }
                            style={{ fontSize: '12px' }}
                          >
                            <>
                              {day === 'Sat' || day === 'Fri' ? 'WEND' : 'WDAY'}
                            </>
                            <br />
                            <>{day.toUpperCase()}</>
                            <br />
                            <>{moment(e.date).format('MM/DD')}</>{' '}
                            <div class="dropdown-divider"></div>
                            {daysOut}
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
                          backgroundColor: CLUSTER_BACKGROUND[2],
                          borderTop: '2px solid grey',
                        }}
                      >
                        <p className="font-weight-bold">Hotels Showing Rates</p>
                        <div className="text-center">
                          <Divider />
                          5-stars <Divider /> 4-stars <Divider /> 3-stars
                          <Divider />
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
                          className={classes.rates + ' text-center'}
                        >
                          <p className="font-weight-bold">
                            {day
                              ? getFilterHotels(day.stars2).length +
                                getFilterHotels(day.stars3).length +
                                getFilterHotels(day.stars4).length +
                                getFilterHotels(day.stars5).length
                              : 0}
                          </p>
                          <Divider />
                          {day ? getFilterHotels(day.stars5).length : 0}{' '}
                          <Divider />{' '}
                          {day ? getFilterHotels(day.stars4).length : 0}{' '}
                          <Divider />{' '}
                          {day ? getFilterHotels(day.stars3).length : 0}{' '}
                          <Divider />{' '}
                          {day ? getFilterHotels(day.stars2).length : 0}
                        </StyledTableCell>
                      ))}
                    </StyledTableRow>
                  </TableBody>
                </Table>
              </Box>
            </TableContainer>
          ) : (
            <></>
          )}

          {cluster2.length > 0 ? (
            <TableContainer component={Paper} className="my-5">
              <Box width={100}>
                <Table
                  id="stars3"
                  className={classes.table}
                  aria-label="customized table"
                  bodyStyle={{ overflow: 'visible' }}
                  stickyHeader
                >
                  <TableHead>
                    <StyledTableCell
                      style={{
                        fontWeight: 'bold',
                        width: '250px',
                        zIndex: 100,
                      }}
                    >
                      3 Star Hotels Count <hr />
                      Days Out
                    </StyledTableCell>
                    {/* <StyledTableCell size="small">Stars</StyledTableCell> */}
                    {cluster1.map((e, index) =>
                      (() => {
                        let _date = moment(e.date);
                        let daysOut = _date.diff(selectedDate, 'days');
                        let day = _date.format('dddd').substring(0, 3);
                        return (
                          <StyledTableCell
                            size="small"
                            key={index}
                            className={
                              day === 'Sat' || day === 'Fri'
                                ? 'bg-secondary text-light text-center'
                                : 'text-center'
                            }
                            style={{ fontSize: '12px' }}
                          >
                            <>
                              {day === 'Sat' || day === 'Fri' ? 'WEND' : 'WDAY'}
                            </>
                            <br />
                            <>{day.toUpperCase()}</>
                            <br />
                            <>{moment(e.date).format('MM/DD')}</>{' '}
                            <div class="dropdown-divider"></div>
                            {daysOut}
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
                          backgroundColor: CLUSTER_BACKGROUND[1],
                          borderTop: '2px solid grey',
                        }}
                      >
                        <p className="font-weight-bold">Hotels Showing Rates</p>
                        <div className="text-center">
                          <Divider />
                          5-stars <Divider /> 4-stars <Divider /> 3-stars
                          <Divider />
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
                          className={classes.rates + ' text-center'}
                        >
                          {' '}
                          {day ? (
                            <p className="font-weight-bold">
                              {getFilterHotels(day.stars2).length +
                                getFilterHotels(day.stars3).length +
                                getFilterHotels(day.stars4).length +
                                getFilterHotels(day.stars5).length}
                            </p>
                          ) : (
                            0
                          )}
                          <Divider />
                          {day ? getFilterHotels(day.stars5).length : 0}{' '}
                          <Divider />{' '}
                          {day ? getFilterHotels(day.stars4).length : 0}{' '}
                          <Divider />{' '}
                          {day ? getFilterHotels(day.stars3).length : 0}{' '}
                          <Divider />{' '}
                          {day ? getFilterHotels(day.stars2).length : 0}
                        </StyledTableCell>
                      ))}
                    </StyledTableRow>
                  </TableBody>
                </Table>
              </Box>
            </TableContainer>
          ) : (
            <></>
          )}

          {cluster1.length > 0 ? (
            <TableContainer component={Paper} className="my-5">
              <Box width={100}>
                <Table
                  id="stars2"
                  className={classes.table}
                  aria-label="customized table"
                  bodyStyle={{ overflow: 'visible' }}
                  stickyHeader
                >
                  <TableHead>
                    <StyledTableCell
                      style={{
                        fontWeight: 'bold',
                        width: '250px',
                        zIndex: 100,
                      }}
                    >
                      2 Star Hotels Count <hr />
                      Days Out
                    </StyledTableCell>
                    {/* <StyledTableCell size="small">Stars</StyledTableCell> */}
                    {cluster1.map((e, index) =>
                      (() => {
                        let _date = moment(e.date);
                        let daysOut = _date.diff(selectedDate, 'days');
                        let day = _date.format('dddd').substring(0, 3);
                        return (
                          <StyledTableCell
                            size="small"
                            key={index}
                            className={
                              day === 'Sat' || day === 'Fri'
                                ? 'bg-secondary text-light text-center'
                                : 'text-center'
                            }
                            style={{ fontSize: '12px' }}
                          >
                            <>
                              {day === 'Sat' || day === 'Fri' ? 'WEND' : 'WDAY'}
                            </>
                            <br />
                            <>{day.toUpperCase()}</>
                            <br />
                            <>{moment(e.date).format('MM/DD')}</>{' '}
                            <div class="dropdown-divider"></div>
                            {daysOut}
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
                          backgroundColor: CLUSTER_BACKGROUND[0],
                          borderTop: '2px solid grey',
                        }}
                      >
                        <p className="font-weight-bold">Hotels Showing Rates</p>
                        <div className="text-center">
                          <Divider />
                          5-stars <Divider /> 4-stars <Divider /> 3-stars
                          <Divider />
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
                          className={classes.rates + ' text-center'}
                        >
                          {day ? (
                            <p className="font-weight-bold">
                              {getFilterHotels(day.stars2).length +
                                getFilterHotels(day.stars3).length +
                                getFilterHotels(day.stars4).length +
                                getFilterHotels(day.stars5).length}
                            </p>
                          ) : (
                            0
                          )}
                          <Divider />
                          {day ? getFilterHotels(day.stars5).length : 0}
                          <Divider />{' '}
                          {day ? getFilterHotels(day.stars4).length : 0}{' '}
                          <Divider />{' '}
                          {day ? getFilterHotels(day.stars3).length : 0}{' '}
                          <Divider />{' '}
                          {day ? getFilterHotels(day.stars2).length : 0}
                        </StyledTableCell>
                      ))}
                    </StyledTableRow>
                  </TableBody>
                </Table>
              </Box>
            </TableContainer>
          ) : (
            <></>
          )}

          <TableContainer component={Paper} className="my-5">
            <Box width={100}>
              <Table
                className={classes.table}
                aria-label="customized table"
                bodyStyle={{ overflow: 'visible' }}
                stickyHeader
              >
                <TableHead>
                  <StyledTableCell
                    style={{ fontWeight: 'bold', width: '250px', zIndex: 100 }}
                  >
                    Total Hotels Count &nbsp; ({hotels.length})<hr />
                    Days Out
                  </StyledTableCell>
                  {/* <StyledTableCell size="small">Stars</StyledTableCell> */}
                  {cluster1.map((e, index) =>
                    (() => {
                      let _date = moment(e.date);
                      let daysOut = _date.diff(selectedDate, 'days');
                      let day = _date.format('dddd').substring(0, 3);
                      return (
                        <StyledTableCell
                          size="small"
                          key={index}
                          className={
                            day === 'Sat' || day === 'Fri'
                              ? 'bg-secondary text-light text-center'
                              : 'text-center'
                          }
                          style={{ fontSize: '12px' }}
                        >
                          <>
                            {day === 'Sat' || day === 'Fri' ? 'WEND' : 'WDAY'}
                          </>
                          <br />
                          <>{day.toUpperCase()}</>
                          <br />
                          <>{moment(e.date).format('MM/DD')}</>{' '}
                          <div class="dropdown-divider"></div>
                          {daysOut}
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
                        borderTop: '2px solid grey',
                      }}
                    >
                      <p className="font-weight-bold">Hotels Showing Rates</p>
                      <div className="text-center">
                        <Divider />
                        5-stars <Divider /> 4-stars <Divider /> 3-stars
                        <Divider />
                        2-stars <Divider /> Hotels with Outlier Rates
                        <Divider /> Hotels not Showing Rates
                      </div>
                    </StyledTableCell>
                    {/* <StyledTableCell size="small"></StyledTableCell> */}

                    {[...Array(report_len).keys()].map((e, index) =>
                      (() => {
                        let hotel_count = 0;

                        hotel_count = 0;

                        if (cluster1.length > 0 && cluster1[index]) {
                          hotel_count += cluster1[index].unwanted.length;
                        }
                        if (cluster2.length > 0 && cluster2[index]) {
                          hotel_count += cluster2[index].unwanted.length;
                        }
                        if (cluster3.length > 0 && cluster3[index]) {
                          hotel_count += cluster3[index].unwanted.length;
                        }
                        if (cluster4.length > 0 && cluster4[index]) {
                          hotel_count += cluster4[index].unwanted.length;
                        }

                        let hotel_count_2 = 0;
                        if (cluster1.length > 0 && cluster1[index]) {
                          hotel_count_2 += cluster1[index].stars2.length;
                        }
                        if (cluster2.length > 0 && cluster2[index]) {
                          hotel_count_2 += cluster2[index].stars2.length;
                        }
                        if (cluster3.length > 0 && cluster3[index]) {
                          hotel_count_2 += cluster3[index].stars2.length;
                        }
                        if (cluster4.length > 0 && cluster4[index]) {
                          hotel_count_2 += cluster4[index].stars2.length;
                        }

                        let hotel_count_3 = 0;
                        if (cluster1.length > 0 && cluster1[index]) {
                          hotel_count_3 += cluster1[index].stars3.length;
                        }
                        if (cluster2.length > 0 && cluster2[index]) {
                          hotel_count_3 += cluster2[index].stars3.length;
                        }
                        if (cluster3.length > 0 && cluster3[index]) {
                          hotel_count_3 += cluster3[index].stars3.length;
                        }
                        if (cluster4.length > 0 && cluster4[index]) {
                          hotel_count_3 += cluster4[index].stars3.length;
                        }

                        let hotel_count_4 = 0;
                        if (cluster1.length > 0 && cluster1[index]) {
                          hotel_count_4 += cluster1[index].stars4.length;
                        }
                        if (cluster2.length > 0 && cluster2[index]) {
                          hotel_count_4 += cluster2[index].stars4.length;
                        }
                        if (cluster3.length > 0 && cluster3[index]) {
                          hotel_count_4 += cluster3[index].stars4.length;
                        }
                        if (cluster4.length > 0 && cluster4[index]) {
                          hotel_count_4 += cluster4[index].stars4.length;
                        }

                        let hotel_count_5 = 0;
                        if (cluster1.length > 0 && cluster1[index]) {
                          hotel_count_5 += cluster1[index].stars5.length;
                        }
                        if (cluster2.length > 0 && cluster2[index]) {
                          hotel_count_5 += cluster2[index].stars5.length;
                        }
                        if (cluster3.length > 0 && cluster3[index]) {
                          hotel_count_5 += cluster3[index].stars5.length;
                        }
                        if (cluster4.length > 0 && cluster4[index]) {
                          hotel_count_5 += cluster4[index].stars5.length;
                        }

                        let outliers = [];
                        let noRateHotels = [];
                        hotels.map((_hotel, id) => {
                          if (_hotel.prices[index] != null) {
                            // console.log(_hotel.prices[index]);
                            if (
                              !checkHotelAvailability(_hotel.hotelID, index)
                            ) {
                              outliers.push(_hotel);
                            }
                          } else {
                            noRateHotels.push(_hotel);
                          }
                        });

                        return (
                          <StyledTableCell
                            component="th"
                            scope="row"
                            style={{
                              fontSize: '14px',
                              borderTop: '2px solid grey',
                            }}
                            className={classes.rates + ' text-center'}
                          >
                            <p className="font-weight-bold">{hotel_count}</p>
                            <>
                              <Divider />
                              {hotel_count_5}
                              <Divider /> {hotel_count_4}
                              <Divider /> {hotel_count_3} <Divider />{' '}
                              {hotel_count_2} <Divider /> {outliers.length}{' '}
                              <Divider /> {noRateHotels.length}
                            </>
                          </StyledTableCell>
                        );
                      })()
                    )}
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
