import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { Scatter } from 'react-chartjs-2';
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  Select,
} from '@material-ui/core';

import moment from 'moment';
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

export function HotelsPlot({ hotels }) {
  const classes = useStyles();
  const getClusterDataSet = useSelector((state) => state.clusterDataSet);
  const {
    loading,
    err,
    clusterData,
    cluster1,
    cluster2,
    cluster3,
    cluster4,
    reqHotel,
  } = getClusterDataSet;

  const [plotData, setPlotData] = useState([]);

  const [plotLabels, setPlotLabels] = useState([]);

  const [hotelsDataPlot, setHotelsDataPlot] = useState([]);

  const [plotDataset, setPlotDataset] = useState([]);

  const [load, setLoad] = useState(false);

  const [scatterPlot, setScatterPlot] = useState(2);

  const [scatterPlotLabels, setScatterPlotLabels] = useState();

  const report_len = 90;

  const [dateSelection, setDateSelection] = useState([0, 30]);

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
          dateRange_arr.push([
            (i - 1) * 30,
            i * 30 - (totalDays - (report_len - 1)),
          ]);
        }
      }
    }
    return dateRange_arr;
  };

  const [dateRange, setDateRange] = useState(getDateRange());

  const [datePage, setDatePage] = useState(0);

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

  const mode = (arr) => {
    return arr
      .sort(
        (a, b) =>
          arr.filter((v) => v === a).length - arr.filter((v) => v === b).length
      )
      .pop();
  };

  const getFreqBucketMinMaxRatings = (bucket) => {
    // console.log(`dt: ${dt}, bucket: ${bucket}`);
    let min = -1;
    let max = -1;

    let hotelsArr = [];

    if (clusterData.length > 0) {
      [...Array(report_len).keys()].map((ob, dt) => {
        if (clusterData[dt][bucket]) {
          if (clusterData[dt][bucket].unwanted.length > 0) {
            hotelsArr = [...hotelsArr, ...clusterData[dt][bucket].unwanted];
          }
        }
      });
    }
    // console.log(`hotelsArr.length = ${hotelsArr.length}`);
    min = Math.min.apply(
      null,
      hotelsArr.map((item) => item.raings)
    );
    max = Math.max.apply(
      null,
      hotelsArr.map((item) => item.raings)
    );
    return { min: min, max: max };
  };

  const getPrice = (arr) => {
    const price = arr.findIndex((e) => e > 0);
    return price;
  };

  Array.prototype.median = function () {
    return this.slice().sort((a, b) => a - b)[Math.floor(this.length / 2)];
  };

  const getReqHotelData = () => {
    let name = null;
    if (reqHotel.length > 0) {
      reqHotel.map((e, index) => {
        if (e.name !== null) {
          name = e.name;
        }
      });
    }

    return name;
  };

  useEffect(() => {
    const buildPlot = () => {
      if (hotels.length > 0) {
        // let hotelRatesSet = hotels.slice();

        hotels.map((_hotel) => {
          let cluster_arr = [];
          _hotel.prices.map((dt, ix) => {
            if (dt !== null) {
              cluster_arr.push(
                getClusterByPrice(dt.price[getPrice(dt.price)], ix) + 2
              );
            }
          });
          _hotel.freq_bucket = mode(cluster_arr);
          const FrqBucketMinMax = getFreqBucketMinMaxRatings(
            _hotel.freq_bucket - 2
          );

          _hotel.FrqBucketMinMax = FrqBucketMinMax;
          if (FrqBucketMinMax.min > 0 && FrqBucketMinMax.max > 0) {
            _hotel.frq_rating = (
              Math.abs(_hotel.ratings - _hotel.freq_bucket) /
                (FrqBucketMinMax.max - FrqBucketMinMax.min) +
              _hotel.freq_bucket
            ).toFixed(2);
          }
        });

        setHotelsDataPlot(hotels);

        let scaterLabels = [];
        let scaterDataset = [];

        hotels.map((_hotel) => {
          let rates_arr = [];
          for (let dt = dateSelection[0]; dt < dateSelection[1]; dt++) {
            if (_hotel.prices[dt]) {
              if (
                _hotel.prices[dt] != null &&
                _hotel.prices[dt] !== undefined
              ) {
                rates_arr.push(
                  _hotel.prices[dt].price[getPrice(_hotel.prices[dt].price)]
                );
              }
            }
          }

          scaterLabels.push(_hotel.hotelNam);
          scaterDataset.push({
            label: _hotel.hotelName,
            pointRadius:
              getReqHotelData().localeCompare(_hotel.hotelName) == 0 ? 6 : 3,
            pointHoverRadius:
              getReqHotelData().localeCompare(_hotel.hotelName) == 0 ? 6 : 3,
            backgroundColor:
              getReqHotelData().localeCompare(_hotel.hotelName) == 0
                ? '#516B8F'
                : '#2e2e2e',
            data: [
              {
                x: _hotel.frq_rating,
                y: rates_arr.median(),
              },
            ],
          });
        });

        setPlotDataset(scaterDataset);
        setPlotLabels(scaterLabels);
      }
    };

    if (hotels.length > 0 && clusterData.length > 0) {
      buildPlot();
      getReqHotelData();
      // console.log(hotels);
    }
  }, []);

  useEffect(() => {
    const handleScatterPlot = () => {
      let scaterLabels = [];
      let scaterDataset = [];

      hotels.map((_hotel) => {
        let rates_arr = [];
        for (let dt = dateSelection[0]; dt < dateSelection[1]; dt++) {
          if (_hotel.prices[dt]) {
            if (_hotel.prices[dt] != null && _hotel.prices[dt] !== undefined) {
              rates_arr.push(
                _hotel.prices[dt].price[getPrice(_hotel.prices[dt].price)]
              );
            }
          }
        }

        // _hotel[`datePage-${datePage}`] = rates_arr;

        scaterLabels.push(_hotel.hotelNam);
        scaterDataset.push({
          label: _hotel.hotelName,
          pointRadius:
            getReqHotelData().localeCompare(_hotel.hotelName) == 0 ? 6 : 3,
          pointHoverRadius:
            getReqHotelData().localeCompare(_hotel.hotelName) == 0 ? 6 : 3,
          backgroundColor:
            getReqHotelData().localeCompare(_hotel.hotelName) == 0
              ? '#516B8F'
              : '#2e2e2e',
          data: [
            {
              x: _hotel.frq_rating,
              y: rates_arr.median(),
            },
          ],
        });
      });

      setPlotDataset(scaterDataset);
      setPlotLabels(scaterLabels);
    };

    if (hotels.length > 0 && clusterData.length > 0) {
      handleScatterPlot();
      // console.log(hotels);
    }
  }, [dateSelection]);

  const getHotelDataByXY = (x, y) => {
    let name = '';
    if (plotDataset.length > 0) {
      plotDataset.map((e) => {
        if (e.data[0].x == x && e.data[0].y == y) {
          name = e.label;
          return;
        }
      });
    }
    return name;
  };

  const handleDatePage = (e) => {
    setDatePage(e);
    // console.log(
    //   'datePage = ' + datePage + 'dateRange = ' + dateRange[datePage][0],
    //   dateRange[datePage][1]
    // );
    setDateSelection([dateRange[e][0], dateRange[e][1]]);
  };

  return (
    <>
      <Grid container justify="space-around" className="my-5">
        <h3>Value Position</h3>

        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="grouped-native-select">Select Date</InputLabel>
          <Select
            native={true}
            onChange={(e) => handleDatePage(e.target.value)}
            id="grouped-native-select"
            value={datePage}
          >
            {dateRange.length > 0 ? (
              dateRange.map((e, i) => (
                <option value={i}>
                  {clusterData[e[0]]
                    ? moment(clusterData[e[0]][0].date).format('MM/DD')
                    : ''}{' '}
                  -{' '}
                  {clusterData[e[1]]
                    ? moment(clusterData[e[1]][0].date).format('MM/DD')
                    : ''}
                </option>
              ))
            ) : (
              <></>
            )}
          </Select>
        </FormControl>
      </Grid>
      {plotDataset.length > 0 && plotLabels.length > 0 ? (
        <Scatter
          options={{
            legend: {
              display: false,
            },
            tooltips: {
              callbacks: {
                label: function (tooltipItem, data) {
                  var label = getHotelDataByXY(
                    tooltipItem.xLabel,
                    tooltipItem.yLabel
                  );
                  return (
                    label +
                    ': (' +
                    tooltipItem.xLabel +
                    ', ' +
                    tooltipItem.yLabel +
                    ')'
                  );
                },
              },
            },
          }}
          data={{
            labels: plotLabels,
            datasets: plotDataset,
          }}
          height={25}
          width={100}
        />
      ) : (
        <></>
      )}
    </>
  );
}
