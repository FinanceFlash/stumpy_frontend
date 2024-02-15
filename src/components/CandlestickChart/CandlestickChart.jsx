import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
// import 'chartjs-plugin-zoom';
import zoomPlugin from 'chartjs-plugin-zoom';


Chart.register(zoomPlugin);


const CandlestickChart = ({ stockData, selectedOption }) => {

  let itemsPerPage;

  if(selectedOption === 15) itemsPerPage = 45
  else if (selectedOption === 30) itemsPerPage = 60
  else if (selectedOption === 60) itemsPerPage = 90
  else if (selectedOption === 60) itemsPerPage = 90
  else if (selectedOption === 60) itemsPerPage = 90
  else if (selectedOption === 120) itemsPerPage = 72
  else if (selectedOption === 180) itemsPerPage = 90
  else if (selectedOption === 240) itemsPerPage = 120
  else if (selectedOption === 360) itemsPerPage = 108
  // else if (selectedOption === 375) itemsPerPage = 120

  console.log(itemsPerPage)

  const [currentPage, setCurrentPage] = useState(1);
  

  const totalPages = Math.ceil(stockData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const displayData = stockData.slice(startIndex, endIndex);

  console.log(displayData)

  const handlePrevClick = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextClick = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  useEffect(() => {
    // Create a bar chart using Chart.js
    const ctx = document.getElementById('myChart');

    // Destroy previous chart instance to prevent memory leaks
    const existingChartInstance = Chart.getChart(ctx);
    if (existingChartInstance) {
      existingChartInstance.destroy();
    }

    // Formatting the x-axis values
    const labels = displayData.map((data) => {
      const timeString = data.Time;
      const parsedDate = new Date(`1970-01-01T${timeString}Z`);
      const hour = parsedDate.getUTCHours();
      const minute = parsedDate.getUTCMinutes();

      // Format the hour and minute as a string in HH:mm format
      const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      return formattedTime;
    });
    
    // Using the s drawing the floating bars
    const barValues = displayData.map((data) => data.s); 

    // OHLC values
    const ohlc_data = displayData.map((data) => ({
      open: data.Open,
      close: data.Close,
      high: data.High,
      low: data.Low
    })); 
    
    // Determine borderColor based on close and open values
    const backgroundColor = displayData.map(entry => {
      const color = entry.Close > entry.Open ? 'green' : 'rgba(255, 26, 104, 1)';
      return {
        s: entry.s,
        backgroundColor: color,
      };
    });

    // Determine the stockname for label
    const stockName = displayData.length > 0 ? displayData[0].Stock : null;
    

    const candelstick = {
      id: 'candelstick',
      beforeDatasetsDraw(chart, agrs, pluginOptions) {
        const {ctx, data, chartArea: { top, bottom, left, right, width, height }, scales: {x, y} } = chart;

        // // Set the desired width for the wicks
        ctx.lineWidth = 1;

        // Set global alpha to 1 to ensure full opacity
        // ctx.globalAlpha = 1;

        ohlc_data.forEach((datapoint, index) => {
          const xValue = x.getPixelForValue(data.labels[index]); // X-coordinate of the data point
          // const yOpen = y.getPixelForValue(datapoint.open); // Y-coordinate of the Open value
          // const yClose = y.getPixelForValue(datapoint.close); // Y-coordinate of the Close value
          const yHigh = y.getPixelForValue(datapoint.high); // Y-coordinate of the High value
          const yLow = y.getPixelForValue(datapoint.low); // Y-coordinate of the Low value
    
          // Draw the wicks (lines for High and Low values)
          ctx.beginPath();
          ctx.moveTo(xValue, yHigh);
          ctx.lineTo(xValue, yLow);
          ctx.stroke();
        });        
      }
    };

    const crosshair = {
      id: 'crosshair',
      afterDatasetsDraw(chart, args, pluginOptions) {
        const { ctx, tooltip, chartArea: { top, bottom, left, right }, scales: { x, y } } = chart;
    
        if (tooltip._active && tooltip._active.length) {
          const activePoint = tooltip._active[0];
          const crosshairX = activePoint.element.x;
    
          // Draw vertical crosshair line at tooltip's x position
          ctx.setLineDash([3, 3]);
          ctx.lineWidth = 1;
          ctx.strokeStyle = 'rgba(102, 102, 102, 1)';
          ctx.beginPath();
          ctx.moveTo(crosshairX, top);
          ctx.lineTo(crosshairX, bottom);
          ctx.stroke();
          ctx.closePath();
    
          // Draw horizontal crosshair line originating at the close price
          const closeValue = ohlc_data[activePoint.index]?.close;

          // Convert closeValue to a number
          const numericCloseValue = parseFloat(closeValue);

          if (!isNaN(numericCloseValue)) {
            const yPosition = y.getPixelForValue(closeValue);
    
            ctx.beginPath();
            ctx.moveTo(left, yPosition);
            ctx.lineTo(right, yPosition);
            ctx.stroke();
            ctx.closePath();
    
            // Draw the close price label next to the horizontal line
            const labelX = left - 50;
            const labelY = yPosition - 10;
    
            ctx.fillStyle = 'black';
            ctx.fillRect(labelX, labelY, 50, 20);
            ctx.fillStyle = 'white';
            ctx.font = 'bold 12px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(numericCloseValue.toFixed(2), labelX + 25, labelY + 10);
          }
          ctx.setLineDash([]);
        }
      },
    };
    
    const customTooltip = {
      id: 'customTooltip',
      beforeRender: (chart, args, options) => {
        chart.pluginTooltips = [];
      },
      afterRender: (chart, args, options) => {
        if (!chart.tooltip._active || chart.tooltip._active.length === 0) {
          return;
        }
    
        const activePoint = chart.tooltip._active[0];
        const ctx = chart.ctx;
    
        const ohlcData = ohlc_data[activePoint.index];
    
        // Draw your custom tooltip here using ctx, activePoint, and ohlcData
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
        ctx.lineWidth = 1;
        const tooltipWidth = 100;
        const tooltipHeight = 100;
        const xPosition = activePoint.element.x - tooltipWidth / 2;
        const yPosition = activePoint.element.y - tooltipHeight - 10;
    
        // Draw tooltip background
        ctx.beginPath();
        ctx.rect(xPosition, yPosition, tooltipWidth, tooltipHeight);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    
        // Draw OHLC values
        ctx.fillStyle = 'black';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`Open: ${ohlcData.open}`, xPosition + tooltipWidth / 2, yPosition + 20);
        ctx.fillText(`High: ${ohlcData.high}`, xPosition + tooltipWidth / 2, yPosition + 40);
        ctx.fillText(`Low: ${ohlcData.low}`, xPosition + tooltipWidth / 2, yPosition + 60);
        ctx.fillText(`Close: ${ohlcData.close}`, xPosition + tooltipWidth / 2, yPosition + 80);
      },
    };
    
    const config = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: stockName,
            data: barValues,
            backgroundColor: backgroundColor.map(entry => entry.backgroundColor), 
            borderColor: 'rgba(0, 0, 0, 1)',
            borderWidth: 1,
            borderSkipped: false
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            enabled: false, // Disable the default tooltip
          },
          zoom: {
            pan: {
              enabled: true,
              mode: 'xy', // Enable horizontal + vertical pan
            },
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: 'x', // Enable horizontal zoom only
            },
          },
        },
        animation: {
          duration: 0, // Disable tooltip animation
        },
        scales: {
          y: {
            beginAtZero: false,
          },
        },
      },
      plugins: [candelstick, crosshair, customTooltip]
    };

    // Create a new bar chart
    const newChartInstance = new Chart(ctx, config);

    // Cleanup on component unmount
    return () => {
      newChartInstance.destroy();
    };

  }, [displayData])

  return (
    <div>
      <div>
        <button onClick={handlePrevClick} disabled={currentPage === 1}>
          Prev
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button onClick={handleNextClick} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', border: '1px solid red' }}>
        <div style={{ height: '400px', width: '1000px', paddingTop: '5px', border: '1px solid blue' }}>
          <canvas id="myChart"></canvas>
        </div>
        </div>
    </div>
  );
};

export default CandlestickChart;




