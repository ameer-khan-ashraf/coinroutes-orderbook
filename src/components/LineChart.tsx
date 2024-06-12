import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
  } from 'chart.js';
import { Line } from 'react-chartjs-2';
import useOrderBookStore from '../hooks/orderBookStore';
import {  useMemo } from 'react';
import LoadingSpinner from './LoadingSpinner/LoadingSpinner';



ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale
  );

  const options = {
    responsive:true,
    animation:false as false|object,
    tooltips: {
      mode: 'index', // Display one tooltip per data point
      intersect: false, // Display tooltip even when not intersecting a point
      callbacks: {
        label: (context:any) => {
          const { label, formattedValue } = context.dataset[context.dataIndex];
          return `${label}: ${formattedValue}`;
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time',
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
        },
        grid: {
          display: true,
          drawOnChartArea: true,
          drawTicks: true,
          color:'#334155'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Price',
        },
        grid: {
          display: true,
          drawOnChartArea: true,
          drawTicks: true,
          color:'#334155'
        }
      },
    },
  };

const LineChart = () => {
    const {tickerData,isLoading} = useOrderBookStore()
    const labels = useMemo(()=>{
      return tickerData.map((data) => {
        const timestamp = new Date(data.time);
        return timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      });
    },[tickerData]) 
    
    const data = {
        labels: labels,
        datasets: [
          {
            label: 'Bids',
            data: tickerData.map((data) => parseFloat(data.best_bid)),
            borderColor: 'green',
            backgroundColor: 'rgba(0, 0, 255, 0.1)',
            pointStyle: 'circle',
            pointRadius: 2,
          },
          {
            label: 'Asks',
            data: tickerData.map((data) => parseFloat(data.best_ask)),
            borderColor: 'red',
            backgroundColor: 'rgba(255, 165, 0, 0.1)',
            pointStyle: 'rectRot',
            pointRadius: 3,
          },
        ],
      };
      
  return (
    <div className='flex flex-1'>
      {isLoading?
        <div className='flex-1 h-[700px]'>
          <LoadingSpinner/>
        </div>
        :
        <Line options={options} data={data}>LineChart</Line>
      }
    </div>
  )
}

export default LineChart