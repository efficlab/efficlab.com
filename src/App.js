import React, { useMemo, } from 'react'
import dayjs from 'dayjs'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core';
import { LineChart, } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
} from 'echarts/components';
import { CanvasRenderer, } from 'echarts/renderers';
import './App.css'
import logo from './logo.png'

echarts.use(
  [TooltipComponent, GridComponent, LineChart, CanvasRenderer]
)

const data = [
  {
    date: '2024-10-08',
    values: [1820, 24134, 1885, 4644],  // YT, B, RED, DOUYIN.
  }, 
  {
    date: '2024-10-15',
    values: [2718, 24472, 1909, 4680],  // YT, B, RED, DOUYIN.
  }, 
  {
    date: '2024-10-22',
    values: [3182, 24791, 1926, 4710],  // YT, B, RED, DOUYIN.
  }, 
]

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const App = () => {
  const total = useMemo(() => {
    return numberWithCommas(
      data[data.length - 1]?.values?.reduce((prev, curr) => {
        return prev += curr
      }, 0)
    )
  }, [])

  const latestDate = useMemo(() => {
    return dayjs(data[data.length - 1]?.date).format('MMM DD, YYYY')
  }, [])

  const latestValues = useMemo(() => {
    return data[data.length - 1]?.values?.map(value => <span>{numberWithCommas(value)}</span>)
  }, [])

  const chartOptions = useMemo(() => {
    const valueCollector = idx => 
      data.reduce((prev, curr) => {
        prev.push(curr?.values?.[idx])
        return prev
      }, [])

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        show: false,
      },
      grid: {
        left: 20,
        right: 20,
        bottom: 0,
        top: 20,
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: data.map(i => dayjs(i?.date).format('MMM DD'))
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Douyin',
          type: 'line',
          stack: 'Total',
          itemStyle: {
            // color: '#010101cf'
          },
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: valueCollector(3)
        },
        {
          name: 'RED',
          type: 'line',
          stack: 'Total',
          itemStyle: {
            // color: '#ff2543cf'
          },
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: valueCollector(2)
        },
        {
          name: 'Bilibili',
          type: 'line',
          stack: 'Total',
          itemStyle: {
            // color: '#01a2d6cf'
          },
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: valueCollector(1)
        },
        {
          name: 'YouTube',
          type: 'line',
          stack: 'Total',
          itemStyle: {
            // color: '#ff0000cf'
          },
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: valueCollector(0)
        },
      ]
    }
  }, [])

  return (
    <div className="app">
      <img className='title' src={logo} alt="EfficLab logo" />
      <div className='note'>We aim to be the biggest and the most professional Chinese channel of computer technology.</div>
      <div className='note'>Please contact <a className='mail' href= "mailto: service@efficlab.com">service@efficlab.com</a> for any business cooperation.</div>
      <div className='data'>
        <div className='note'>Followers as of {latestDate}</div>
        <div className='chart'>
          <ReactEChartsCore
            echarts={echarts}
            option={chartOptions}
            notMerge={true}
            lazyUpdate={true}
            style={{
              height: 250,
              width: 400,
            }}
          />
        </div>
        <div className='container'>
          <hr className='separator' />
          <div className='labels'>
            <span className='yt'>
              <a rel="noreferrer" href="https://www.youtube.com/@efficlab" target='_blank'>YouTube</a>
            </span>
            <span className='bili'>
              <a rel="noreferrer" href="https://space.bilibili.com/5953240" target='_blank'>Bilibili</a>
            </span>
            <span className='red'>
              RED
            </span>
            <span className='douyin'>
              Douyin
            </span>
            <span>TOTAL</span>
          </div>
          <div className='values'>
            {latestValues}
            <span>{total}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
