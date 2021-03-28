import {
  Box,
  makeStyles,
  TableCell,
  TableContainer,
  TableRow,
  withStyles,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';

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
                  style={{ display: 'flex', width: '250px' }}
                >
                  Clustered Matrix
                </StyledTableCell>
                <StyledTableCell size="small">Stars</StyledTableCell>
                {cluster.map((e, index) => (
                  <StyledTableCell size="small" key={index}>
                    {e.date}
                  </StyledTableCell>
                ))}
              </TableHead>
              <TableBody>
                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="medium"
                    component="th"
                    scope="col"
                    className="d-flex"
                    style={{ display: 'flex', width: '250px' }}
                  >
                    Number of Hotels
                  </StyledTableCell>
                  <StyledTableCell size="small">{stars}</StyledTableCell>
                  {cluster.map((e, index) => (
                    <StyledTableCell size="small" key={index}>
                      {e.items}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className="d-flex"
                    style={{ display: 'flex', width: '250px' }}
                  >
                    Average Rate
                  </StyledTableCell>
                  <StyledTableCell size="small">{stars}</StyledTableCell>
                  {cluster.map((e, index) => (
                    <StyledTableCell size="small" key={index}>
                      {Math.round(e.mean)}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>

                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className="d-flex"
                    style={{ display: 'flex', width: '250px' }}
                  >
                    Most Repeated rate (mode)
                  </StyledTableCell>
                  <StyledTableCell size="small">{stars}</StyledTableCell>
                  {cluster.map((e, index) => (
                    <StyledTableCell size="small" key={index}>
                      {Math.round(e.mod)}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>

                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className="d-flex"
                    style={{ display: 'flex', width: '250px' }}
                  >
                    Middle Rate
                  </StyledTableCell>
                  <StyledTableCell size="small">{stars}</StyledTableCell>
                  {cluster.map((e, index) => (
                    <StyledTableCell size="small" key={index}>
                      {Math.round(e.median)}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className="d-flex"
                    style={{ display: 'flex', width: '250px' }}
                  >
                    &emsp;Highest Rate
                  </StyledTableCell>
                  <StyledTableCell size="small">{stars}</StyledTableCell>
                  {cluster.map((e, index) => (
                    <StyledTableCell size="small" key={index}>
                      {Math.round(e.max)}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className="d-flex"
                    style={{ display: 'flex', width: '250px' }}
                  >
                    &emsp;&emsp;Average of the Highest Rate
                  </StyledTableCell>
                  <StyledTableCell size="small">{stars}</StyledTableCell>
                  {cluster.map((e, index) => (
                    <StyledTableCell size="small" key={index}>
                      {Math.round(e.highAVG)}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className="d-flex"
                    style={{ display: 'flex', width: '250px' }}
                  >
                    &emsp;&emsp;Average of the Middle Rate
                  </StyledTableCell>
                  <StyledTableCell size="small">{stars}</StyledTableCell>
                  {cluster.map((e, index) => (
                    <StyledTableCell size="small" key={index}>
                      {Math.round(e.midAVG)}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className="d-flex"
                    style={{ display: 'flex', width: '250px' }}
                  >
                    &emsp;&emsp;Average of the Lowest Rate
                  </StyledTableCell>
                  <StyledTableCell size="small">{stars}</StyledTableCell>
                  {cluster.map((e, index) => (
                    <StyledTableCell size="small" key={index}>
                      {Math.round(e.lowAVG)}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
                <StyledTableRow Key={stars}>
                  <StyledTableCell
                    size="small"
                    component="th"
                    scope="row"
                    className="d-flex"
                    style={{ display: 'flex', width: '250px' }}
                  >
                    &emsp;Lowest Rate
                  </StyledTableCell>
                  <StyledTableCell size="small">{stars}</StyledTableCell>
                  {cluster.map((e, index) => (
                    <StyledTableCell size="small" key={index}>
                      {Math.round(e.min)}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              </TableBody>
            </Table>
            <br />
          </Box>
        </TableContainer>
      ) : (
        <h1>loading.....</h1>
      )}
    </>
  );

  const bootstrapTBL = () => {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th></th>
            {cluster.map((e, index) => (
              <th key={index}>{e.date}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>No of Hotels</td>
            {cluster.map((e, index) => (
              <td key={index}>{e.items}</td>
            ))}
          </tr>
          <tr>
            <td>Average Rate</td>
            {cluster.map((e, index) => (
              <td key={index}>{e.mean}</td>
            ))}
          </tr>
          <tr>
            <td>Most Repeated rate (mode)</td>
            {cluster.map((e, index) => (
              <td key={index}>{e.mod}</td>
            ))}
          </tr>
          <tr>
            <td>Middle Rate</td>
            {cluster.map((e, index) => (
              <td key={index}>{e.median}</td>
            ))}
          </tr>
          <tr>
            <td>&emsp;Highest Rate</td>
            {cluster.map((e, index) => (
              <td key={index}>{e.max}</td>
            ))}
          </tr>
          <tr>
            <td>&emsp;&emsp;Average of the Highest Rates</td>
            {cluster.map((e, index) => (
              <td key={index}>{e.highAVG}</td>
            ))}
          </tr>
          <tr>
            <td>&emsp;&emsp;Average of the Middle Rates</td>
            {cluster.map((e, index) => (
              <td key={index}>{e.midAVG}</td>
            ))}
          </tr>
          <tr>
            <td>&emsp;&emsp;Average of the Lowest Rates</td>
            {cluster.map((e, index) => (
              <td key={index}>{e.lowAVG}</td>
            ))}
          </tr>
          <tr>
            <td>&emsp;Lowest Rate</td>
            {cluster.map((e, index) => (
              <td key={index}>{e.min}</td>
            ))}
          </tr>
        </tbody>
      </Table>
    );
  };
}
