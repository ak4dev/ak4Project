import {
  Box,
  Button,
  Container,
  FormField,
  Header,
  Input,
  LineChart,
  TextContent,
} from "@cloudscape-design/components";
import { addYears } from "date-fns";
import { useState } from "react";
// Testing S3 Sync

const containerHeader = <Header>Investment Calculator</Header>;

export default function InvestmentCalculator() {
  const [currentAmount, setCurrentAmount] = useState<string | undefined>(
    "10000"
  );
  const [projectedGain, setProjectedGain] = useState<string | undefined>("10");
  const [yearsOfGrowth, setYearsOfGrowth] = useState<string | undefined>("30");
  const yoyGrowth: { x: Date; y: number }[] = [];
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
    projGain: string | undefined,
    yearsOfGrowth: string | undefined
  ): string {
    const today = new Date();
    if (amount && projGain && yearsOfGrowth) {
      var pAmount = parseInt(amount) || 0;
      const pGain = parseInt(projGain);
      for (let i = 0; i < parseInt(yearsOfGrowth); i++) {
        pAmount += pAmount * (pGain / 100);
        yoyGrowth.push({ x: addYears(today, i), y: Math.floor(pAmount) });
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
          onChange={({ detail }) =>
            setCurrentAmount(detail.value.replace(/[^0-9]/g, ""))
          }
          value={`$${currentAmount && currentAmount.toLocaleString()}` || ""}
        />
      </FormField>
      <FormField description="Projected return">
        <Input
          onChange={({ detail }) =>
            setProjectedGain(detail.value.replace(/[^0-9]/g, ""))
          }
          value={(projectedGain && `${projectedGain}%`) || ""}
        />
      </FormField>
      <FormField description="Years">
        <Input
          onChange={({ detail }) =>
            setYearsOfGrowth(detail.value.replace(/[^0-9]/g, ""))
          }
          value={yearsOfGrowth || ""}
        />
      </FormField>
      <br></br>
      <br></br>
      {lineChart}
      <TextContent>
        <h3>{calculateGrowth(currentAmount, projectedGain, yearsOfGrowth)}</h3>
      </TextContent>
    </Container>
  );
}
