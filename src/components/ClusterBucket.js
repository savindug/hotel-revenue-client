import {
  Box,
  makeStyles,
  TableCell,
  TableContainer,
  TableRow,
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
    display: 'flex',
  },
  rates: {
    fontFamily: FONT_FAMILY,
  },
});

export default function ClusterBucket({ cluster, stars }) {
  const classes = useStyles();

  const getClusterDataSet = useSelector((state) => state.clusterDataSet);
  const { loading, reqHotel, cluster1, cluster2, cluster3, cluster4 } =
    getClusterDataSet;

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
                    className={classes.sticky}
                    style={{ fontWeight: 'bold', width: '250px' }}
                  >
                    Your Property
                  </StyledTableCell>
                  <StyledTableCell size="small">Stars</StyledTableCell>
                  {reqHotel.map((e, index) =>
                    (() => {
                      let date = moment(e.checkIn)
                        .format('dddd')
                        .substring(0, 3);
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
                      Current Clustered Bucket
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
                      Clustered Rate Bucket Position
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
                      style={{ fontWeight: 'bold', width: '250px' }}
                    >
                      Clustered Rate Bucket Rank (Highest to Lowest)
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
                    style={{ fontWeight: 'bold', width: '250px' }}
                  >
                    Bucket Movements
                  </StyledTableCell>
                  {/* <StyledTableCell size="small">Stars</StyledTableCell> */}
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
                    {cluster3.map((day, index) => (
                      <StyledTableCell
                        size="small"
                        key={index}
                        style={{ fontSize: '14px' }}
                        className={classes.rates}
                      >
                        {day.stars5.length}
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
                        backgroundColor: CLUSTER_BACKGROUND[2],
                      }}
                    >
                      4 Star Pricing Up
                    </StyledTableCell>
                    {/* <StyledTableCell size="small"></StyledTableCell> */}
                    {cluster4.map((day, index) => (
                      <StyledTableCell
                        size="small"
                        key={index}
                        style={{ fontSize: '14px' }}
                        className={classes.rates}
                      >
                        {day.stars4.length}
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
                        backgroundColor: CLUSTER_BACKGROUND[2],
                      }}
                    >
                      4 Star Pricing Down
                    </StyledTableCell>
                    {/* <StyledTableCell size="small"></StyledTableCell> */}
                    {cluster2.map((day, index) => (
                      <StyledTableCell
                        size="small"
                        key={index}
                        style={{ fontSize: '14px' }}
                        className={classes.rates}
                      >
                        {day.stars4.length}
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
                        backgroundColor: CLUSTER_BACKGROUND[1],
                      }}
                    >
                      3 Star Pricing Up
                    </StyledTableCell>
                    {/* <StyledTableCell size="small"></StyledTableCell> */}
                    {cluster3.map((day, index) => (
                      <StyledTableCell
                        size="small"
                        key={index}
                        style={{ fontSize: '14px' }}
                        className={classes.rates}
                      >
                        {day.stars3.length}
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
                        backgroundColor: CLUSTER_BACKGROUND[1],
                      }}
                    >
                      3 Star Pricing Down
                    </StyledTableCell>
                    {/* <StyledTableCell size="small"></StyledTableCell> */}
                    {cluster1.map((day, index) => (
                      <StyledTableCell
                        size="small"
                        key={index}
                        style={{ fontSize: '14px' }}
                        className={classes.rates}
                      >
                        {day.stars3.length}
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
                        backgroundColor: CLUSTER_BACKGROUND[0],
                      }}
                    >
                      2 Star Pricing Up
                    </StyledTableCell>
                    {/* <StyledTableCell size="small"></StyledTableCell> */}
                    {cluster2.map((day, index) => (
                      <StyledTableCell
                        size="small"
                        key={index}
                        style={{ fontSize: '14px' }}
                        className={classes.rates}
                      >
                        {day.stars2.length}
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
