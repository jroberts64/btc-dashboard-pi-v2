import React, { useState, useEffect } from "react"
import { MDBRow, MDBCol } from "mdbreact"
import LineChart from "../../components/lineChart.js"
import Card, { CardLong } from "./cards.js"
import getDateTime from "../../lib/dateTime.js"
import MyClock from "../../components/clock.js"
import "@fortawesome/fontawesome-free/css/all.min.css"
import "bootstrap-css-only/css/bootstrap.min.css"
import "mdbreact/dist/css/mdb.css"
import { getPowerLawData } from "../../lib/dateTime.js"


const Dashboard = () => {
  const [price, setPrice] = useState(0)
  const [blocksToNextHalving, setBlocksToNextHalving] = useState(0)
  const [timer, setTimer] = useState(0)
  const [priceData, setPriceData] = useState([])
  const [volumeData, setVolumeData] = useState([])
  const [powerLawData, setPowerLawData] = useState([])
  const { log10, pow } = Math
  const today = new Date();

  const daysBetween = (date1, date2) => {
    const oneDay = 24 * 60 * 60 * 1000; // Hours * minutes * seconds * milliseconds
    return Math.round((date2 - date1) / oneDay);
  }

  const getPerfcentOfPowerLawStr = () => {
    // getPerfcentOfPowerLawStr()*100).toLocaleString(undefined, { maximumFractionDigits: 0 }) + '%'
    if (price > getPowerLawPrice()) {
      return '+' + (((price - getPowerLawPrice()) / getPowerLawPrice()) * 100).toLocaleString(undefined, { maximumFractionDigits: 0 }) + '%'
    } else {
      return '-' + (((getPowerLawPrice() - price) / getPowerLawPrice()) * 100).toLocaleString(undefined, { maximumFractionDigits: 0 }) + '%'
    }
  }

  const getPowerLawPrice = (date=today, m=5.8, y=-17) => {
    const referenceDate = new Date(2009, 0, 3); // Months are zero-indexed in JS
    const daysDiff = daysBetween(referenceDate, date);
    const logValue = log10(daysDiff);

    const result = pow(10, logValue * m + y);
    return result;
  }

  function convertBlocksToMinutes(blocks) {
    // blocks take 10 minutes to mine on average
    return blocks * 10
  }

  function estimatedDayOfNextHalving(blockHeight) {
    return new Date(today.getTime() + convertBlocksToMinutes(blockHeight)*60000)
  }
  
  function timeToHalving(blockHeight) {
    // return convertTimestamp(today)
    const totalMinutesToHalving = Number(blockHeight+1) * 10 // mine 10 minutes per block
    const minutesInADay = 24 * 60
    const daysToHalving = Math.floor(totalMinutesToHalving / minutesInADay)
    const hoursToHalving = Math.floor(
      (totalMinutesToHalving - daysToHalving * minutesInADay) / 60
    )
    const minutesToHalving = totalMinutesToHalving - daysToHalving
      * minutesInADay - hoursToHalving * 60
    return (
      Math.floor(daysToHalving / 365) + " yrs "
      + daysToHalving % 365 + " days "
      + hoursToHalving + " hrs "
      + minutesToHalving + " mins"
    )
  }

  function fmtNumber(num, decimals = 0) {
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: decimals,
      minimumFractionDigits: decimals
    })
        .format(num)
  }

  function fmtCurrency(num, decimals = 0) {
    return "$" + new Intl.NumberFormat("en-US", 
      { maximumFractionDigits: decimals,
        minimumFractionDigits: decimals
       })
      .format(num)
  }

  function loadData() {
    console.log("Loading data @ " + getDateTime())
    if (typeof window !== `undefined`) {
      fetch("https://blockchain.info/ticker", {cache: "no-cache"})
        .then(res => res.json())
        .then(json => {
          setPrice(json.USD.last)
        })
        .catch(err => {
          console.log(err)
        })
      fetch("https://blockchain.info/q/getblockcount", {cache: "no-cache"})
        .then(res => res.json())
        .then(json => {
          setBlocksToNextHalving(210000 - (json % 210000))
        })
        .catch(err => {
          console.log(err)
        })        
    }
  }

  function extendGraphData(values, days) {
    const extendedValues = [...values];
    const lastItem = values[values.length - 1];

    let lastX = lastItem.x;
    for (let i = 0; i < days; i++) {
        lastX += 86400; // Increment by one day in seconds
        extendedValues.push({ x: lastX, y: null });
    } 
    return extendedValues;
  }

  // CHART FUNCTIONS
  function loadChartDataFromUrl(url, func, extendFlag) {
    var extended_values
    if (typeof window !== `undefined`) {
      fetch( url, {cache: "no-cache"})
        .then(res => res.json())
        .then(json => {
          console.log(json.values)
          if (extendFlag) {
            extended_values = extendGraphData(json.values, 180)
          } else {
            extended_values = json.values
          }
          func(extended_values)
        })
        .catch(err => {
          console.log(err)   
        })
    }
  }

  function loadPowerLawData(){
    const resultArray = Array.from({ length: 720 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - 179 + index);
      const result = getPowerLawData(date)
      return result
    });
    console.log(resultArray)
    setPowerLawData(resultArray);
  }

  useEffect( () => {
      console.log("USEEFFECT CALLED")
      console.log(powerLawData)
      if (typeof window !== `undefined`) {
        const id = window.setTimeout(() => {
          loadPowerLawData();
          loadChartDataFromUrl(
            "https://api.blockchain.info/charts/market-price?timespan=180days&format=json&cors=true",
            setPriceData, true);
          loadChartDataFromUrl(
            "https://api.blockchain.info/charts/trade-volume?timespan=180days&format=json&cors=true",
            setVolumeData, false);
          loadData();
          timer ? setTimer(-timer) : setTimer(300000) 
        }, Math.abs(timer));
          return () => {
          window.clearTimeout(id);
        };
      }
    },[timer]
  );

  return (
    <div>
      <MDBRow className="mb-4">
        <CardLong desc="Last Updated" value={getDateTime()} />
        <CardLong
          desc={"NEXT HALVING: " 
            + getDateTime(estimatedDayOfNextHalving(blocksToNextHalving))
            + " In..."}
          value={timeToHalving(blocksToNextHalving)}
        />
      </MDBRow>
      <MDBRow className="mb-4">
        <Card
          desc="BTC Price USD"
          value={fmtCurrency(price,0)}
          icon="money-bill-wave"
          class="green accent-5"
        />
        <Card
          desc="Percent of Power Law"
          value={getPerfcentOfPowerLawStr()}
          icon="fill-drip"
          class="yellow accent-5"
        />
        <Card
          desc="Power Law Price"
          value={fmtCurrency(getPowerLawPrice(),0)}
          // value={fmtCurrency(getStock2FlowPrice(getStock2Flow(height)),2)}
          icon="money-bill"
          class="red accent-5"
        />
        <Card
          desc="Blocks to Next Halving"
          value={fmtNumber(blocksToNextHalving)}
          icon="hourglass-half"
          class="blue accent-5"
        />
      </MDBRow>
      <MDBRow className="mb-4" style={{ marginTop: "-10px" }}>
        <MDBCol xl="6" md="6" className="mb-r">
          <LineChart 
            chartTitle="Bitcoin Price"
            secondChartTitle="Power Law Price"
            chartDataAndLabels={priceData}
            secondChartDataAndLabels={powerLawData}
            includeYear="true"
            />
        </MDBCol>
        <MDBCol xl="6" md="6" className="mb-r">
          <LineChart 
            chartTitle="Exchange Volume ($M)"
            chartDataAndLabels={volumeData}
            valueScale="1000000"
            includeYear="false"
          />
        </MDBCol>
      </MDBRow>
      <MDBRow style={{ marginTop: "-10px", fontSize: "75%", textAlign: "right"}}>
        <MDBCol className="mb-r">
            <MyClock />
        </MDBCol>
      </MDBRow>
    </div>
  )
}

export default Dashboard
