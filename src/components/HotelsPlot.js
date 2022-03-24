import React, { useEffect, useState } from 'react';

import { Chart } from 'react-google-charts';
import { useSelector } from 'react-redux';
import { Scatter } from 'react-chartjs-2';

export function HotelsPlot({ hotels, dateSelection }) {
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
    report_len,
  } = getClusterDataSet;

  const [plotData, setPlotData] = useState([]);

  const [plotLabels, setPlotLabels] = useState([]);

  const [hotelsDataPlot, setHotelsDataPlot] = useState([]);

  const [plotDataset, setPlotDataset] = useState([]);

  const [load, setLoad] = useState(false);

  const [scatterPlot, setScatterPlot] = useState(2);

  const [scatterPlotLabels, setScatterPlotLabels] = useState();

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

  const getFreqBucketMinMaxRatings = (dt, bucket) => {
    // console.log(`dt: ${dt}, bucket: ${bucket}`);
    let min = -1;
    let max = -1;

    if (clusterData[dt][bucket]) {
      if (clusterData[dt][bucket].unwanted.length > 0) {
        let hotelsArr = clusterData[dt][bucket].unwanted;

        min = Math.min.apply(
          null,
          hotelsArr.map((item) => item.raings)
        );
        max = Math.max.apply(
          null,
          hotelsArr.map((item) => item.raings)
        );
      }
    }
    return { min: min, max: max };
  };

  const getPrice = (arr) => {
    const price = arr.findIndex((e) => e > 0);
    return price;
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
        });

        [...Array(report_len).keys()].map((ob, idx) => {
          hotels.map((_hotel) => {
            if (
              _hotel.prices[idx] !== null &&
              _hotel.prices[idx] !== undefined
            ) {
              const FrqBucketMinMax = getFreqBucketMinMaxRatings(
                idx,
                _hotel.freq_bucket - 2
              );

              _hotel.prices[idx].FrqBucketMinMax = FrqBucketMinMax;

              if (FrqBucketMinMax.min > 0 && FrqBucketMinMax.max > 0) {
                _hotel.prices[idx].frq_rating = (
                  Math.abs(_hotel.ratings - _hotel.freq_bucket) /
                    (FrqBucketMinMax.max - FrqBucketMinMax.min) +
                  _hotel.freq_bucket
                ).toFixed(2);
              }
            }
          });
        });

        setHotelsDataPlot(hotels);

        let scaterLabels = [];
        let scaterDataset = [];

        hotels.map((_hotel) => {
          if (_hotel.prices[dateSelection]) {
            if (
              _hotel.prices[dateSelection] != null &&
              _hotel.prices[dateSelection] !== undefined
            ) {
              scaterLabels.push(_hotel.hotelNam);
              scaterDataset.push({
                label: _hotel.hotelName,
                pointRadius:
                  getReqHotelData().localeCompare(_hotel.hotelName) == 0
                    ? 6
                    : 3,
                pointHoverRadius:
                  getReqHotelData().localeCompare(_hotel.hotelName) == 0
                    ? 6
                    : 3,
                backgroundColor: '#2e2e2e',
                data: [
                  {
                    x: _hotel.prices[dateSelection].frq_rating,
                    y: _hotel.prices[dateSelection].price[
                      getPrice(_hotel.prices[dateSelection].price)
                    ],
                  },
                ],
              });
            }
          }
        });

        setPlotDataset(scaterDataset);
        setPlotLabels(scaterLabels);
      }
    };

    if (hotels.length > 0 && clusterData.length > 0) {
      buildPlot();
      getReqHotelData();
    }
  }, []);

  useEffect(() => {
    const handleScatterPlot = () => {
      let scaterLabels = [];
      let scaterDataset = [];

      hotels.map((_hotel) => {
        if (_hotel.prices[dateSelection]) {
          if (
            _hotel.prices[dateSelection] != null &&
            _hotel.prices[dateSelection] !== undefined
          ) {
            scaterLabels.push(_hotel.hotelNam);
            scaterDataset.push({
              label: _hotel.hotelName,
              pointRadius:
                getReqHotelData().localeCompare(_hotel.hotelName) == 0 ? 6 : 3,
              pointHoverRadius:
                getReqHotelData().localeCompare(_hotel.hotelName) == 0 ? 6 : 3,
              backgroundColor: '#2e2e2e',
              data: [
                {
                  x: _hotel.prices[dateSelection].frq_rating,
                  y: _hotel.prices[dateSelection].price[
                    getPrice(_hotel.prices[dateSelection].price)
                  ],
                },
              ],
            });
          }
        }
      });

      setPlotDataset(scaterDataset);
      setPlotLabels(scaterLabels);
    };

    if (hotels.length > 0 && clusterData.length > 0) {
      handleScatterPlot();
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

  return (
    <>
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
      1
    </>
  );
}
