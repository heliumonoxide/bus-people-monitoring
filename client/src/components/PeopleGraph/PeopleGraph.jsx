/* eslint-disable no-unused-vars */
// src/components/LineChart.jsx
import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

const LineChart = () => {
  const [chartData, setChartData] = useState({
    series: [{ name: 'People Count', data: [] }],
    options: {
      colors: ['#1e3a8a'],
      chart: {
        height: 200,
        type: 'line',
        zoom: { enabled: true },
        offsetY: -20,
      },
      dataLabels: { enabled: false },
      stroke: {
        curve: 'smooth',
        colors: '#1e3a8a'
      },
      markers: {
        colors: "#1e3a8a"
      },
      xaxis: {
        categories: [], // This will hold the timeAdded values
        type: 'datetime', // Set the type to datetime
      },
      title: {
        text: 'People Count',
        align: 'left',
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#1e3a8a'
        },
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // Takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      tooltip: {
        enabled: true,
        shared: true, // Allows displaying multiple series data
        intersect: false, // Show tooltip even if not hovering directly over a point
        x: {
          show: true,
          format: 'dd MMM yyyy HH:mm:ss',
        },
        y: {
          show: true,
          formatter: function (val) {
            return `${val} people(s)`
          }
        },
        markers: {
          show: true,
          colors: '#1e3a8a'
        }
      },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://webapi-bus-monitoring.vercel.app/api/result');
        const data = await response.json();

        // Ensure we have an array
        const results = Array.isArray(data) ? data : [];

        // Extract sums and format timeAdded
        const sums = results.map(doc => doc.sum); // Extract the sum field
        const timeAdded = results.map(doc => {
          const utcDate = new Date(doc.timeAdded._seconds * 1000); // Create a date object
          const localDate = new Date(utcDate.setHours(utcDate.getHours() + 7)); // Adjust to UTC+7
          return localDate.toISOString(); // Convert back to ISO string for chart
        });

        // Update chart data
        setChartData(prevState => ({
          ...prevState,
          series: [{ ...prevState.series[0], data: sums }],
          options: {
            ...prevState.options,
            xaxis: { categories: timeAdded }, // Set the x-axis categories
          },
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="chart-container">
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="line"
        height={200}
      />
    </div>
  );
};

export default LineChart;