import {
  Box,
  Button,
  Container,
  FormField,
  Grid,
  Header,
  Input,
  LineChart,
  Slider,
  TextContent,
  Toggle,
} from "@cloudscape-design/components";
import { addYears } from "date-fns";
import { useState } from "react";

export default function InvestmentCalculator() {
  const [advanced, setAdvanced] = useState<boolean>(false);
  const [currentAmount, setCurrentAmount] = useState<string | undefined>(
    "10000"
  );
  const [projectedGain, setProjectedGain] = useState<number>(10);
  const [yearsOfGrowth, setYearsOfGrowth] = useState<number>(30);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(0);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState<number>(0);
  const [yearWithdrawalsBegin, setYearWithdrawalsBegin] = useState<number>(0.9);
  const [yearContributionsStop, setYearContributionsStop] = useState<
    number | undefined
  >(yearsOfGrowth);
  const yoyGrowth: { x: Date; y: number }[] = [];
  const maxMonthlyWithdrawal = 10000;
  console.log(yoyGrowth);
  const containerHeader = (
    <Grid>
      <Header>
        Investment Calculator
        <Toggle
          onChange={({ detail }) => setAdvanced(detail.checked)}
          checked={advanced}
        >
          Advanced
        </Toggle>
      </Header>
    </Grid>
  );
  const lineChart = (
    <LineChart
      series={[
        {
          title: "",
          type: "line",
          data: yoyGrowth,
          valueFormatter: function o(e) {
            return Math.abs(e) >= 1e9
              ? "$" + (e / 1e9).toFixed(1).replace(/\.0$/, "") + "B"
              : Math.abs(e) >= 1e6
              ? "$" + (e / 1e6).toFixed(1).replace(/\.0$/, "") + "M"
              : Math.abs(e) >= 1e3
              ? (e / 1e3).toFixed(1).replace(/\.0$/, "") + "K"
              : "$" + e.toFixed(2);
          },
        },
      ]}
      yScaleType="linear"
      i18nStrings={{
        xTickFormatter: (e) =>
          e
            .toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })
            .split(",")
            .join("\n"),
        yTickFormatter: function o(e) {
          return Math.abs(e) >= 1e9
            ? "$" + (e / 1e9).toFixed(1).replace(/\.0$/, "") + "B"
            : Math.abs(e) >= 1e6
            ? "$" + (e / 1e6).toFixed(1).replace(/\.0$/, "") + "M"
            : Math.abs(e) >= 1e3
            ? "$" + (e / 1e3).toFixed(1).replace(/\.0$/, "") + "K"
            : "$" + e.toFixed(2);
        },
      }}
      ariaLabel="Single data series line chart"
      height={300}
      hideFilter
      hideLegend
      xScaleType="time"
      xTitle="Time"
      yTitle="Money"
      empty={
        <Box textAlign="center" color="inherit">
          <b>No data available</b>
          <Box variant="p" color="inherit">
            There is no data available
          </Box>
        </Box>
      }
      noMatch={
        <Box textAlign="center" color="inherit">
          <b>No matching data</b>
          <Box variant="p" color="inherit">
            There is no matching data to display
          </Box>
          <Button>Clear filter</Button>
        </Box>
      }
    />
  );

  function calculateGrowth(
    amount: string | undefined,
    projGain: number | undefined,
    yearsOfGrowth: number | undefined
  ): string {
    const today = new Date();
    if (amount && projGain && yearsOfGrowth) {
      var pAmount = parseInt(amount) || 0;
      const pGain = projGain;
      for (let year = 0; year < yearsOfGrowth; year++) {
        for (let month = 0; month < 12; month++) {
          if (advanced && monthlyWithdrawal && yearWithdrawalsBegin) {
            if (yearWithdrawalsBegin && year >= yearWithdrawalsBegin) {
              pAmount -= monthlyWithdrawal;
            }
          }
          if (
            (advanced && !yearContributionsStop) ||
            !(yearContributionsStop && year > yearContributionsStop)
          ) {
            pAmount += monthlyContribution;
            pAmount += monthlyContribution * (pGain / 100);
            console.log(`pAmount at year ${year}, month ${month}:`, pAmount);
          }
        }
        pAmount += pAmount * (pGain / 100);
        yoyGrowth.push({ x: addYears(today, year), y: Math.floor(pAmount) });
      }

      return `$${pAmount.toLocaleString()}`;
    } else {
      return "";
    }
  }

  return (
    <Container header={containerHeader}>
      <FormField description="Current amount">
        <Input
          onChange={({ detail }) => {
            detail.value.length > 0
              ? setCurrentAmount(detail.value.replace(/[^0-9]/g, ""))
              : setCurrentAmount("");
          }}
          value={`$${currentAmount && currentAmount.toLocaleString()}` || ""}
        />
      </FormField>
      <FormField description={`Estimated return (${projectedGain.toString()}%)`}>
        <Slider
          onChange={({ detail }) => setProjectedGain(detail.value)}
          value={projectedGain}
          max={30}
          min={0}
          tickMarks
        />
      </FormField>
      <FormField description={`Years (${yearsOfGrowth.toString()})`}>
        <Slider
          onChange={({ detail }) => setYearsOfGrowth(detail.value)}
          value={yearsOfGrowth}
          max={100}
          min={0}
          tickMarks
        />
      </FormField>
      {advanced && (
        <>
          <FormField description={`Monthly contribution ($${monthlyContribution})`}>
            <Slider
              onChange={({ detail }) => setMonthlyContribution(detail.value)}
              value={monthlyContribution}
              max={5000}
              min={0}
              tickMarks
            />
          </FormField>
          <FormField description={`Year contributions stop (${yearContributionsStop})`}>
            <Slider
              onChange={({ detail }) => setYearContributionsStop(detail.value)}
              value={yearContributionsStop}
              max={yearsOfGrowth}
              min={0}
              tickMarks
            />
          </FormField>
          <FormField description={`Year withdrawals begin ${yearWithdrawalsBegin !== .9 ? `(${yearWithdrawalsBegin})` : ""}`}>
            <Slider
              onChange={({ detail }) => setYearWithdrawalsBegin(detail.value)}
              value={
                yearWithdrawalsBegin === 0.9
                  ? yearsOfGrowth
                  : yearWithdrawalsBegin
              }
              max={yearsOfGrowth}
              min={0}
              tickMarks
            />
          </FormField>
          <FormField description={`Monthly withdrawal ($${monthlyWithdrawal})`}>
            <Slider
              onChange={({ detail }) => setMonthlyWithdrawal(detail.value)}
              value={monthlyWithdrawal}
              max={maxMonthlyWithdrawal}
              tickMarks
              min={0}
            />
          </FormField>
        </>
      )}
      <br></br>
      <br></br>
      {lineChart}
      <TextContent>
        <h3>{calculateGrowth(currentAmount, projectedGain, yearsOfGrowth)}</h3>
      </TextContent>
    </Container>
  );
}
