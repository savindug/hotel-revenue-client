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
    textAlign: 'center',
  },
});

export default function ClusterBucket({ selectedDate, reqHotel }) {
  const classes = useStyles();

  const getClusterDataSet = useSelector((state) => state.clusterDataSet);
  const { loading, clusterData, report_len } = getClusterDataSet;

  const RatePositionTable = ({ stars, cluster }) => {
    return (
      <>
        {cluster.length > 0 ? (
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
                    style={{
                      backgroundColor: CLUSTER_BACKGROUND[stars - 2],
                      width: '250px',
                      zIndex: 100,
                      fontFamily: FONT_FAMILY,
                    }}
                  >
                    <TableSortLabel disabled>
                      {' '}
                      {`${stars} Star Bucket Matrix`}
                    </TableSortLabel>{' '}
                    <div class="dropdown-divider"></div>
                    <TableSortLabel disabled>Days Out</TableSortLabel>
                  </StyledTableCell>
                  {cluster.map((e, index) =>
                    (() => {
                      let _date = moment(e.date);
                      let daysOut = _date.diff(selectedDate, 'days');
                      let date = _date.format('dddd').substring(0, 3);
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
                          {date === 'Sat' || date === 'Fri' ? 'WEND' : 'WDAY'}
                          <div class="dropdown-divider"></div>
                          {`${date.toUpperCase()}\n${moment(e.date).format(
                            'MM/DD'
                          )}`}{' '}
                          <div class="dropdown-divider"></div>
                          {daysOut}
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
                      Average Rate
                    </StyledTableCell>

                    {[...Array(report_len).keys()].map((e, index) => (
                      <StyledTableCell
                        size="small"
                        key={index}
                        className={classes.rates}
                      >
                        {cluster[index] ? (
                          cluster[index].mean !== 'NaN' &&
                          cluster[index].items > 0 ? (
                            <span
                              className={
                                Math.round(cluster[index].mean) -
                                  reqHotel[index].rate >=
                                0
                                  ? 'text-success'
                                  : 'text-danger'
                              }
                            >
                              {Math.round(cluster[index].mean) -
                                reqHotel[index].rate}
                            </span>
                          ) : cluster[index].mean !== 'NaN' &&
                            cluster[index].items < 0 ? (
                            'NED'
                          ) : (
                            'N/A'
                          )
                        ) : (
                          'N/A'
                        )}
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
                      Most Repeated rate
                    </StyledTableCell>

                    {[...Array(report_len).keys()].map((e, index) => (
                      <StyledTableCell
                        size="small"
                        key={index}
                        className={classes.rates}
                      >
                        {cluster[index] ? (
                          cluster[index].mod !== 'NaN' &&
                          cluster[index].items > 0 ? (
                            <span
                              className={
                                Math.round(cluster[index].mod) -
                                  reqHotel[index].rate >=
                                0
                                  ? 'text-success'
                                  : 'text-danger'
                              }
                            >
                              {Math.round(cluster[index].mod) -
                                reqHotel[index].rate}
                            </span>
                          ) : cluster[index].mod !== 'NaN' &&
                            cluster[index].items < 0 ? (
                            'NED'
                          ) : (
                            'N/A'
                          )
                        ) : (
                          'N/A'
                        )}
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

                    {[...Array(report_len).keys()].map((e, index) => (
                      <StyledTableCell
                        size="small"
                        key={index}
                        className={classes.rates}
                      >
                        {cluster[index] ? (
                          cluster[index].median !== 'NaN' &&
                          cluster[index].items > 0 ? (
                            <span
                              className={
                                Math.round(cluster[index].median) -
                                  reqHotel[index].rate >=
                                0
                                  ? 'text-success'
                                  : 'text-danger'
                              }
                            >
                              {Math.round(cluster[index].median) -
                                reqHotel[index].rate}
                            </span>
                          ) : cluster[index].median !== 'NaN' &&
                            cluster[index].items < 0 ? (
                            'NED'
                          ) : (
                            'N/A'
                          )
                        ) : (
                          'N/A'
                        )}
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

                    {[...Array(report_len).keys()].map((e, index) => (
                      <StyledTableCell
                        size="small"
                        key={index}
                        className={classes.rates}
                      >
                        {cluster[index] ? (
                          cluster[index].max !== 'NaN' &&
                          cluster[index].items > 0 ? (
                            <span
                              className={
                                Math.round(cluster[index].max) -
                                  reqHotel[index].rate >=
                                0
                                  ? 'text-success'
                                  : 'text-danger'
                              }
                            >
                              {Math.round(cluster[index].max) -
                                reqHotel[index].rate}
                            </span>
                          ) : cluster[index].max !== 'NaN' &&
                            cluster[index].items < 0 ? (
                            'NED'
                          ) : (
                            'N/A'
                          )
                        ) : (
                          'N/A'
                        )}
                      </StyledTableCell>
                    ))}
                  </StyledTableRow>
                  <StyledTableRow Key={stars}>
                    <StyledTableCell
                      size="small"
                      component="th"
                      scope="row"
                      className={classes.sticky}
                      style={{
                        fontWeight: 'bold',
                        width: '250px',
                        borderTop: '2px solid grey',
                      }}
                    >
                      &emsp;&emsp;Average of Highest Rates
                    </StyledTableCell>

                    {[...Array(report_len).keys()].map((e, index) => (
                      <StyledTableCell
                        size="small"
                        key={index}
                        className={classes.rates}
                        style={{
                          borderTop: '3px solid grey',
                        }}
                      >
                        {cluster[index] ? (
                          cluster[index].highAVG !== 'NaN' &&
                          cluster[index].items > 0 ? (
                            <span
                              className={
                                Math.round(cluster[index].highAVG) -
                                  reqHotel[index].rate >=
                                0
                                  ? 'text-success'
                                  : 'text-danger'
                              }
                            >
                              {Math.round(cluster[index].highAVG) -
                                reqHotel[index].rate}
                            </span>
                          ) : cluster[index].highAVG !== 'NaN' &&
                            cluster[index].items < 0 ? (
                            'NED'
                          ) : (
                            'N/A'
                          )
                        ) : (
                          'N/A'
                        )}
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

                    {[...Array(report_len).keys()].map((e, index) => (
                      <StyledTableCell
                        size="small"
                        key={index}
                        className={classes.rates}
                      >
                        {cluster[index] ? (
                          cluster[index].midAVG !== 'NaN' &&
                          cluster[index].items > 0 ? (
                            <span
                              className={
                                Math.round(cluster[index].midAVG) -
                                  reqHotel[index].rate >=
                                0
                                  ? 'text-success'
                                  : 'text-danger'
                              }
                            >
                              {Math.round(cluster[index].midAVG) -
                                reqHotel[index].rate}
                            </span>
                          ) : cluster[index].midAVG !== 'NaN' &&
                            cluster[index].items < 0 ? (
                            'NED'
                          ) : (
                            'N/A'
                          )
                        ) : (
                          'N/A'
                        )}
                      </StyledTableCell>
                    ))}
                  </StyledTableRow>
                  <StyledTableRow Key={stars}>
                    <StyledTableCell
                      size="small"
                      component="th"
                      scope="row"
                      className={classes.sticky}
                      style={{
                        fontWeight: 'bold',
                        width: '250px',
                        borderBottom: '3px solid grey',
                      }}
                    >
                      &emsp;&emsp;Average of Lowest Rates
                    </StyledTableCell>

                    {[...Array(report_len).keys()].map((e, index) => (
                      <StyledTableCell
                        size="small"
                        key={index}
                        className={classes.rates}
                        style={{
                          borderBottom: '3px solid grey',
                        }}
                      >
                        {cluster[index] ? (
                          cluster[index].lowAVG !== 'NaN' &&
                          cluster[index].items > 0 ? (
                            <span
                              className={
                                Math.round(cluster[index].lowAVG) -
                                  reqHotel[index].rate >=
                                0
                                  ? 'text-success'
                                  : 'text-danger'
                              }
                            >
                              {Math.round(cluster[index].lowAVG) -
                                reqHotel[index].rate}
                            </span>
                          ) : cluster[index].lowAVG !== 'NaN' &&
                            cluster[index].items < 0 ? (
                            'NED'
                          ) : (
                            'N/A'
                          )
                        ) : (
                          'N/A'
                        )}
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

                    {[...Array(report_len).keys()].map((e, index) => (
                      <StyledTableCell
                        size="small"
                        key={index}
                        className={classes.rates}
                      >
                        {cluster[index] ? (
                          cluster[index].min !== 'NaN' &&
                          cluster[index].items > 0 ? (
                            <span
                              className={
                                Math.round(cluster[index].min) -
                                  reqHotel[index].rate >=
                                0
                                  ? 'text-success'
                                  : 'text-danger'
                              }
                            >
                              {Math.round(cluster[index].min) -
                                reqHotel[index].rate}
                            </span>
                          ) : cluster[index].min !== 'NaN' &&
                            cluster[index].items < 0 ? (
                            'NED'
                          ) : (
                            'N/A'
                          )
                        ) : (
                          'N/A'
                        )}
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
  };

  return (
    <>
      {!loading && clusterData.length > 0 && reqHotel.length > 0 ? (
        <>
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
                    style={{
                      width: '250px',
                      zIndex: 100,
                      fontFamily: FONT_FAMILY,
                    }}
                  >
                    <TableSortLabel disabled>
                      Your Property |{' '}
                      {(() => {
                        let stars = null;
                        reqHotel.map((e, index) => {
                          if (e.stars !== null && e.stars != 'N/A') {
                            stars = e.stars;
                          }
                        });

                        return stars;
                      })()}
                      -stars{' '}
                    </TableSortLabel>{' '}
                    <hr />
                    <TableSortLabel disabled>Days Out</TableSortLabel>
                  </StyledTableCell>
                  {reqHotel.map((e, index) =>
                    (() => {
                      let _date = moment(e.checkIn);
                      let daysOut = _date.diff(selectedDate, 'days');
                      let date = _date.format('dddd').substring(0, 3);
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
                          {`${
                            date === 'Sat' || date === 'Fri' ? 'WEND' : 'WDAY'
                          }\n${date.toUpperCase()}\n${moment(e.checkIn).format(
                            'MM/DD'
                          )}`}
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
                      size="medium"
                      component="th"
                      scope="col"
                      className={classes.sticky}
                      style={{ fontWeight: 'bold', width: '250px' }}
                    >
                      {(() => {
                        let name = null;
                        reqHotel.map((e, index) => {
                          if (e.name !== null) {
                            name = e.name;
                          }
                        });

                        return name;
                      })()}
                    </StyledTableCell>
                    {reqHotel.map((e, index) => (
                      <StyledTableCell
                        size="small"
                        key={index}
                        style={{
                          backgroundColor: CLUSTER_BACKGROUND[e.cluster - 2],
                        }}
                        className={classes.rates}
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
                      className={classes.sticky}
                      style={{ fontWeight: 'bold', width: '250px' }}
                    >
                      Current Rate Bucket
                    </StyledTableCell>

                    {reqHotel.map((e, index) => (
                      <StyledTableCell
                        size="small"
                        key={index}
                        className={classes.rates}
                      >
                        {e.cluster}
                      </StyledTableCell>
                    ))}
                  </StyledTableRow>

                  <StyledTableRow>
                    <StyledTableCell
                      size="small"
                      component="th"
                      scope="row"
                      className={classes.sticky}
                      style={{ fontWeight: 'bold', width: '250px' }}
                    >
                      Rate Bucket Position
                    </StyledTableCell>

                    <StyledTableCell size="small" className={classes.rates}>
                      {(() => {
                        let stars = null;
                        reqHotel.map((e, index) => {
                          if (e.name !== null) {
                            stars = e.stars;
                          }
                        });
                        return stars;
                      })()}
                    </StyledTableCell>
                    {reqHotel.map((e, index) => (
                      <StyledTableCell
                        size="small"
                        key={index}
                        style={{ fontWeight: 'bold', fontSize: '12px' }}
                        className={classes.rates}
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
                      className={classes.sticky}
                      style={{
                        fontWeight: 'bold',
                        width: '250px',
                        zIndex: 100,
                      }}
                    >
                      Rate Bucket Rank (Highest to Lowest)
                    </StyledTableCell>

                    <StyledTableCell size="small" className={classes.rates}>
                      {(() => {
                        let stars = null;
                        reqHotel.map((e, index) => {
                          if (e.name !== null) {
                            stars = e.stars;
                          }
                        });
                        return stars;
                      })()}
                    </StyledTableCell>
                    {reqHotel.map((e, index) => (
                      <StyledTableCell
                        size="small"
                        key={index}
                        style={{ fontSize: '14px' }}
                        className={classes.rates}
                      >
                        <sup>{e.rank.split('/')[0]}</sup>&frasl;
                        <sub>{e.rank.split('/')[1]}</sub>
                      </StyledTableCell>
                    ))}
                  </StyledTableRow>
                </TableBody>
              </Table>
              <br />
            </Box>
          </TableContainer>
          {/* <RatePositionTable cluster={cluster4} stars={5} className="my-5" />
          <RatePositionTable cluster={cluster3} stars={4} className="my-5" />
          <RatePositionTable cluster={cluster2} stars={3} className="my-5" />
          <RatePositionTable cluster={cluster1} stars={2} className="my-5" /> */}
        </>
      ) : (
        <>loading</>
      )}
    </>
  );
}
