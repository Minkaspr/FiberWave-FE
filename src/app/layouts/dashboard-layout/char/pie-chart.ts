import ApexCharts from 'apexcharts';

export class PieChartComponent {
  constructor() {
    const options: ApexCharts.ApexOptions = this.getChartOptions(); 

    if (document.getElementById("pie-chart") && typeof ApexCharts !== 'undefined') {
      const chart = new ApexCharts(document.getElementById("pie-chart"), options);
      chart.render();
    }
  }

  private getChartOptions(): ApexCharts.ApexOptions { 
    return {
      series: [52.8, 26.8, 20.4],
      colors: ["#1C64F2", "#16BDCA", "#9061F9"],
      chart: {
        height: "100%",
        width: "100%",
        type: "pie",
      },
      stroke: {
        colors: ["white"],
        lineCap: "round",
      },
      labels: ["Direct", "Organic search", "Referrals"],
      dataLabels: {
        enabled: true,
        style: {
          fontFamily: "Inter, sans-serif",
        },
      },
      legend: {
        position: "bottom",
        fontFamily: "Inter, sans-serif",
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return value + "%"
          },
        },
      },
      xaxis: {
        labels: {
          formatter: function (value) {
            return value + "%"
          },
        },
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
    };
  }
}
