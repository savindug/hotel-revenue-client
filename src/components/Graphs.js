import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  Select,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));
export const Graphs = () => {
  const classes = useStyles();
  const [matrix, setMatrix] = useState('avg');
  const getClusterDataSet = useSelector((state) => state.clusterDataSet);
  const {
    loading,
    err,
    cluster1,
    cluster2,
    cluster3,
    cluster4,
  } = getClusterDataSet;
  const [chartData, setChartDatae] = useState({
    labels: cluster1.map((a) => a.date),
    datasets: [
      {
        label: 'Stars 2',
        backgroundColor: '#d9534f',
        borderColor: '#d9534f',
        borderWidth: 1,
        //stack: 1,
        hoverBackgroundColor: '#d9534f',
        hoverBorderColor: '#d9534f',
        data: cluster1.map((a) => a.mean),
      },

      {
        label: 'Stars 3',
        backgroundColor: '#0275d8',
        borderColor: '#0275d8',
        borderWidth: 1,
        //stack: 1,
        hoverBackgroundColor: '#0275d8',
        hoverBorderColor: '#0275d8',
        data: cluster2.map((a) => a.mean),
      },
      {
        label: 'Stars 4',
        backgroundColor: '#5cb85c',
        borderColor: '#5cb85c',
        borderWidth: 1,
        //stack: 1,
        hoverBackgroundColor: '#5cb85c',
        hoverBorderColor: '#5cb85c',
        data: cluster3.map((a) => a.mean),
      },
      {
        label: 'Stars 5',
        backgroundColor: '#f0ad4e',
        borderColor: '#f0ad4e',
        borderWidth: 1,
        // stack: 1,
        hoverBackgroundColor: '#f0ad4e',
        hoverBorderColor: '#f0ad4e',
        data: cluster4.map((a) => a.mean),
      },
    ],
  });
  const [lineData, setLineData] = useState({
    labels: cluster1.map((a) => a.date),
    datasets: [
      {
        label: 'Stars 2',
        fill: true,
        borderColor: '#d9534f',
        borderWidth: 1,
        data: cluster1.map((a) => a.mean),
      },

      {
        label: 'Stars 3',
        fill: true,
        borderColor: '#0275d8',
        borderWidth: 1,
        data: cluster2.map((a) => a.mean),
      },
      {
        label: 'Stars 4',
        fill: true,
        borderColor: '#5cb85c',
        borderWidth: 1,
        data: cluster3.map((a) => a.mean),
      },
      {
        label: 'Stars 5',
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: '#f0ad4e',
        borderWidth: 1,
        data: cluster4.map((a) => a.mean),
      },
    ],
  });
  const [options, setOptions] = useState({
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    type: 'bar',
    //   scales: {
    //     xAxes: [{
    //         stacked: true
    //     }],
    //     yAxes: [{
    //         stacked: true
    //     }]
    // }
  });

  const [bind, setBind] = useState(true);

  const hanndleMatrixChange = (m) => {
    setMatrix(m);
    if (m === 'avg') {
      chartData.datasets.map((set, ix) => {
        if (ix === 0) set.data = cluster1.map((a) => a.mean);
        if (ix === 1) set.data = cluster2.map((a) => a.mean);
        if (ix === 2) set.data = cluster3.map((a) => a.mean);
        if (ix === 3) set.data = cluster4.map((a) => a.mean);
      });
      lineData.datasets.map((set, ix) => {
        if (ix === 0) set.data = cluster1.map((a) => a.mean);
        if (ix === 1) set.data = cluster2.map((a) => a.mean);
        if (ix === 2) set.data = cluster3.map((a) => a.mean);
        if (ix === 3) set.data = cluster4.map((a) => a.mean);
      });
    }
    if (m === 'max') {
      chartData.datasets.map((set, ix) => {
        if (ix === 0) set.data = cluster1.map((a) => a.max);
        if (ix === 1) set.data = cluster2.map((a) => a.max);
        if (ix === 2) set.data = cluster3.map((a) => a.max);
        if (ix === 3) set.data = cluster4.map((a) => a.max);
      });
      lineData.datasets.map((set, ix) => {
        if (ix === 0) set.data = cluster1.map((a) => a.max);
        if (ix === 1) set.data = cluster2.map((a) => a.max);
        if (ix === 2) set.data = cluster3.map((a) => a.max);
        if (ix === 3) set.data = cluster4.map((a) => a.max);
      });
    }
    if (m === 'min') {
      chartData.datasets.map((set, ix) => {
        if (ix === 0) set.data = cluster1.map((a) => a.min);
        if (ix === 1) set.data = cluster2.map((a) => a.min);
        if (ix === 2) set.data = cluster3.map((a) => a.min);
        if (ix === 3) set.data = cluster4.map((a) => a.min);
      });
      lineData.datasets.map((set, ix) => {
        if (ix === 0) set.data = cluster1.map((a) => a.min);
        if (ix === 1) set.data = cluster2.map((a) => a.min);
        if (ix === 2) set.data = cluster3.map((a) => a.min);
        if (ix === 3) set.data = cluster4.map((a) => a.min);
      });
    }
    if (m === 'mod') {
      chartData.datasets.map((set, ix) => {
        if (ix === 0) set.data = cluster1.map((a) => a.mod);
        if (ix === 1) set.data = cluster2.map((a) => a.mod);
        if (ix === 2) set.data = cluster3.map((a) => a.mod);
        if (ix === 3) set.data = cluster4.map((a) => a.mod);
      });
      lineData.datasets.map((set, ix) => {
        if (ix === 0) set.data = cluster1.map((a) => a.mod);
        if (ix === 1) set.data = cluster2.map((a) => a.mod);
        if (ix === 2) set.data = cluster3.map((a) => a.mod);
        if (ix === 3) set.data = cluster4.map((a) => a.mod);
      });
    }
  };

  // useEffect(() => {

  // }, [matrix]);
  return (
    <div>
      {bind ? (
        <>
          {/* {chartData.datasets.map((x) => {
            console.log(x.data);
          })} */}
          <Grid container justify="space-around" className="my-5">
            <h1>Analytic Graphs</h1>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="grouped-native-select">
                Generate Graphs By
              </InputLabel>
              <Select
                native={true}
                onChange={(e) => hanndleMatrixChange(e.target.value)}
                id="grouped-native-select"
                value={matrix}
              >
                <option value="avg">Average Rate</option>
                <option value="max">Highest Rate</option>
                <option value="min">Lowest Rate</option>
                <option value="mod">Most Repeated rate (mode)</option>
              </Select>
            </FormControl>
          </Grid>

          <Box className="my-5">
            <Bar height={400} width={100} data={chartData} options={options} />
          </Box>

          <Line data={lineData} height={100} />
        </>
      ) : (
        <>Binding Data...</>
      )}
    </div>
  );
};
