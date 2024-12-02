import React from "react"
import { Chart as ChartJS } from 'chart.js/auto'
import { Line } from "react-chartjs-2"

const LineChart = props => {

  var graphLabels = [];
  var graphValues = [];
  var graphValues2 = [];

  function setupChartData(labels, graphData, graphData2) {
    console.log(graphData)
    var datasets = [
      {
        label: props.chartTitle,
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointStyle: 'false',
        // pointBorderColor: "rgba(75,192,192,1)",
        // pointBackgroundColor: "#fff",
        // pointBorderWidth: 1,
        // pointHoverRadius: 5,
        // pointHoverBackgroundColor: "rgba(75,192,192,1)",
        // pointHoverBorderColor: "rgba(220,220,220,1)",
        // pointHoverBorderWidth: 2,
        pointRadius: 0,
        // pointHitRadius: 10,
        data: graphData,
        options: {
          scales: {
              y: {
                  suggestedMin: 100000,
                  suggestedMax: 30000,
              }
          }
        }
      },
    ]
    console.log(graphData2)
    if (graphData2) {
      console.log("Got second graph!")
      console.log(graphData2)
      datasets.push({
        label: props.secondChartTitle, // Label for the second line
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(255,99,132,0.4)", // Different color for the second line
        borderColor: "rgba(255,99,132,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointStyle: 'false',
        // pointBorderColor: "rgba(255,99,132,1)",
        // pointBackgroundColor: "#fff",
        // pointBorderWidth: 1,
        // pointHoverRadius: 5,
        // pointHoverBackgroundColor: "rgba(255,99,132,1)",
        // pointHoverBorderColor: "rgba(220,220,220,1)",
        // pointHoverBorderWidth: 2,
        pointRadius: 0,
        // pointHitRadius: 10,
        data: graphData2,
        options: {
          scales: {
              y: {
                  min: 100000,
                  max: 30000,
              }
          }
        }
        });
    }

    return {
      labels: labels,
      datasets: datasets
    };
  }
  
  function extractChartLabels(currentValue, includeYear="false") {
    var d = new Date(currentValue.x*1000)
    if (includeYear == "true") {
      return ['Jan','Feb','Mar','Arp','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()] + " '" + d.getFullYear().toString().slice(-2)
    }
    else {
      return ['Jan','Feb','Mar','Arp','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()] + " " + d.getDate()
    }
  }

  function extractChartValues(currentValue) {
    return props.valueScale ? currentValue.y / props.valueScale : currentValue.y
  }

  graphLabels = props.chartDataAndLabels.map(data => extractChartLabels(data, props.includeYear))
  graphValues = props.chartDataAndLabels.map(extractChartValues)
  graphValues2 = props.secondChartDataAndLabels ? props.secondChartDataAndLabels.map(extractChartValues) : null;
  // graphValues2 = props.secondChartDataAndLabels.map(extractChartValues)
  console.log("refreshing line chart! ")
  console.log(graphValues)
  console.log(props.chartDataAndLabels)
  console.log(props.secondChartDataAndLabels)

  return (
    <div>
      <Line data={setupChartData(graphLabels,graphValues, props.secondChartDataAndLabels)} />
    </div>
  )
}
export default LineChart
