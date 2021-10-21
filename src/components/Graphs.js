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
import { CLUSTER_BACKGROUND } from '../utils/const';
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
  const { loading, err, clusterData, cluster1, cluster2, cluster3, cluster4 } =
    getClusterDataSet;

  const [dateRange, setDateRange] = useState([
    [0, 30],
    [30, 60],
    [60, 90],
  ]);

  const [datePage, setDatePage] = useState(0);

  const [chartData, setChartDatae] = useState({
    labels: cluster1
      .slice(dateRange[datePage][0], dateRange[datePage][1])
      .map((a) => moment(a.date).format('MM/DD')),
    datasets: [
      {
        label: 'Stars 2',
        backgroundColor: CLUSTER_BACKGROUND[0],
        borderColor: CLUSTER_BACKGROUND[0],
        borderWidth: 1,
        //stack: 1,
        hoverBackgroundColor: CLUSTER_BACKGROUND[0],
        hoverBorderColor: CLUSTER_BACKGROUND[0],
        data: cluster1
          .slice(dateRange[datePage][0], dateRange[datePage][1])
          .map((a) => (a.items > 0 ? a.mean : 'NED')),
      },

      {
        label: 'Stars 3',
        backgroundColor: CLUSTER_BACKGROUND[1],
        borderColor: CLUSTER_BACKGROUND[1],
        borderWidth: 1,
        //stack: 1,
        hoverBackgroundColor: CLUSTER_BACKGROUND[1],
        hoverBorderColor: CLUSTER_BACKGROUND[1],
        data: cluster2
          .slice(dateRange[datePage][0], dateRange[datePage][1])
          .map((a) => (a.items > 0 ? a.mean : 'NED')),
      },
      {
        label: 'Stars 4',
        backgroundColor: CLUSTER_BACKGROUND[2],
        borderColor: CLUSTER_BACKGROUND[2],
        borderWidth: 1,
        //stack: 1,
        hoverBackgroundColor: CLUSTER_BACKGROUND[2],
        hoverBorderColor: CLUSTER_BACKGROUND[2],
        data: cluster3
          .slice(dateRange[datePage][0], dateRange[datePage][1])
          .map((a) => (a.items > 0 ? a.mean : 'NED')),
      },
      {
        label: 'Stars 5',
        backgroundColor: CLUSTER_BACKGROUND[3],
        borderColor: CLUSTER_BACKGROUND[3],
        borderWidth: 1,
        // stack: 1,
        hoverBackgroundColor: CLUSTER_BACKGROUND[3],
        hoverBorderColor: CLUSTER_BACKGROUND[3],
        data: cluster4
          .slice(dateRange[datePage][0], dateRange[datePage][1])
          .map((a) => (a.items > 0 ? a.mean : 'NED')),
      },
    ],
  });
  const [lineData, setLineData] = useState({
    labels: cluster1
      .slice(dateRange[datePage][0], dateRange[datePage][1])
      .map((a) => moment(a.date).format('MM/DD')),
    datasets: [
      {
        label: '2 Star Cluster',
        fill: true,
        borderColor: CLUSTER_BACKGROUND[0],
        borderWidth: 2,
        data: cluster1
          .slice(dateRange[datePage][0], dateRange[datePage][1])
          .map((a) => (a.items > 0 ? a.mean : 'NED')),
      },

      {
        label: '3 Star Cluster',
        fill: true,
        borderColor: CLUSTER_BACKGROUND[1],
        borderWidth: 2,
        data: cluster2
          .slice(dateRange[datePage][0], dateRange[datePage][1])
          .map((a) => (a.items > 0 ? a.mean : 'NED')),
      },
      {
        label: '4 Star Cluster',
        fill: true,
        borderColor: CLUSTER_BACKGROUND[2],
        borderWidth: 2,
        data: cluster3
          .slice(dateRange[datePage][0], dateRange[datePage][1])
          .map((a) => (a.items > 0 ? a.mean : 'NED')),
      },
      {
        label: '5 Star Cluster',
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: CLUSTER_BACKGROUND[3],
        borderWidth: 2,
        data: cluster4
          .slice(dateRange[datePage][0], dateRange[datePage][1])
          .map((a) => (a.items > 0 ? a.mean : 'NED')),
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
  });
  const [stackedOptions, setStackedOptions] = useState({
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    type: 'bar',
    scales: {
      xAxes: [
        {
          stacked: true,
        },
      ],
      yAxes: [
        {
          stacked: true,
        },
      ],
    },
  });

  const [scatterData2avg, setScatterData2avg] = useState([]);
  const [scatterData2high, setScatterData2high] = useState([]);
  const [scatterData2low, setScatterData2low] = useState([]);

  const [scatterData3avg, setScatterData3avg] = useState([]);
  const [scatterData3high, setScatterData3high] = useState([]);
  const [scatterData3low, setScatterData3low] = useState([]);

  const [scatterData4avg, setScatterData4avg] = useState([]);
  const [scatterData4high, setScatterData4high] = useState([]);
  const [scatterData4low, setScatterData4low] = useState([]);

  const [scatterData5avg, setScatterData5avg] = useState([]);
  const [scatterData5high, setScatterData5high] = useState([]);
  const [scatterData5low, setScatterData5low] = useState([]);

  const [scatterPlot, setScatterPlot] = useState(2);

  const [scatterPlotLabels, setScatterPlotLabels] = useState(
    cluster1
      .slice(dateRange[datePage][0], dateRange[datePage][1])
      .map((a) => moment(a.date).format('MM/DD'))
  );

  const [bind, setBind] = useState(true);

  const hanndleMatrixChange = (m) => {
    setMatrix(m);
    setChartDataset(datePage, m);
  };

  const setChartDataset = (datePage, matrix) => {
    chartData.labels = cluster1
      .slice(dateRange[datePage][0], dateRange[datePage][1])
      .map((a) => moment(a.date).format('MM/DD'));
    lineData.labels = cluster1
      .slice(dateRange[datePage][0], dateRange[datePage][1])
      .map((a) => moment(a.date).format('MM/DD'));

    if (matrix === 'avg') {
      chartData.datasets.map((set, ix) => {
        if (ix === 0)
          set.data = cluster1
            .slice(dateRange[datePage][0], dateRange[datePage][1])
            .map((a) => (a.items > 0 ? a.mean : 'NED'));
        if (ix === 1)
          set.data = cluster2
            .slice(dateRange[datePage][0], dateRange[datePage][1])
            .map((a) => (a.items > 0 ? a.mean : 'NED'));
        if (ix === 2)
          set.data = cluster3
            .slice(dateRange[datePage][0], dateRange[datePage][1])
            .map((a) => (a.items > 0 ? a.mean : 'NED'));
        if (ix === 3)
          set.data = cluster4
            .slice(dateRange[datePage][0], dateRange[datePage][1])
            .map((a) => (a.items > 0 ? a.mean : 'NED'));
      });
      lineData.datasets.map((set, ix) => {
        if (ix === 0)
          set.data = cluster1
            .slice(dateRange[datePage][0], dateRange[datePage][1])
            .map((a) => (a.items > 0 ? a.mean : 'NED'));
        if (ix === 1)
          set.data = cluster2
            .slice(dateRange[datePage][0], dateRange[datePage][1])
            .map((a) => (a.items > 0 ? a.mean : 'NED'));
        if (ix === 2)
          set.data = cluster3
            .slice(dateRange[datePage][0], dateRange[datePage][1])
            .map((a) => (a.items > 0 ? a.mean : 'NED'));
        if (ix === 3)
          set.data = cluster4
            .slice(dateRange[datePage][0], dateRange[datePage][1])
            .map((a) => (a.items > 0 ? a.mean : 'NED'));
      });
    }
    if (matrix === 'max') {
      chartData.datasets.map((set, ix) => {
        if (ix === 0)
          set.data = cluster1
            .slice(dateRange[datePage][0], dateRange[datePage][1])
            .map((a) => (a.items > 0 ? a.max : 'NED'));
        if (ix === 1)
          set.data = cluster2
            .slice(dateRange[datePage][0], dateRange[datePage][1])
            .map((a) => (a.items > 0 ? a.max : 'NED'));
        if (ix === 2)
          set.data = cluster3
            .slice(dateRange[datePage][0], dateRange[datePage][1])
            .map((a) => (a.items > 0 ? a.max : 'NED'));
        if (ix === 3)
          set.data = cluster4
            .slice(dateRange[datePage][0], dateRange[datePage][1])
            .map((a) => (a.items > 0 ? a.max : 'NED'));
      });
      lineData.datasets.map((set, ix) => {
        if (ix === 0)
          set.data = cluster1
            .slice(dateRange[datePage][0], dateRange[datePage][1])
            .map((a) => (a.items > 0 ? a.max : 'NED'));
        if (ix === 1)
          set.data = cluster2
            .slice(dateRange[datePage][0], dateRange[datePage][1])
            .map((a) => (a.items > 0 ? a.max : 'NED'));
        if (ix === 2)
          set.data = cluster3
            .slice(dateRange[datePage][0], dateRange[datePage][1])
            .map((a) => (a.items > 0 ? a.max : 'NED'));
        if (ix === 3)
          set.data = cluster4
            .slice(dateRange[datePage][0], dateRange[datePage][1])
            .map((a) => (a.items > 0 ? a.max : 'NED'));
      });
    }
    if (matrix === 'min') {
      chartData.datasets.map((set, ix) => {
        if (ix === 0)
          set.data = cluster1
            .slice(dateRange[datePage][0], dateRange[datePage][1])
            .map((a) => (a.items > 0 ? a.min : 'NED'));
        if (ix === 1)
          set.data = cluster2
            .slice(dateRange[datePage][0], dateRange[datePage][1])
            .map((a) => (a.items > 0 ? a.min : 'NED'));
        if (ix === 2)
          set.data = cluster3
            .slice(dateRange[datePage][0], dateRange[datePage][1])
            .map((a) => (a.items > 0 ? a.min : 'NED'));
        if (ix === 3)
          set.data = cluster4
            .slice(dateRange[datePage][0], dateRange[datePage][1])
            .map((a) => (a.items > 0 ? a.min : 'NED'));
      });
      lineData.datasets.map((set, ix) => {
        if (ix === 0)
          set.data = cluster1
            .slice(dateRange[datePage][0], dateRange[datePage][1])
            .map((a) => (a.items > 0 ? a.min : 'NED'));
        if (ix === 1)
          set.data = cluster2
            .slice(dateRange[datePage][0], dateRange[datePage][1])
            .map((a) => (a.items > 0 ? a.min : 'NED'));
        if (ix === 2)
          set.data = cluster3
            .slice(dateRange[datePage][0], dateRange[datePage][1])
            .map((a) => (a.items > 0 ? a.min : 'NED'));
        if (ix === 3)
          set.data = cluster4
            .slice(dateRange[datePage][0], dateRange[datePage][1])
            .map((a) => (a.items > 0 ? a.min : 'NED'));
      });
    }
    if (matrix === 'mod') {
      chartData.datasets.map((set, ix) => {
        if (ix === 0)
          set.data = cluster1
            .slice(dateRange[datePage][0], dateRange[datePage][1])
            .map((a) => (a.items > 0 ? a.mod : 'NED'));
        if (ix === 1)
          set.data = cluster2
            .slice(dateRange[datePage][0], dateRange[datePage][1])
            .map((a) => (a.items > 0 ? a.mod : 'NED'));
        if (ix === 2)
          set.data = cluster3
            .slice(dateRange[datePage][0], dateRange[datePage][1])
            .map((a) => (a.items > 0 ? a.mod : 'NED'));
        if (ix === 3)
          set.data = cluster4
            .slice(dateRange[datePage][0], dateRange[datePage][1])
            .map((a) => (a.items > 0 ? a.mod : 'NED'));
      });
      lineData.datasets.map((set, ix) => {
        if (ix === 0)
          set.data = cluster1
            .slice(dateRange[datePage][0], dateRange[datePage][1])
            .map((a) => (a.items > 0 ? a.mod : 'NED'));
        if (ix === 1)
          set.data = cluster2
            .slice(dateRange[datePage][0], dateRange[datePage][1])
            .map((a) => (a.items > 0 ? a.mod : 'NED'));
        if (ix === 2)
          set.data = cluster3
            .slice(dateRange[datePage][0], dateRange[datePage][1])
            .map((a) => (a.items > 0 ? a.mod : 'NED'));
        if (ix === 3)
          set.data = cluster4
            .slice(dateRange[datePage][0], dateRange[datePage][1])
            .map((a) => (a.items > 0 ? a.mod : 'NED'));
      });
    }
  };

  const handleScatterPlotMatrix = (e) => {
    setScatterPlot(e);
  };

  const handleDatePage = (e) => {
    setDatePage(e);
    setChartDataset(e, matrix);
    // console.log(
    //   'datePage = ' + datePage + 'dateRange = ' + dateRange[datePage][0],
    //   dateRange[datePage][1]
    // );
  };

  useEffect(() => {
    if (clusterData.length > 0) {
      setScatterPlotLabels(
        cluster1
          .slice(dateRange[datePage][0], dateRange[datePage][1])
          .map((a) => moment(a.date).format('MM/DD'))
      );
      cluster1
        .slice(dateRange[datePage][0], dateRange[datePage][1])
        .map((cl) => {
          if (cl.items > 0) {
            setScatterData2avg((state) => [...state, cl.mean]);
            setScatterData2high((state) => [...state, cl.max]);
            setScatterData2low((state) => [...state, cl.min]);
          } else {
            setScatterData2avg((state) => [...state, 'NED']);
            setScatterData2high((state) => [...state, 'NED']);
            setScatterData2low((state) => [...state, 'NED']);
          }
        });
      cluster2
        .slice(dateRange[datePage][0], dateRange[datePage][1])
        .map((cl) => {
          if (cl.items > 0) {
            setScatterData3avg((state) => [...state, cl.mean]);
            setScatterData3high((state) => [...state, cl.max]);
            setScatterData3low((state) => [...state, cl.min]);
          } else {
            setScatterData3avg((state) => [...state, 'NED']);
            setScatterData3high((state) => [...state, 'NED']);
            setScatterData3low((state) => [...state, 'NED']);
          }
        });
      cluster3
        .slice(dateRange[datePage][0], dateRange[datePage][1])
        .map((cl) => {
          if (cl.items > 0) {
            setScatterData4avg((state) => [...state, cl.mean]);
            setScatterData4high((state) => [...state, cl.max]);
            setScatterData4low((state) => [...state, cl.min]);
          } else {
            setScatterData4avg((state) => [...state, 'NED']);
            setScatterData4high((state) => [...state, 'NED']);
            setScatterData4low((state) => [...state, 'NED']);
          }
        });
      cluster4
        .slice(dateRange[datePage][0], dateRange[datePage][1])
        .map((cl) => {
          if (cl.items > 0) {
            setScatterData5avg((state) => [...state, cl.mean]);
            setScatterData5high((state) => [...state, cl.max]);
            setScatterData5low((state) => [...state, cl.min]);
          } else {
            setScatterData5avg((state) => [...state, 'NED']);
            setScatterData5high((state) => [...state, 'NED']);
            setScatterData5low((state) => [...state, 'NED']);
          }
        });
    }
  }, [datePage]);
  return (
    <div>
      {bind ? (
        <>
          <Grid className="my-5" container justify="space-around">
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
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="grouped-native-select">
                Date Range
              </InputLabel>
              <Select
                native={true}
                onChange={(e) => handleDatePage(e.target.value)}
                id="grouped-native-select"
                value={datePage}
              >
                <option value="0">{`${dateRange[0][0]} - ${dateRange[0][1]}`}</option>
                <option value="1">{`${dateRange[1][0]} - ${dateRange[1][1]}`}</option>
                <option value="2">{`${dateRange[2][0]} - ${dateRange[2][1]}`}</option>
              </Select>
            </FormControl>
          </Grid>
          {scatterData2avg.length > 0 && scatterPlot == 2 ? (
            //(console.log('scatterData => ' + JSON.stringify(scatterData)),
            <Line
              data={{
                labels: scatterPlotLabels,
                datasets: [
                  {
                    label: 'HIGH',
                    showLine: false,
                    backgroundColor: '#f4f4f4',
                    borderColor: '#3F51B5',
                    hoverBackgroundColor: '#3F51B5',
                    hoverBorderColor: '#f4f4f4',
                    data: scatterData2high,
                    pointRadius: 3,
                  },
                  {
                    label: 'AVG',
                    showLine: false,
                    backgroundColor: '#f4f4f4',
                    borderColor: '#00BCD4',
                    hoverBackgroundColor: '#00BCD4',
                    hoverBorderColor: '#f4f4f4',
                    pointRadius: 6,
                    data: scatterData2avg,
                  },
                  {
                    label: 'LOW',
                    showLine: false,
                    backgroundColor: '#f4f4f4',
                    borderColor: '#E91E63',
                    hoverBackgroundColor: '#E91E63',
                    hoverBorderColor: '#f4f4f4',
                    pointRadius: 3,
                    data: scatterData2low,
                  },
                ],
              }}
            />
          ) : scatterData3avg.length > 0 && scatterPlot == 3 ? (
            //(console.log('scatterData => ' + JSON.stringify(scatterData)),
            <Line
              data={{
                labels: scatterPlotLabels,
                datasets: [
                  {
                    label: 'HIGH',
                    showLine: false,
                    backgroundColor: '#f4f4f4',
                    borderColor: '#3F51B5',
                    hoverBackgroundColor: '#3F51B5',
                    hoverBorderColor: '#f4f4f4',
                    pointRadius: 3,
                    data: scatterData3high,
                  },
                  {
                    label: 'AVG',
                    showLine: false,
                    backgroundColor: '#f4f4f4',
                    borderColor: '#00BCD4',
                    hoverBackgroundColor: '#00BCD4',
                    hoverBorderColor: '#f4f4f4',
                    pointRadius: 6,
                    data: scatterData3avg,
                  },
                  {
                    label: 'LOW',
                    showLine: false,
                    backgroundColor: '#f4f4f4',
                    borderColor: '#E91E63',
                    hoverBackgroundColor: '#E91E63',
                    hoverBorderColor: '#f4f4f4',
                    pointRadius: 3,
                    data: scatterData3low,
                  },
                ],
              }}
            />
          ) : scatterData4avg.length > 0 && scatterPlot == 4 ? (
            //(console.log('scatterData => ' + JSON.stringify(scatterData)),
            <Line
              data={{
                labels: scatterPlotLabels,
                datasets: [
                  {
                    label: 'HIGH',
                    showLine: false,
                    backgroundColor: '#f4f4f4',
                    borderColor: '#3F51B5',
                    hoverBackgroundColor: '#3F51B5',
                    hoverBorderColor: '#f4f4f4',
                    pointRadius: 3,
                    data: scatterData4high,
                  },
                  {
                    label: 'AVG',
                    showLine: false,
                    backgroundColor: '#f4f4f4',
                    borderColor: '#00BCD4',
                    hoverBackgroundColor: '#00BCD4',
                    hoverBorderColor: '#f4f4f4',
                    pointRadius: 6,
                    data: scatterData4avg,
                  },
                  {
                    label: 'LOW',
                    showLine: false,
                    backgroundColor: '#f4f4f4',
                    borderColor: '#E91E63',
                    hoverBackgroundColor: '#E91E63',
                    hoverBorderColor: '#f4f4f4',
                    pointRadius: 3,
                    data: scatterData4low,
                  },
                ],
              }}
            />
          ) : scatterData5avg.length > 0 && scatterPlot == 5 ? (
            //(console.log('scatterData => ' + JSON.stringify(scatterData)),
            <Line
              data={{
                labels: scatterPlotLabels,
                datasets: [
                  {
                    label: 'HIGH',
                    showLine: false,
                    backgroundColor: '#f4f4f4',
                    borderColor: '#3F51B5',
                    hoverBackgroundColor: '#3F51B5',
                    hoverBorderColor: '#f4f4f4',
                    pointRadius: 3,
                    data: scatterData5high,
                  },
                  {
                    label: 'AVG',
                    showLine: false,
                    backgroundColor: '#f4f4f4',
                    borderColor: '#00BCD4',
                    hoverBackgroundColor: '#00BCD4',
                    hoverBorderColor: '#f4f4f4',
                    pointRadius: 6,
                    data: scatterData5avg,
                  },
                  {
                    label: 'LOW',
                    showLine: false,
                    backgroundColor: '#f4f4f4',
                    borderColor: '#E91E63',
                    hoverBackgroundColor: '#E91E63',
                    hoverBorderColor: '#f4f4f4',
                    pointRadius: 3,
                    data: scatterData5low,
                  },
                ],
              }}
            />
          ) : (
            <></>
          )}
          <hr className="my-5"></hr>
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

            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="grouped-native-select">
                Date Range
              </InputLabel>
              <Select
                native={true}
                onChange={(e) => handleDatePage(e.target.value)}
                id="grouped-native-select"
                value={datePage}
              >
                <option value="0">{`${dateRange[0][0]} - ${dateRange[0][1]}`}</option>
                <option value="1">{`${dateRange[1][0]} - ${dateRange[1][1]}`}</option>
                <option value="2">{`${dateRange[2][0]} - ${dateRange[2][1]}`}</option>
              </Select>
            </FormControl>
          </Grid>

          <Box className="my-5">
            <Bar height={400} width={100} data={chartData} options={options} />
          </Box>
          <hr className="my-5"></hr>
          <Box className="my-5">
            <Bar
              height={400}
              width={100}
              data={chartData}
              options={stackedOptions}
            />
          </Box>
          <hr className="my-5"></hr>
          <Line data={lineData} height={100} />
        </>
      ) : (
        <>Binding Data...</>
      )}
    </div>
  );
};
