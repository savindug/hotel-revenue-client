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

import Chart from 'chart.js';

import moment from 'moment';
import { CLUSTER_BACKGROUND } from '../utils/const';
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

  const report_len = 90;

  const [dateSelection, setDateSelection] = useState([0, 30]);

  const quard_colors = [
    { color: '#C5CAE9', label: 'More Expensive Lower Rated' },
    { color: '#C8E6C9', label: 'More Expensive Better Rated' },
    { color: '#FFCCBC', label: 'Less Expensive Lower Rated' },
    { color: '#FFF9C4', label: 'Less Expensive Better Rated' },
  ];

  const [wDPlotDataset, setWDPlotDataset] = useState([]);
  const [wEPlotDataset, setWEPlotDataset] = useState([]);

  const [plugins, setPlugins] = useState([
    // {
    //   beforeInit: function (chart, args, options) {
    //     // Make sure we're applying the legend to the right chart

    //     const ul = document.createElement('ul');
    //     quard_colors.map((qclr, i) => {
    //       ul.innerHTML += `
    //           <li>
    //             <span style="background-color: ${quard_colors[i].color}">${quard_colors[i].label}</span>
    //           </li>
    //         `;
    //     });

    //     return document.getElementById('js-legend').appendChild(ul);
    //   },
    // },
    {
      beforeDraw: function (chart, easing) {
        var chartArea = chart.chartArea;
        var ctx = chart.chart.ctx;

        // Replace these IDs if you have given your axes IDs in the config
        var xScale = chart.scales['x-axis-1'];
        var yScale = chart.scales['y-axis-1'];

        var midX = xScale.getPixelForValue(0);
        var midY = yScale.getPixelForValue(0);

        // Top left quadrant
        ctx.fillStyle = '#C5CAE9';
        ctx.fillRect(
          chartArea.left,
          chartArea.top,
          midX - chartArea.left,
          midY - chartArea.top
        );

        // Top right quadrant
        ctx.fillStyle = '#C8E6C9';
        ctx.fillRect(
          midX,
          chartArea.top,
          chartArea.right - midX,
          midY - chartArea.top
        );

        // Bottom right quadrant
        ctx.fillStyle = '#FFF9C4';
        ctx.fillRect(
          midX,
          midY,
          chartArea.right - midX,
          chartArea.bottom - midY
        );

        // Bottom left quadrant
        ctx.fillStyle = '#FFCCBC';
        ctx.fillRect(
          chartArea.left,
          midY,
          midX - chartArea.left,
          chartArea.bottom - midY
        );
      },
    },
  ]);

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
          let wdCluster_arr = [];
          let weCluster_arr = [];
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
                ? '#EF5350'
                : '#757575',
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

        let reqHotelData = hotels.find(
          (o) => getReqHotelData().localeCompare(o.hotelName) == 0
        );

        let reqHotelDataArr = [];

        for (let dt = dateSelection[0]; dt < dateSelection[1]; dt++) {
          if (reqHotelData.prices[dt]) {
            if (
              reqHotelData.prices[dt] != null &&
              reqHotelData.prices[dt] !== undefined
            ) {
              reqHotelDataArr.push(
                reqHotelData.prices[dt].price[
                  getPrice(reqHotelData.prices[dt].price)
                ]
              );
            }
          }
        }

        let _plotData = [];

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
          _plotData.push({
            label: _hotel.hotelName,
            pointRadius:
              getReqHotelData().localeCompare(_hotel.hotelName) == 0 ? 6 : 3,
            pointHoverRadius:
              getReqHotelData().localeCompare(_hotel.hotelName) == 0 ? 6 : 3,
            backgroundColor:
              getReqHotelData().localeCompare(_hotel.hotelName) == 0
                ? '#EF5350'
                : '#757575',
            data: [
              {
                x: (_hotel.frq_rating - reqHotelData.frq_rating).toFixed(2),
                y: rates_arr.median() - reqHotelDataArr.median(),
              },
            ],
          });
        });

        setPlotData(_plotData);
      }
    };

    if (hotels.length > 0 && clusterData.length > 0) {
      buildPlot();
      // getReqHotelData();
      console.log(hotels);
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

        scaterLabels.push(_hotel.hotelName);
        scaterDataset.push({
          label: _hotel.hotelName,
          pointRadius:
            getReqHotelData().localeCompare(_hotel.hotelName) == 0 ? 6 : 3,
          pointHoverRadius:
            getReqHotelData().localeCompare(_hotel.hotelName) == 0 ? 6 : 3,
          backgroundColor:
            getReqHotelData().localeCompare(_hotel.hotelName) == 0
              ? '#EF5350'
              : '#757575',
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

      let reqHotelData = hotels.find(
        (o) => getReqHotelData().localeCompare(o.hotelName) == 0
      );

      let reqHotelDataArr = [];

      for (let dt = dateSelection[0]; dt < dateSelection[1]; dt++) {
        if (reqHotelData.prices[dt]) {
          if (
            reqHotelData.prices[dt] != null &&
            reqHotelData.prices[dt] !== undefined
          ) {
            reqHotelDataArr.push(
              reqHotelData.prices[dt].price[
                getPrice(reqHotelData.prices[dt].price)
              ]
            );
          }
        }
      }

      let _plotData = [];

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
        _plotData.push({
          label: _hotel.hotelName,
          pointRadius:
            getReqHotelData().localeCompare(_hotel.hotelName) == 0 ? 6 : 3,
          pointHoverRadius:
            getReqHotelData().localeCompare(_hotel.hotelName) == 0 ? 6 : 3,
          backgroundColor:
            getReqHotelData().localeCompare(_hotel.hotelName) == 0
              ? '#EF5350'
              : '#757575',
          data: [
            {
              x: (_hotel.frq_rating - reqHotelData.frq_rating).toFixed(2),
              y: rates_arr.median() - reqHotelDataArr.median(),
            },
          ],
        });
      });

      setPlotData(_plotData);
    };

    if (hotels.length > 0 && clusterData.length > 0) {
      handleScatterPlot();
    }
  }, [dateSelection]);

  const getHotelDataByXY = (x, y) => {
    let names = [];
    if (plotDataset.length > 0) {
      plotDataset.map((e) => {
        if (e.data[0].x == x && e.data[0].y == y) {
          names.push(e.label);
        }
      });
    }
    return names;
  };

  const handleDatePage = (e) => {
    setDatePage(e);
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
                  return (
                    data.datasets[tooltipItem.datasetIndex].label +
                    ': (' +
                    tooltipItem.xLabel +
                    ', ' +
                    tooltipItem.yLabel +
                    ')'
                  );
                },
              },
            },
            scales: {
              yAxes: [
                {
                  scaleLabel: {
                    display: true,
                    labelString: 'Median Rate for next 90 days',
                  },
                },
              ],
              xAxes: [
                {
                  scaleLabel: {
                    display: true,
                    labelString: 'Rating Position',
                  },
                },
              ],
            },
          }}
          data={{
            labels: plotLabels,
            datasets: plotDataset,
          }}
          height={'25%'}
          width={'100%'}
        />
      ) : (
        <></>
      )}
      <Grid container justify="space-around" className="my-5">
        <h3>Competitive Quadrant</h3>

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

      {plotData.length > 0 && plotLabels.length > 0 ? (
        <>
          <Grid container justify="space-around" className="my-5">
            <span
              className="p-1 rounded font-weight-bold text-secondary"
              style={{ backgroundColor: quard_colors[0].color }}
            >
              {quard_colors[0].label}
            </span>
            <span
              className="p-1 rounded font-weight-bold text-secondary"
              style={{ backgroundColor: quard_colors[1].color }}
            >
              {quard_colors[1].label}
            </span>
            <span
              className="p-1 rounded font-weight-bold text-secondary"
              style={{ backgroundColor: quard_colors[2].color }}
            >
              {quard_colors[2].label}
            </span>
            <span
              className="p-1 rounded font-weight-bold text-secondary"
              style={{ backgroundColor: quard_colors[3].color }}
            >
              {quard_colors[3].label}
            </span>
          </Grid>
          <Scatter
            options={{
              legend: {
                display: false,
              },
              tooltips: {
                callbacks: {
                  label: function (tooltipItem, data) {
                    return (
                      data.datasets[tooltipItem.datasetIndex].label +
                      ': (' +
                      tooltipItem.xLabel +
                      ', ' +
                      tooltipItem.yLabel +
                      ')'
                    );
                  },
                },
              },
              scales: {
                yAxes: [
                  {
                    gridLines: {
                      zeroLineColor: '#000000',
                    },
                    scaleLabel: {
                      display: true,
                      labelString: 'Difference in Median Rate for next 90 days',
                    },
                  },
                ],
                xAxes: [
                  {
                    gridLines: {
                      zeroLineColor: '#000000',
                    },
                    scaleLabel: {
                      display: true,
                      labelString: 'Difference in Rating Position',
                    },
                  },
                ],
              },
            }}
            plugins={plugins}
            data={{
              labels: plotLabels,
              datasets: plotData,
            }}
            height={'25%'}
            width={'100%'}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
}
