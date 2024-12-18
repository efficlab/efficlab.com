import React, { useMemo, } from 'react'
import dayjs from 'dayjs'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core';
import { LineChart, } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  // DataZoomComponent,
} from 'echarts/components';
import { CanvasRenderer, } from 'echarts/renderers';
import './App.css'
import logo from './logo.png'
import data from './records'

echarts.use(
  [
    TooltipComponent, 
    GridComponent, 
    LineChart, 
    CanvasRenderer, 
    LegendComponent, 
    // DataZoomComponent,
  ]
)

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const valueRecords = Object.values(data)
const labelRecords = Object.keys(data)

const App = () => {
  const total = useMemo(() => {
    return numberWithCommas(
      valueRecords[valueRecords.length - 1]?.reduce((prev, curr) => {
        return prev += curr
      }, 0)
    )
  }, [])

  const latestDate = useMemo(() => {
    return dayjs(labelRecords[labelRecords.length - 1]).format('MMM DD, YYYY')
  }, [])

  const latestValues = useMemo(() => {
    return valueRecords[valueRecords.length - 1]?.map((value, idx) => <span key={idx}>{numberWithCommas(value)}</span>)
  }, [])

  const chartOptions = useMemo(() => {
    const valueCollector = idx =>
      valueRecords.reduce((prev, curr) => {
        prev.push(curr?.[idx])
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
        left: 5,
        right: 5,
        bottom: 0,
        top: 10,
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: labelRecords.map(i => dayjs(i).format('YYYY-MM-DD'))
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
            color: '#010101cf'
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
            color: '#ff2543cf'
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
            color: '#01a2d6cf'
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
            color: '#ff0000cf'
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
      <div className='note'>We aim to be the biggest and most professional online media channel for computer technology on the planet.</div>
      <div className='note'>Please contact <a className='mail' href="mailto: service@efficlab.com">service@efficlab.com</a> for any business cooperation.</div>
      <div className='note'>商业合作，请联系 <a className='mail' href="mailto: service@efficlab.com">service@efficlab.com</a>。</div>
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
              <a rel="noreferrer" href="https://www.youtube.com/@efficlab" target='_blank'>[Link]</a>
              YouTube
            </span>
            <span className='bili'>
              <a rel="noreferrer" href="https://space.bilibili.com/5953240" target='_blank'>[Link]</a>
              Bilibili
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
