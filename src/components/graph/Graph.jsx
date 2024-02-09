'use client'
import React, { useState } from 'react'
import Chart from "react-apexcharts";

const Graph = ({type, data, colors, categories}) => {
    const [chartData, setChartData] = useState({
        options: {
          chart: {
            id: 'basic-bar',
          },
          xaxis: {
            categories: categories,
          },
          dataLabels:{
            enabled: false,
          } ,
          fill: {
            colors: [ colors]
          },
          chart: {
            stacked: true
        },
        grid: {
            show: false,
            // row: {
            //     colors: ["#f3d3ae", 'transparent'],
            //     opacity: 0.5
            // },
            // column: {
            //     colors: ["#f3d3ae", 'transparent'],
            //     opacity: 0.5
            // }, 
          },  
            yaxis: {
                show : false,
                },
            xaxis: {
                show: false,
                labels: {
                  show: false
                },
                axisBorder: {
                  show: true
                },
                axisTicks: {
                  show: false
                }
              },
    },
        series: [
          {
            name: 'series-1',
            data: data
          }
        ]
      });
  return (
    <div classNames="w-full w-[350px] 2xl:max-w-[350px]" >
            <Chart
              options={chartData.options}
              series={chartData.series}
              type={type}
              width="100%"

            />

    </div>
  )
}

export default Graph