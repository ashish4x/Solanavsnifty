"use client";

import { useState, useEffect } from "react";
import { Slider } from "@nextui-org/react";
import solData from "../data/sol.json";
import niftyData from "../data/nifty.json";
import { LineChart } from "@mui/x-charts/LineChart";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

solData.reverse();
niftyData.reverse();

function Input() {
  const [monthsValue, setMonthsValue] = useState<number>(1);
  const [sipAmount, setSipAmount] = useState<number>(1000);
  const [initialInvestment, setInitialInvestment] = useState<number>(1000);
  const [solReturns, setSolReturns] = useState<number>(0);
  const [niftyReturns, setNiftyReturns] = useState<number>(0);
  const [solChartData, setSolChartData] = useState<number[]>([]);
  const [niftyChartData, setNiftyChartData] = useState<number[]>([]);
  const [xLabels, setXLabels] = useState<string[]>([]);

  useEffect(() => {
    const loadJsonData = async () => {
      const solTotalReturns = calculateTotalReturns(
        solData,
        monthsValue,
        sipAmount
      );
      const niftyTotalReturns = calculateTotalReturns(
        niftyData,
        monthsValue,
        sipAmount
      );

      const truncatedSol = Number(solTotalReturns.toFixed(2));
      const truncatedNifty = Number(niftyTotalReturns.toFixed(2));

      setSolReturns(truncatedSol);
      setNiftyReturns(truncatedNifty);

      const solChart = calculateChartData(solData, monthsValue, sipAmount);
      const niftyChart = calculateChartData(niftyData, monthsValue, sipAmount);
      console.log(solChart);
      setSolChartData(solChart);
      setNiftyChartData(niftyChart);
      setXLabels(
        Array.from({ length: monthsValue }, (_, i) => `Month ${i + 1}`)
      );
    };

    loadJsonData();
  }, [sipAmount, monthsValue]);

  const calculateTotalReturns = (data: any[], n: number, sipAmount: number) => {
    const slicedData = data.slice(0, n);
    const totalReturns = slicedData.reduce((totalUnits, item) => {
      return totalUnits + sipAmount / item.Price;
    }, 0);

    return totalReturns;
  };

  const calculateChartData = (
    data: any[],
    months: number,
    sipAmount: number
  ) => {
    const chartData = [];
    let totalUnits = 0;
    let cumulativeValue = 0;

    for (let i = 0; i < months; i++) {
      totalUnits += sipAmount / data[i].Price;
      cumulativeValue = totalUnits * data[i].Price;
      chartData.push(cumulativeValue);
    }

    return chartData;
  };

  // Handle changes in SIP amount
  const handleInvestmentChange = (value: number | number[]) => {
    if (typeof value === "number") {
      setSipAmount(value);
      setInitialInvestment(value * monthsValue);
    }
  };

  const handleMonthsChange = (value: number | number[]) => {
    if (typeof value === "number") {
      setMonthsValue(value);
      setInitialInvestment(sipAmount * value);
    }
  };

  const getColorForMonths = () => {
    if (monthsValue < 12) {
      return "warning";
    } else if (monthsValue >= 12 && monthsValue <= 24) {
      return "foreground";
    } else {
      return "success";
    }
  };

  return (
    <div className="w-full rounded-md flex flex-col items-center justify-center relative overflow-hidden md:py-0">
      <div className="relative z-10 w-full text-center">
        <h1 className="mt-8 pt-20 md:mt-0 text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
          Did You Outperform SOL?
        </h1>
        <p className="mt-4 font-normal text-base md:text-lg text-neutral-300 max-w-lg mx-auto">
          Set the monthly SIP amount & Tenure. Returns are calculated since SOL
          inception.
        </p>
      </div>
      <div className="h-50rem mt-8 mb-8 p-4 w-full max-w-sm overflow-hidden">
        <Slider
          label="Amount"
          showTooltip={true}
          color="success"
          formatOptions={{ style: "currency", currency: "INR" }}
          tooltipValueFormatOptions={{ style: "currency", currency: "INR" }}
          step={1000}
          defaultValue={1000}
          minValue={1000}
          maxValue={100000}
          onChange={handleInvestmentChange}
          className="max-w-md dark text-neutral-300 mb-4"
        />
        <Slider
          size="md"
          step={1}
          color={getColorForMonths()}
          label="Months"
          showSteps={true}
          maxValue={40}
          minValue={1}
          defaultValue={1}
          onChange={handleMonthsChange}
          className="max-w-md dark text-neutral-300"
        />

        <div className="  min-h-[300px] max-h-[500px]">
          {" "}
          {/* Adjust min-height and max-height as needed */}
          <h1 className="text-center  mt-16 md:mt-16 text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            Your ₹{initialInvestment.toLocaleString()} would have grown{" "}
            <span className="text-neutral-100 ">
              ₹{(solReturns * 11638).toLocaleString()}{" "}
            </span>{" "}
            in Solana, but in Nifty{" "}
            <span className="text-neutral-100">
              ₹{(niftyReturns * 24320).toLocaleString() + " "}
            </span>
            <br></br>
            <br></br>that’s{" "}
            <span className="text-green-500 ">
              ₹
              {(solReturns * 11638 - niftyReturns * 24320).toLocaleString() +
                " "}
            </span>
            more reasons to love crypto!
          </h1>
        </div>
      </div>

      <div className=" p-8 m-4">
        <ThemeProvider theme={darkTheme}>
          <LineChart
            className="dark"
            width={400}
            height={300}
            series={[
              { data: solChartData, label: "SOL" },
              { data: niftyChartData, label: "NIFTY" },
            ]}
            xAxis={[{ scaleType: "point", data: xLabels }]}
          />
        </ThemeProvider>
      </div>
    </div>
  );
}

export default Input;
