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
  } = getClusterDataSet;

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

  const [_hotelData, set_HotelData] = useState({
    labels: cluster1
      .slice(dateRange[datePage][0], dateRange[datePage][1])
      .map((a) => moment(a.date).format('MM/DD')),
    datasets: [
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

    _hotelData.datasets[0].data = _hotelsCountDataset
      .map((x) => x.noRateHotels)
      .slice(dateRange[datePage][0], dateRange[datePage][1]);
    _hotelData.datasets[1].data = _hotelsCountDataset
      .map((x) => x.outliers)
      .slice(dateRange[datePage][0], dateRange[datePage][1]);
    _hotelData.datasets[2].data = _hotelsCountDataset
      .map((x) => x.cls2h)
      .slice(dateRange[datePage][0], dateRange[datePage][1]);
    _hotelData.datasets[3].data = _hotelsCountDataset
      .map((x) => x.cls3h)
      .slice(dateRange[datePage][0], dateRange[datePage][1]);
    _hotelData.datasets[4].data = _hotelsCountDataset
      .map((x) => x.cls4h)
      .slice(dateRange[datePage][0], dateRange[datePage][1]);
    _hotelData.datasets[5].data = _hotelsCountDataset
      .map((x) => x.cls5h)
      .slice(dateRange[datePage][0], dateRange[datePage][1]);

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

  const getClusterByPrice = (rate, ix) => {
    if (
      (cluster1[ix].min != undefined || cluster1[ix].min != null) &&
      (cluster1[ix].max != undefined || cluster1[ix].max != null)
    ) {
      if (rate >= cluster1[ix].min && rate <= cluster1[ix].max) {
        // console.log(
        //   `${ix} => ${cluster1[ix].min} < ${rate} > ${cluster1[ix].max} `
        // );
        return 0;
      }
    }
    if (
      (cluster2[ix].min != undefined || cluster2[ix].min != null) &&
      (cluster2[ix].max != undefined || cluster2[ix].max != null)
    ) {
      if (rate >= cluster2[ix].min && rate <= cluster2[ix].max) {
        // console.log(
        //   `${ix} =>${cluster2[ix].min} < ${rate} > ${cluster2[ix].max} `
        // );
        return 1;
      }
    }

    if (
      (cluster3[ix].min != undefined || cluster3[ix].min != null) &&
      (cluster3[ix].max != undefined || cluster3[ix].max != null)
    ) {
      if (rate >= cluster3[ix].min && rate <= cluster3[ix].max) {
        // console.log(
        //   `${ix} =>${cluster3[ix].min} < ${rate} > ${cluster3[ix].max} `
        // );
        return 2;
      }
    }
    if (
      (cluster4[ix].min != undefined || cluster4[ix].min != null) &&
      (cluster4[ix].max != undefined || cluster4[ix].max != null)
    ) {
      if (rate >= cluster4[ix].min && rate <= cluster4[ix].max) {
        // console.log(
        //   `${ix} =>${cluster4[ix].min} < ${rate} > ${cluster4[ix].max} `
        // );
        return 3;
      }
    }
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
    const hotels_arr = Array.prototype.concat(
      cluster1[day].unwanted,
      cluster2[day].unwanted,
      cluster3[day].unwanted,
      cluster4[day].unwanted
    );

    const exists = hotels_arr.some((obj) => obj.id == id);

    if (exists) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    const buildHotelsDataSet = async () => {
      let datebyhotelcount = [];
      const dates_arr = [...Array(90).keys()].map((ob, id) =>
        moment(selectedDate).add(id, 'd').format('YYYY-MM-DD')
      );
      await [...Array(90).keys()].map((e, ix) => {
        let cls5h = [];
        let cls4h = [];
        let cls3h = [];
        let cls2h = [];
        let outliers = [];
        let noRateHotels = [];
        hotels.map((_hotel, index) => {
          if (_hotel.prices[ix] != null) {
            if (checkHotelAvailability(_hotel.hotelID, ix)) {
              let clstr =
                getClusterByPrice(
                  _hotel.prices[ix].price[getPrice(_hotel.prices[ix].price)],
                  ix
                ) + 2;
              clstr == 5
                ? cls5h.push(_hotel)
                : clstr == 4
                ? cls4h.push(_hotel)
                : clstr == 3
                ? cls3h.push(_hotel)
                : clstr == 2
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
        // console.log(
        //   `date: ${hotels[0].prices[ix].date}, cls5h: ${cls5h.length}, cls4h: ${cls4h.length}, cls3h: ${cls3h.length}, cls2h: ${cls2h.length}, outliers: ${outliers.length}, noRateHotels: ${noRateHotels.length}`
        // );
      });

      _hotelData.datasets[0].data = datebyhotelcount.map((x) => x.noRateHotels);
      _hotelData.datasets[1].data = datebyhotelcount.map((x) => x.outliers);
      _hotelData.datasets[2].data = datebyhotelcount.map((x) => x.cls2h);
      _hotelData.datasets[3].data = datebyhotelcount.map((x) => x.cls3h);
      _hotelData.datasets[4].data = datebyhotelcount.map((x) => x.cls4h);
      _hotelData.datasets[5].data = datebyhotelcount.map((x) => x.cls5h);

      set_hotelsCountDataset(datebyhotelcount);
      setBind(true);
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
            <h1>Hotels Count</h1>
            {/* <FormControl className={classes.formControl}>
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
            </FormControl> */}
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
            <Bar
              height={400}
              width={100}
              data={_hotelData}
              options={stackedOptions}
            />
          </Box>

          <hr className="my-5"></hr>
          {/* {scatterData2avg.length > 0 && scatterPlot == 2 ? (
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
          )} */}
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

          <Line data={lineData} height={100} />
        </>
      ) : (
        <>Binding Data...</>
      )}
    </div>
  );
};
