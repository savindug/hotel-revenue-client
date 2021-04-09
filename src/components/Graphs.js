import { Box } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useSelector } from 'react-redux';

export const Graphs = () => {
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
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        //stack: 1,
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        data: cluster1.map((a) => a.max),
      },

      {
        label: 'Stars 3',
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        //stack: 1,
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        data: cluster2.map((a) => a.max),
      },
      {
        label: 'Stars 4',
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        //stack: 1,
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        data: cluster3.map((a) => a.max),
      },
      {
        label: 'Stars 5',
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        // stack: 1,
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        data: cluster4.map((a) => a.max),
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

  // useEffect(() => {
  //   const bindData = async () => {
  //     await cluster1.map((x, i) => {
  //       chartData.datasets[0].data.push(x.max);
  //     });
  //     await cluster2.map((x, i) => {
  //       chartData.datasets[1].data.push(x.max);
  //     });
  //     await cluster3.map((x, i) => {
  //       chartData.datasets[2].data.push(x.max);
  //     });
  //     await cluster4.map((x, i) => {
  //       chartData.datasets[3].data.push(x.max);
  //     });
  //   };

  //   bindData().then(setBind(true));
  // }, []);
  return (
    <Box>
      {bind ? (
        <>
          {/* {chartData.datasets.map((x) => {
            console.log(x.data);
          })} */}
          <Bar height={400} width={600} data={chartData} options={options} />
        </>
      ) : (
        <>Binding Data...</>
      )}
    </Box>
  );
};
