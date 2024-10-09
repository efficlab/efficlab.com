import { useEffect, useMemo, useRef, } from 'react'
import dayjs from 'dayjs'
import { createChart } from 'lightweight-charts'
import './App.css'
import logo from './logo.png'

const data = [
  {
    date: '2024-10-08',
    values: [1820, 24134, 1885, 4644],  // YT, B, RED, DOUYIN.
  }, 
]

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const App = () => {
  const chartDOM = useRef(null)
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

  useEffect(() => { 
    const chart = createChart(chartDOM.current, { 
      width: 400, 
      height: 200,
    })
    const areaSeries = chart.addAreaSeries({ 
      lineColor: '#2962FF', 
      topColor: '#2962FF', 
      bottomColor: 'rgba(41, 98, 255, 0.28)',
    })
    const chartData = data.map(d => {
      return {
        time: d?.date,
        value: d?.values?.reduce((prev, curr) => prev += curr, 0)
      }
    })
    areaSeries.setData(chartData)
    chart.timeScale().fitContent()
  }, [])

  return (
    <div className="app">
      <img className='title' src={logo} alt="EfficLab logo" />
      <div className='note'>We aim to be the biggest and the most professional Chinese channel of computer technology.</div>
      <div className='note'>Please contact <a className='mail' href= "mailto: service@efficlab.com">service@efficlab.com</a> for any business cooperation.</div>
      <div className='data'>
        <div className='note'>Followers as of {latestDate}</div>
        <div className='chart' ref={chartDOM}></div>
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
            <span>Total</span>
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
