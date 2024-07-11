import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ChartStreaming from 'chartjs-plugin-streaming';
import 'chartjs-adapter-luxon';

import { useSelector } from 'react-redux';

const ChartStreamingLine = ({ label = null, sensor = [0, 0, 0] }) => {
  const [chartDet, setChartDet] = useState(null)
  const { themeValues } = useSelector((state) => state.settings);
  const chartContainer = useRef(null);
  const LegendLabels = React.useMemo(() => {
    return {
      font: {
        size: 14,
        family: themeValues.font,
      },
      padding: 20,
      usePointStyle: true,
      boxWidth: 10,
    };
  }, [themeValues]);
  const ChartTooltip = React.useMemo(() => {
    return {
      enabled: true,
      position: 'nearest',
      backgroundColor: themeValues.foreground,
      titleColor: themeValues.primary,
      titleFont: themeValues.font,
      bodyColor: themeValues.body,
      bodyFont: themeValues.font,
      bodySpacing: 10,
      padding: 15,
      borderColor: themeValues.separator,
      borderWidth: 1,
      cornerRadius: parseInt(themeValues.borderRadiusMd, 10),
      displayColors: false,
      intersect: true,
      mode: 'index',
    };
  }, [themeValues]);

  const onRefresh = (chart) => {
    chart.config.data.datasets.forEach((dataset) => {
      dataset.data.push({
        x: new Date(),
        y: 0,
      });
    });
  };

  const data = React.useMemo(() => {
    return {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Sensor 1',
          borderColor: themeValues.primary,
          pointBackgroundColor: themeValues.primary,
          pointBorderColor: themeValues.primary,
          pointHoverBackgroundColor: themeValues.primary,
          pointHoverBorderColor: themeValues.primary,
          borderWidth: 2,
          pointRadius: 2,
          pointBorderWidth: 2,
          pointHoverRadius: 3,
          fill: false,
        },
        {
          label: 'Sensor 2',
          borderColor: themeValues.secondary,
          pointBackgroundColor: themeValues.secondary,
          pointBorderColor: themeValues.secondary,
          pointHoverBackgroundColor: themeValues.secondary,
          pointHoverBorderColor: themeValues.secondary,
          borderWidth: 2,
          pointRadius: 2,
          pointBorderWidth: 2,
          pointHoverRadius: 3,
          fill: false,
        },
        {
          label: 'Sensor 3',
          borderColor: themeValues.quaternary,
          pointBackgroundColor: themeValues.quaternary,
          pointBorderColor: themeValues.quaternary,
          pointHoverBackgroundColor: themeValues.quaternary,
          pointHoverBorderColor: themeValues.quaternary,
          borderWidth: 2,
          pointRadius: 2,
          pointBorderWidth: 2,
          pointHoverRadius: 3,
          fill: false,
        },
      ],
    };
  }, [themeValues]);
  const config = React.useMemo(() => {
    return {
      type: 'line',
      plugins: [ChartDataLabels, ChartStreaming],
      options: {
        layout: {
          padding: 0,
        },
        elements: {
          line: {
            cubicInterpolationMode: 'monotone',
          },
        },
        showLine: true,
        plugins: {
          tooltip: ChartTooltip,
          crosshair: false,
          datalabels: false,
          legend: {
            position: 'bottom',
            labels: LegendLabels,
          },
          streaming: {
            frameRate: 60,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            type: 'linear',
            min: 0,
            max: 100,
            grid: { display: true, lineWidth: 1, color: themeValues.separatorLight, drawBorder: false },
            ticks: { beginAtZero: true, padding: 8, fontColor: themeValues.alternate, stepSize: 25 },
          },
          x: {
            type: 'realtime',
            grid: { display: false },
            ticks: { display: false },
            realtime: {
              duration: 25000,
              ttl: 30000,
              refresh: 1000,
              delay: 2000,
              onRefresh,
              pause: false
            },
          },
        },
      },
      data,
    };
  }, [themeValues, data, ChartTooltip]);

  useEffect(() => {
    let myChart = null;
    if (chartContainer && chartContainer.current) {
      Chart.register(...registerables, ChartStreaming);

      myChart = new Chart(chartContainer.current, config);
    }
    setChartDet(myChart);
    return () => {
      if (myChart) {
        setChartDet(null);
        myChart.destroy();
      }
    };
  }, [config, label]);

  useEffect(() => {
    if (chartDet != undefined && chartDet != null) {
      for (let idx in chartDet.data.datasets) {
        if (chartDet.data.datasets[idx].label === "Sensor 1" || "Sensor 2" || "Sensor 3") {
          chartDet.data.datasets[idx].data.push({
            x: new Date(),
            y: sensor[idx]
          });
        }
      }
    }
  }, [sensor]);

  return <canvas ref={chartContainer} />;
};

export default React.memo(ChartStreamingLine);
