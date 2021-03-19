import React, { useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
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
    minWidth: 650,
  },
});

export default function DataTable({ cluster }) {
  const classes = useStyles();
  const [stars, setStars] = useState(0);

  useEffect(() => {
    setStars((cluster.index += 2));
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table
        className={classes.table}
        size="small"
        aria-label="customized table"
      >
        <TableHead>
          <TableRow>
            <StyledTableCell width={1} size="small">
              Clustered Matrix
            </StyledTableCell>
            <StyledTableCell width={1} size="small">
              Stars
            </StyledTableCell>
            <StyledTableCell width={1} size="small">
              12-03-2021
            </StyledTableCell>
            {/* <TableCell width={1} size="small" align="right">Fat&nbsp;(g)</TableCell>
            <TableCell width={1} size="small" align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell width={1} size="small" align="right">Protein&nbsp;(g)</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          <StyledTableRow Key={stars}>
            <StyledTableCell width={1} size="small" component="th" scope="row">
              Number of Hotels
            </StyledTableCell>
            <StyledTableCell width={1} size="small">
              {stars}
            </StyledTableCell>
            <StyledTableCell width={1} size="small">
              {cluster.items}
            </StyledTableCell>
          </StyledTableRow>
          <StyledTableRow Key={stars}>
            <StyledTableCell width={1} size="small" component="th" scope="row">
              Average Rate
            </StyledTableCell>
            <StyledTableCell width={1} size="small">
              {stars}
            </StyledTableCell>
            <StyledTableCell width={1} size="small">
              {cluster.mean}
            </StyledTableCell>
          </StyledTableRow>
          <StyledTableRow Key={stars}>
            <StyledTableCell width={1} size="small" component="th" scope="row">
              Middle Rate
            </StyledTableCell>
            <StyledTableCell width={1} size="small">
              {stars}
            </StyledTableCell>
            <StyledTableCell width={1} size="small">
              {cluster.median}
            </StyledTableCell>
          </StyledTableRow>
          <StyledTableRow Key={stars}>
            <StyledTableCell width={1} size="small" component="th" scope="row">
              &emsp;Highest Rate
            </StyledTableCell>
            <StyledTableCell width={1} size="small">
              {stars}
            </StyledTableCell>
            <StyledTableCell width={1} size="small">
              {cluster.max}
            </StyledTableCell>
          </StyledTableRow>
          <StyledTableRow Key={stars}>
            <StyledTableCell width={1} size="small" component="th" scope="row">
              &emsp;&emsp;Average of the Highest Rate
            </StyledTableCell>
            <StyledTableCell width={1} size="small">
              {stars}
            </StyledTableCell>
            <StyledTableCell width={1} size="small">
              {cluster.highAVG}
            </StyledTableCell>
          </StyledTableRow>
          <StyledTableRow Key={stars}>
            <StyledTableCell width={1} size="small" component="th" scope="row">
              &emsp;&emsp;Average of the Middle Rate
            </StyledTableCell>
            <StyledTableCell width={1} size="small">
              {stars}
            </StyledTableCell>
            <StyledTableCell width={1} size="small">
              {cluster.midAVG}
            </StyledTableCell>
          </StyledTableRow>
          <StyledTableRow Key={stars}>
            <StyledTableCell width={1} size="small" component="th" scope="row">
              &emsp;&emsp;Average of the Lowest Rate
            </StyledTableCell>
            <StyledTableCell width={1} size="small">
              {stars}
            </StyledTableCell>
            <StyledTableCell width={1} size="small">
              {cluster.lowAVG}
            </StyledTableCell>
          </StyledTableRow>
          <StyledTableRow Key={stars}>
            <StyledTableCell width={1} size="small" component="th" scope="row">
              &emsp;Lowest Rate
            </StyledTableCell>
            <StyledTableCell width={1} size="small">
              {stars}
            </StyledTableCell>
            <StyledTableCell width={1} size="small">
              {cluster.min}
            </StyledTableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
      <br />
    </TableContainer>
  );
}
