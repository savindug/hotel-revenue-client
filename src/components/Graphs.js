import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  Select,
} from '@material-ui/core';
import { get } from 'jquery';
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
export const Graphs = ({ selectedDate }) => {
  const classes = useStyles();
  const [matrix, setMatrix] = useState('avg');
  const getClusterDataSet = useSelector((state) => state.clusterDataSet);
  const {
    loading,
    err,
    clusterData,
    cluster1,
    cluster2,
    cluster3,
    cluster4,
    hotels,
    reqHotel,
    report_len,
  } = getClusterDataSet;

  const getDateRange = () => {
    let dateRange_arr = [];
    let totalDays = 0;

    if (report_len > 0) {
      const no_chuncks = Math.ceil(report_len / 30);

      for (let i = 1; i <= no_chuncks; i++) {
        totalDays += 30;
        if (totalDays <= report_len) {
          dateRange_arr.push([(i - 1) * 30, i * 30]);
        } else if (totalDays > report_len) {
          dateRange_arr.push([(i - 1) * 30, i * 30 - (totalDays - report_len)]);
        }
      }
    }
    return dateRange_arr;
  };

  const [dateRange, setDateRange] = useState(getDateRange());

  const [datePage, setDatePage] = useState(0);

  const [chartData, setChartDatae] = useState({
    labels: cluster1
      .slice(dateRange[datePage][0], dateRange[datePage][1])
      .map((a) => moment(a.date).format('MM/DD')),
    datasets: [
      cluster1.length > 0
        ? {
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
          }
        : {},

      cluster2.length > 0
        ? {
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
          }
        : {},
      cluster3.length > 0
        ? {
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
          }
        : {},
      cluster4.length > 0
        ? {
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
          }
        : {},
    ],
  });
  const [lineData, setLineData] = useState({
    labels: cluster1
      .slice(dateRange[datePage][0], dateRange[datePage][1])
      .map((a) => moment(a.date).format('MM/DD')),
    datasets: [
      cluster1.length > 0
        ? {
            label: '2 Star Cluster',
            fill: true,
            borderColor: CLUSTER_BACKGROUND[0],
            borderWidth: 5,
            data: cluster1
              .slice(dateRange[datePage][0], dateRange[datePage][1])
              .map((a) => (a.items > 0 ? a.mean : 'NED')),
          }
        : {
            label: '2 Star Cluster',
            fill: true,
            borderColor: CLUSTER_BACKGROUND[0],
            borderWidth: 5,
          },
      cluster2.length > 0
        ? {
            label: '3 Star Cluster',
            fill: true,
            borderColor: CLUSTER_BACKGROUND[1],
            borderWidth: 5,
            data: cluster2
              .slice(dateRange[datePage][0], dateRange[datePage][1])
              .map((a) => (a.items > 0 ? a.mean : 'NED')),
          }
        : {
            label: '3 Star Cluster',
            fill: true,
            borderColor: CLUSTER_BACKGROUND[1],
            borderWidth: 5,
          },
      cluster3.length > 0
        ? {
            label: '4 Star Cluster',
            fill: true,
            borderColor: CLUSTER_BACKGROUND[2],
            borderWidth: 5,
            data: cluster3
              .slice(dateRange[datePage][0], dateRange[datePage][1])
              .map((a) => (a.items > 0 ? a.mean : 'NED')),
          }
        : {
            label: '4 Star Cluster',
            fill: true,
            borderColor: CLUSTER_BACKGROUND[2],
            borderWidth: 5,
          },
      cluster4.length > 0
        ? {
            label: '5 Star Cluster',
            fill: true,
            // backgroundColor: 'rgba(75,192,192,0.2)',
            borderColor: CLUSTER_BACKGROUND[3],
            borderWidth: 5,
            data: cluster4
              .slice(dateRange[datePage][0], dateRange[datePage][1])
              .map((a) => (a.items > 0 ? a.mean : 'NED')),
          }
        : {
            label: '5 Star Cluster',
            fill: true,
            // backgroundColor: 'rgba(75,192,192,0.2)',
            borderColor: CLUSTER_BACKGROUND[3],
            borderWidth: 5,
          },
      reqHotel.length > 0
        ? {
            label: reqHotel.find((el) => el.name != null).name,
            //new option, type will default to bar as that what is used to create the scale
            type: 'line',
            fill: true,
            borderColor: '#2e2e2e',
            borderWidth: 5,
            data: reqHotel
              .slice(dateRange[datePage][0], dateRange[datePage][1])
              .map((a) => a.rate),
          }
        : {
            label: reqHotel.find((el) => el.name != null).name,
            //new option, type will default to bar as that what is used to create the scale
            type: 'line',
            fill: true,
            borderColor: '#2e2e2e',
            borderWidth: 5,
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
    scales: {
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: 'Rates',
          },
        },
      ],
    },
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
          scaleLabel: {
            display: true,
            labelString: 'Hotel Rank',
          },
        },
      ],
    },
  });

  const [_hotelData, set_HotelData] = useState({
    labels: cluster1
      .slice(dateRange[datePage][0], dateRange[datePage][1])
      .map((a) => moment(a.date).format('MM/DD')),
    datasets: [
      {
        label: reqHotel.find((el) => el.name != null).name,
        type: 'line',
        fill: false,
        showLine: false,
        backgroundColor: '#2e2e2e',
        borderColor: '#2e2e2e',
        data: [],
      },
      {
        label: 'No Rates',
        backgroundColor: '#B0BEC5',
        borderColor: '#B0BEC5',
        borderWidth: 1,
        //stack: 1,
        hoverBackgroundColor: '#B0BEC5',
        hoverBorderColor: '#B0BEC5',
        data: [],
      },
      {
        label: 'Outliers',
        backgroundColor: '#9E9E9E',
        borderColor: '#9E9E9E',
        borderWidth: 1,
        //stack: 1,
        hoverBackgroundColor: '#9E9E9E',
        hoverBorderColor: '#9E9E9E',
        data: [],
      },
      {
        label: 'Stars 2',
        backgroundColor: CLUSTER_BACKGROUND[0],
        borderColor: CLUSTER_BACKGROUND[0],
        borderWidth: 1,
        //stack: 1,
        hoverBackgroundColor: CLUSTER_BACKGROUND[0],
        hoverBorderColor: CLUSTER_BACKGROUND[0],
        data: [],
      },
      {
        label: 'Stars 3',
        backgroundColor: CLUSTER_BACKGROUND[1],
        borderColor: CLUSTER_BACKGROUND[1],
        borderWidth: 1,
        //stack: 1,
        hoverBackgroundColor: CLUSTER_BACKGROUND[1],
        hoverBorderColor: CLUSTER_BACKGROUND[1],
        data: [],
      },
      {
        label: 'Stars 4',
        backgroundColor: CLUSTER_BACKGROUND[2],
        borderColor: CLUSTER_BACKGROUND[2],
        borderWidth: 1,
        //stack: 1,
        hoverBackgroundColor: CLUSTER_BACKGROUND[2],
        hoverBorderColor: CLUSTER_BACKGROUND[2],
        data: [],
      },
      {
        label: 'Stars 5',
        backgroundColor: CLUSTER_BACKGROUND[3],
        borderColor: CLUSTER_BACKGROUND[3],
        borderWidth: 1,
        // stack: 1,
        hoverBackgroundColor: CLUSTER_BACKGROUND[3],
        hoverBorderColor: CLUSTER_BACKGROUND[3],
        data: [],
      },
    ],
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

  const [_hotelsCountDataset, set_hotelsCountDataset] = useState([]);

  const [scatterPlot, setScatterPlot] = useState(2);

  const [scatterPlotLabels, setScatterPlotLabels] = useState(
    cluster1
      .slice(dateRange[datePage][0], dateRange[datePage][1])
      .map((a) => moment(a.date).format('MM/DD'))
  );

  const [bind, setBind] = useState(false);

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
    _hotelData.labels = cluster1
      .slice(dateRange[datePage][0], dateRange[datePage][1])
      .map((a) => moment(a.date).format('MM/DD'));

    _hotelData.datasets[0].data = reqHotel
      .slice(dateRange[datePage][0], dateRange[datePage][1])
      .map((a) => a.overallRank);

    _hotelData.datasets[1].data = _hotelsCountDataset
      .map((x) => x.noRateHotels)
      .slice(dateRange[datePage][0], dateRange[datePage][1]);
    _hotelData.datasets[2].data = _hotelsCountDataset
      .map((x) => x.outliers)
      .slice(dateRange[datePage][0], dateRange[datePage][1]);
    _hotelData.datasets[3].data = _hotelsCountDataset
      .map((x) => x.cls2h)
      .slice(dateRange[datePage][0], dateRange[datePage][1]);
    _hotelData.datasets[4].data = _hotelsCountDataset
      .map((x) => x.cls3h)
      .slice(dateRange[datePage][0], dateRange[datePage][1]);
    _hotelData.datasets[5].data = _hotelsCountDataset
      .map((x) => x.cls4h)
      .slice(dateRange[datePage][0], dateRange[datePage][1]);
    _hotelData.datasets[6].data = _hotelsCountDataset
      .map((x) => x.cls5h)
      .slice(dateRange[datePage][0], dateRange[datePage][1]);

    lineData.datasets[4].data = reqHotel
      .slice(dateRange[datePage][0], dateRange[datePage][1])
      .map((a) => a.rate);

    try {
      if (matrix === 'avg') {
        chartData.datasets.map((set, ix) => {
          if (ix === 0) {
            if (cluster1.length > 0) {
              set.data = cluster1
                .slice(dateRange[datePage][0], dateRange[datePage][1])
                .map((a) => (a.items > 0 ? a.mean : 'NED'));
            }
          }

          if (ix === 1) {
            if (cluster2.length > 0) {
              set.data = cluster2
                .slice(dateRange[datePage][0], dateRange[datePage][1])
                .map((a) => (a.items > 0 ? a.mean : 'NED'));
            }
          }

          if (ix === 2) {
            if (cluster3.length > 0) {
              set.data = cluster3
                .slice(dateRange[datePage][0], dateRange[datePage][1])
                .map((a) => (a.items > 0 ? a.mean : 'NED'));
            }
          }

          if (ix === 3) {
            if (cluster4.length > 0) {
              set.data = cluster4
                .slice(dateRange[datePage][0], dateRange[datePage][1])
                .map((a) => (a.items > 0 ? a.mean : 'NED'));
            }
          }
        });
        lineData.datasets.map((set, ix) => {
          if (ix === 0) {
            if (cluster1.length > 0) {
              set.data = cluster1
                .slice(dateRange[datePage][0], dateRange[datePage][1])
                .map((a) => (a.items > 0 ? a.mean : 'NED'));
            }
          }

          if (ix === 1) {
            if (cluster2.length > 0) {
              set.data = cluster2
                .slice(dateRange[datePage][0], dateRange[datePage][1])
                .map((a) => (a.items > 0 ? a.mean : 'NED'));
            }
          }
          if (ix === 2) {
            if (cluster3.length > 0) {
              set.data = cluster3
                .slice(dateRange[datePage][0], dateRange[datePage][1])
                .map((a) => (a.items > 0 ? a.mean : 'NED'));
            }
          }
          if (ix === 3) {
            if (cluster4.length > 0) {
              set.data = cluster4
                .slice(dateRange[datePage][0], dateRange[datePage][1])
                .map((a) => (a.items > 0 ? a.mean : 'NED'));
            }
          }
        });
      }
      if (matrix === 'max') {
        chartData.datasets.map((set, ix) => {
          if (ix === 0) {
            if (cluster1.length > 0) {
              set.data = cluster1
                .slice(dateRange[datePage][0], dateRange[datePage][1])
                .map((a) => (a.items > 0 ? a.max : 'NED'));
            }
          }

          if (ix === 1) {
            if (cluster2.length > 0) {
              set.data = cluster2
                .slice(dateRange[datePage][0], dateRange[datePage][1])
                .map((a) => (a.items > 0 ? a.max : 'NED'));
            }
          }

          if (ix === 2) {
            if (cluster3.length > 0) {
              set.data = cluster3
                .slice(dateRange[datePage][0], dateRange[datePage][1])
                .map((a) => (a.items > 0 ? a.max : 'NED'));
            }
          }

          if (ix === 3) {
            if (cluster4.length > 0) {
              set.data = cluster4
                .slice(dateRange[datePage][0], dateRange[datePage][1])
                .map((a) => (a.items > 0 ? a.max : 'NED'));
            }
          }
        });
        lineData.datasets.map((set, ix) => {
          if (ix === 0) {
            if (cluster1.length > 0) {
              set.data = cluster1
                .slice(dateRange[datePage][0], dateRange[datePage][1])
                .map((a) => (a.items > 0 ? a.max : 'NED'));
            }
          }

          if (ix === 1) {
            if (cluster2.length > 0) {
              set.data = cluster2
                .slice(dateRange[datePage][0], dateRange[datePage][1])
                .map((a) => (a.items > 0 ? a.max : 'NED'));
            }
          }

          if (ix === 2) {
            if (cluster3.length > 0) {
              set.data = cluster3
                .slice(dateRange[datePage][0], dateRange[datePage][1])
                .map((a) => (a.items > 0 ? a.max : 'NED'));
            }
          }

          if (ix === 3) {
            if (cluster4.length > 0) {
              set.data = cluster4
                .slice(dateRange[datePage][0], dateRange[datePage][1])
                .map((a) => (a.items > 0 ? a.max : 'NED'));
            }
          }
        });
      }
      if (matrix === 'min') {
        chartData.datasets.map((set, ix) => {
          if (ix === 0) {
            if (cluster1.length > 0) {
              set.data = cluster1
                .slice(dateRange[datePage][0], dateRange[datePage][1])
                .map((a) => (a.items > 0 ? a.min : 'NED'));
            }
          }

          if (ix === 1) {
            if (cluster2.length > 0) {
              set.data = cluster2
                .slice(dateRange[datePage][0], dateRange[datePage][1])
                .map((a) => (a.items > 0 ? a.min : 'NED'));
            }
          }

          if (ix === 2) {
            if (cluster3.length > 0) {
              set.data = cluster3
                .slice(dateRange[datePage][0], dateRange[datePage][1])
                .map((a) => (a.items > 0 ? a.min : 'NED'));
            }
          }

          if (ix === 3) {
            if (cluster4.length > 0) {
              set.data = cluster4
                .slice(dateRange[datePage][0], dateRange[datePage][1])
                .map((a) => (a.items > 0 ? a.min : 'NED'));
            }
          }
        });
        lineData.datasets.map((set, ix) => {
          if (ix === 0) {
            if (cluster1.length > 0) {
              set.data = cluster1
                .slice(dateRange[datePage][0], dateRange[datePage][1])
                .map((a) => (a.items > 0 ? a.min : 'NED'));
            }
          }

          if (ix === 1) {
            if (cluster2.length > 0) {
              set.data = cluster2
                .slice(dateRange[datePage][0], dateRange[datePage][1])
                .map((a) => (a.items > 0 ? a.min : 'NED'));
            }
          }

          if (ix === 2) {
            if (cluster3.length > 0) {
              set.data = cluster3
                .slice(dateRange[datePage][0], dateRange[datePage][1])
                .map((a) => (a.items > 0 ? a.min : 'NED'));
            }
          }

          if (ix === 3) {
            if (cluster4.length > 0) {
              set.data = cluster4
                .slice(dateRange[datePage][0], dateRange[datePage][1])
                .map((a) => (a.items > 0 ? a.min : 'NED'));
            }
          }
        });
      }
      if (matrix === 'mod') {
        chartData.datasets.map((set, ix) => {
          if (ix === 0) {
            if (cluster1.length > 0) {
              set.data = cluster1
                .slice(dateRange[datePage][0], dateRange[datePage][1])
                .map((a) => (a.items > 0 ? a.mod : 'NED'));
            }
          }

          if (ix === 1) {
            if (cluster2.length > 0) {
              set.data = cluster2
                .slice(dateRange[datePage][0], dateRange[datePage][1])
                .map((a) => (a.items > 0 ? a.mod : 'NED'));
            }
          }

          if (ix === 2) {
            if (cluster3.length > 0) {
              set.data = cluster3
                .slice(dateRange[datePage][0], dateRange[datePage][1])
                .map((a) => (a.items > 0 ? a.mod : 'NED'));
            }
          }

          if (ix === 3) {
            if (cluster4.length > 0) {
              set.data = cluster4
                .slice(dateRange[datePage][0], dateRange[datePage][1])
                .map((a) => (a.items > 0 ? a.mod : 'NED'));
            }
          }
        });
        lineData.datasets.map((set, ix) => {
          if (ix === 0) {
            if (cluster1.length > 0) {
              set.data = cluster1
                .slice(dateRange[datePage][0], dateRange[datePage][1])
                .map((a) => (a.items > 0 ? a.mod : 'NED'));
            }
          }

          if (ix === 1) {
            if (cluster2.length > 0) {
              set.data = cluster2
                .slice(dateRange[datePage][0], dateRange[datePage][1])
                .map((a) => (a.items > 0 ? a.mod : 'NED'));
            }
          }

          if (ix === 2) {
            if (cluster3.length > 0) {
              set.data = cluster3
                .slice(dateRange[datePage][0], dateRange[datePage][1])
                .map((a) => (a.items > 0 ? a.mod : 'NED'));
            }
          }

          if (ix === 3) {
            if (cluster4.length > 0) {
              set.data = cluster4
                .slice(dateRange[datePage][0], dateRange[datePage][1])
                .map((a) => (a.items > 0 ? a.mod : 'NED'));
            }
          }
        });
      }
    } catch (e) {}
  };

  const handleScatterPlotMatrix = (e) => {
    setScatterPlot(e);
  };

  const getClusterByPrice = (rate, ix) => {
    let clustered = [];
    let res;

    if (cluster1.length > 0 && cluster1[ix]) {
      clustered.push(cluster1[ix]);
    }
    if (cluster2.length > 0 && cluster2[ix]) {
      clustered.push(cluster2[ix]);
    }
    if (cluster3.length > 0 && cluster3[ix]) {
      clustered.push(cluster3[ix]);
    }
    if (cluster4.length > 0 && cluster4[ix]) {
      clustered.push(cluster4[ix]);
    }

    clustered.sort((a, b) => a.mean - b.mean);

    // console.log(clustered);

    try {
      clustered.map((cl, id) => {
        if (rate >= cl.min && rate <= cl.max) {
          res = id;
          return;
        }
      });
    } catch (e) {}

    return res;
  };

  const handleDatePage = (e) => {
    setDatePage(e);
    setChartDataset(e, matrix);
    // console.log(
    //   'datePage = ' + datePage + 'dateRange = ' + dateRange[datePage][0],
    //   dateRange[datePage][1]
    // );
  };

  const getPrice = (arr) => {
    const price = arr.findIndex((e) => e > 0);
    return price;
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

  useEffect(() => {
    const getPropertyRankInCluster = (day, others) => {
      let rank = null;
      let rate = 'N/A';

      if (reqHotel[day] != null) {
        let pr_rnk =
          parseInt(reqHotel[day].rank.split('/')[1]) -
          parseInt(reqHotel[day].rank.split('/')[0]);

        rate = reqHotel[day].rate;

        pr_rnk = pr_rnk + others;

        if (reqHotel[day].cluster == 2) {
          rank = pr_rnk;
        }
        if (reqHotel[day].cluster == 3) {
          rank = cluster1[day].unwanted.length + pr_rnk;
        }
        if (reqHotel[day].cluster == 4) {
          rank =
            cluster1[day].unwanted.length +
            cluster2[day].unwanted.length +
            pr_rnk;
        }
        if (reqHotel[day].cluster == 5) {
          rank =
            cluster1[day].unwanted.length +
            cluster2[day].unwanted.length +
            cluster3[day].unwanted.length +
            pr_rnk;
        }
      }

      return `${rank}`;
    };

    const buildHotelsDataSet = async () => {
      let datebyhotelcount = [];
      const dates_arr = [...Array(report_len).keys()].map((ob, id) =>
        moment(selectedDate).add(id, 'd').format('YYYY-MM-DD')
      );
      await [...Array(report_len).keys()].map((e, ix) => {
        let cls5h = [];
        let cls4h = [];
        let cls3h = [];
        let cls2h = [];
        let outliers = [];
        let noRateHotels = [];
        let non = [];
        hotels.map((_hotel, index) => {
          if (_hotel.prices[ix] != null) {
            if (checkHotelAvailability(_hotel.hotelID, ix)) {
              let clstr =
                getClusterByPrice(
                  _hotel.prices[ix].price[getPrice(_hotel.prices[ix].price)],
                  ix
                ) + 2;
              clstr === 5
                ? cls5h.push(_hotel)
                : clstr === 4
                ? cls4h.push(_hotel)
                : clstr === 3
                ? cls3h.push(_hotel)
                : clstr === 2
                ? cls2h.push(_hotel)
                : outliers.push(_hotel);
            } else {
              outliers.push(_hotel);
            }
          } else {
            noRateHotels.push(_hotel);
          }
        });

        const day = {
          // date: hotels[0].prices[ix].date,
          date: dates_arr,
          cls5h: cls5h.length,
          cls4h: cls4h.length,
          cls3h: cls3h.length,
          cls2h: cls2h.length,
          outliers: outliers.length,
          noRateHotels: noRateHotels.length,
        };
        datebyhotelcount.push(day);

        reqHotel[ix].overallRank = getPropertyRankInCluster(
          ix,
          noRateHotels.length + outliers.length
        );

        // console.log(
        //   `date: ${hotels[0].prices[ix].date}, cls5h: ${cls5h.length}, cls4h: ${cls4h.length}, cls3h: ${cls3h.length}, cls2h: ${cls2h.length}, outliers: ${outliers.length}, noRateHotels: ${noRateHotels.length}`
        // );
      });

      _hotelData.datasets[1].data = datebyhotelcount.map((x) => x.noRateHotels);
      _hotelData.datasets[2].data = datebyhotelcount.map((x) => x.outliers);
      _hotelData.datasets[3].data = datebyhotelcount.map((x) => x.cls2h);
      _hotelData.datasets[4].data = datebyhotelcount.map((x) => x.cls3h);
      _hotelData.datasets[5].data = datebyhotelcount.map((x) => x.cls4h);
      _hotelData.datasets[6].data = datebyhotelcount.map((x) => x.cls5h);
      _hotelData.datasets[0].data = reqHotel
        .slice(dateRange[datePage][0], dateRange[datePage][1])
        .map((a) => a.overallRank);

      set_hotelsCountDataset(datebyhotelcount);
      setBind(true);
      // console.log(reqHotel);
    };

    buildHotelsDataSet();
  }, []);

  useEffect(() => {
    if (clusterData.length > 0) {
      setScatterPlotLabels(
        cluster1
          .slice(dateRange[datePage][0], dateRange[datePage][1])
          .map((a) => moment(a.date).format('MM/DD'))
      );
      if (cluster1.length > 0) {
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
      }
      if (cluster2.length > 0) {
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
      }
      if (cluster3.length > 0) {
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
      }
      if (cluster4.length > 0) {
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
    }
  }, [datePage]);

  return (
    <div>
      {bind ? (
        <>
          <Grid className="my-5" container justify="space-around">
            <h3>Rate Position</h3>

            <FormControl className={classes.formControl}></FormControl>
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
                {dateRange.length > 0 ? (
                  dateRange.map((e, i) => (
                    <option value={i}>{`${e[0]} - ${e[1]} Days`}</option>
                  ))
                ) : (
                  <></>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Box className="my-5">
            <Bar
              height={400}
              width={100}
              data={_hotelData}
              options={stackedOptions}
            />
          </Box>

          <hr className="my-5"></hr>
          <Grid container justify="space-around" className="my-5">
            <h3>Bucket Rates</h3>
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
                <option value="mod">Most Repeated rate </option>
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
                {dateRange.length > 0 ? (
                  dateRange.map((e, i) => (
                    <option value={i}>{`${e[0]} - ${e[1]} Days`}</option>
                  ))
                ) : (
                  <></>
                )}
              </Select>
            </FormControl>
          </Grid>

          <Line
            data={lineData}
            height={100}
            options={{
              scales: {
                yAxes: [
                  {
                    scaleLabel: {
                      display: true,
                      labelString: 'Rates',
                    },
                  },
                ],
              },
            }}
          />

          <Box className="my-5">
            <Bar height={400} width={100} data={chartData} options={options} />
          </Box>
        </>
      ) : (
        <>Binding Data...</>
      )}
    </div>
  );
};
