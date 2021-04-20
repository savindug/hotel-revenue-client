import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  Select,
} from '@material-ui/core';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Bar, Line, Scatter } from 'react-chartjs-2';
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
  const clusterBG = ['#E6B8B8', '#CCC0DA', '#C4D79B', '#DDE6F6'];
  const getClusterDataSet = useSelector((state) => state.clusterDataSet);
  const {
    loading,
    err,
    clusterData,
    cluster1,
    cluster2,
    cluster3,
    cluster4,
  } = getClusterDataSet;
  const [chartData, setChartDatae] = useState({
    labels: cluster1.map((a) => moment(a.date).format('MM/DD')),
    datasets: [
      {
        label: 'Stars 2',
        backgroundColor: clusterBG[0],
        borderColor: clusterBG[0],
        borderWidth: 1,
        //stack: 1,
        hoverBackgroundColor: clusterBG[0],
        hoverBorderColor: clusterBG[0],
        data: cluster1.map((a) => a.mean),
      },

      {
        label: 'Stars 3',
        backgroundColor: clusterBG[1],
        borderColor: clusterBG[1],
        borderWidth: 1,
        //stack: 1,
        hoverBackgroundColor: clusterBG[1],
        hoverBorderColor: clusterBG[1],
        data: cluster2.map((a) => a.mean),
      },
      {
        label: 'Stars 4',
        backgroundColor: clusterBG[2],
        borderColor: clusterBG[2],
        borderWidth: 1,
        //stack: 1,
        hoverBackgroundColor: clusterBG[2],
        hoverBorderColor: clusterBG[2],
        data: cluster3.map((a) => a.mean),
      },
      {
        label: 'Stars 5',
        backgroundColor: clusterBG[3],
        borderColor: clusterBG[3],
        borderWidth: 1,
        // stack: 1,
        hoverBackgroundColor: clusterBG[3],
        hoverBorderColor: clusterBG[3],
        data: cluster4.map((a) => a.mean),
      },
    ],
  });
  const [lineData, setLineData] = useState({
    labels: cluster1.map((a) => moment(a.date).format('MM/DD')),
    datasets: [
      {
        label: '2 Star Cluster',
        fill: true,
        borderColor: clusterBG[0],
        borderWidth: 2,
        data: cluster1.map((a) => a.mean),
      },

      {
        label: '3 Star Cluster',
        fill: true,
        borderColor: clusterBG[1],
        borderWidth: 2,
        data: cluster2.map((a) => a.mean),
      },
      {
        label: '4 Star Cluster',
        fill: true,
        borderColor: clusterBG[2],
        borderWidth: 2,
        data: cluster3.map((a) => a.mean),
      },
      {
        label: '5 Star Cluster',
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: clusterBG[3],
        borderWidth: 2,
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

  const [scatterData2, setScatterData2] = useState([]);
  const [scatterData3, setScatterData3] = useState([]);
  const [scatterData4, setScatterData4] = useState([]);
  const [scatterData5, setScatterData5] = useState([]);

  const [scatterPlot, setScatterPlot] = useState(2);

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

  const handleScatterPlotMatrix = (e) => {
    setScatterPlot(e);
  };

  useEffect(() => {
    if (clusterData.length > 0) {
      cluster1.map((cl) => {
        cl.cluster.map((data) => {
          setScatterData2((state) => [...state, data]);
        });
      });
      cluster2.map((cl) => {
        cl.cluster.map((data) => {
          setScatterData3((state) => [...state, data]);
        });
      });
      cluster3.map((cl) => {
        cl.cluster.map((data) => {
          setScatterData4((state) => [...state, data]);
        });
      });
      cluster4.map((cl) => {
        cl.cluster.map((data) => {
          setScatterData5((state) => [...state, data]);
        });
      });
    }
  }, [cluster1, cluster2, cluster3, cluster4]);
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
          <hr className="my-5"></hr>
          <Line data={lineData} height={100} />

          <hr className="my-5"></hr>

          <Grid container justify="space-around" className="my-5">
            <h1>Scatter Plot</h1>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="grouped-native-select">
                Scatter Plot for
              </InputLabel>
              <Select
                native={true}
                onChange={(e) => handleScatterPlotMatrix(e.target.value)}
                id="grouped-native-select"
                value={scatterPlot}
              >
                <option value="2">2 Star Cluster</option>
                <option value="3">3 Star Cluster</option>
                <option value="4">4 Star Cluster</option>
                <option value="5">5 Star Cluster</option>
              </Select>
            </FormControl>
          </Grid>

          {scatterData2.length > 0 && scatterPlot == 2 ? (
            //(console.log('scatterData => ' + JSON.stringify(scatterData)),
            <Line
              data={{
                labels: cluster1.map((a) => moment(a.date).format('MM/DD')),
                datasets: [
                  {
                    label: '2 Star Cluster',
                    showLine: false,
                    backgroundColor: '#000000',
                    borderColor: '#000000',
                    hoverBackgroundColor: '#000000',
                    hoverBorderColor: '#000000',
                    data: scatterData2,
                  },
                ],
              }}
            />
          ) : scatterData3.length > 0 && scatterPlot == 3 ? (
            //(console.log('scatterData => ' + JSON.stringify(scatterData)),
            <Line
              data={{
                labels: cluster2.map((a) => moment(a.date).format('MM/DD')),
                datasets: [
                  {
                    label: '3 Star Cluster',
                    showLine: false,
                    backgroundColor: '#000000',
                    borderColor: '#000000',
                    hoverBackgroundColor: '#000000',
                    hoverBorderColor: '#000000',
                    data: scatterData3,
                  },
                ],
              }}
            />
          ) : scatterData4.length > 0 && scatterPlot == 4 ? (
            //(console.log('scatterData => ' + JSON.stringify(scatterData)),
            <Line
              data={{
                labels: cluster3.map((a) => moment(a.date).format('MM/DD')),
                datasets: [
                  {
                    label: '4 Star Cluster',
                    showLine: false,
                    backgroundColor: '#000000',
                    borderColor: '#000000',
                    hoverBackgroundColor: '#000000',
                    hoverBorderColor: '#000000',
                    data: scatterData4,
                  },
                ],
              }}
            />
          ) : scatterData5.length > 0 && scatterPlot == 5 ? (
            //(console.log('scatterData => ' + JSON.stringify(scatterData)),
            <Line
              data={{
                labels: cluster4.map((a) => moment(a.date).format('MM/DD')),
                datasets: [
                  {
                    label: '5 Star Cluster',
                    showLine: false,
                    backgroundColor: '#000000',
                    borderColor: '#000000',
                    hoverBackgroundColor: '#000000',
                    hoverBorderColor: '#000000',
                    data: scatterData5,
                  },
                ],
              }}
            />
          ) : (
            <></>
          )}
        </>
      ) : (
        <>Binding Data...</>
      )}
    </div>
  );
};
