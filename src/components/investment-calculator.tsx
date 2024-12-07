import {
  Box,
  Button,
  Container,
  FormField,
  Grid,
  Header,
  Input,
  LineChart,
  Popover,
  Slider,
  TextContent,
  Toggle,
  ToggleButton,
} from '@cloudscape-design/components';
import { useState } from 'react';
import { InvestmentCalculatorProps } from '../common/types';
import { InvestmentCalculator } from '../common/helpers/investment-growth-calculator';
import DateAmountTable from './date-amount-table';

export default function InvestmentCalculatorComponent() {
  const [advanced, setAdvanced] = useState<boolean>(false);
  const [currentAmount, setCurrentAmount] = useState<string | undefined>('10000');
  const [projectedGain, setProjectedGain] = useState<number>(10);
  const [yearsOfGrowth, setYearsOfGrowth] = useState<number>(30);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(0);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState<number>(0);
  const [yearWithdrawalsBegin, setYearWithdrawalsBegin] = useState<number>(0.9);
  const [yearContributionsStop, setYearContributionsStop] = useState<number | undefined>(yearsOfGrowth);
  const yoyGrowth: { x: Date; y: number }[] = [];
  const maxMonthlyWithdrawal = 10000;

  const investmentAProps: InvestmentCalculatorProps = {
    currentAmount: currentAmount,
    setCurrentAmount: setCurrentAmount,
    projectedGain: projectedGain,
    setProjectedGain: setProjectedGain,
    yearsOfGrowth: yearsOfGrowth,
    setYearsOfGrowth: setYearsOfGrowth,
    monthlyContribution: monthlyContribution,
    setMonthlyContribution: setMonthlyContribution,
    monthlyWithdrawal: monthlyWithdrawal,
    setMonthlyWithdrawal: setMonthlyWithdrawal,
    yearWithdrawalsBegin: yearWithdrawalsBegin,
    setYearWithdrawalsBegin: setYearWithdrawalsBegin,
    yearContributionsStop: yearContributionsStop,
    setYearContributionsStop: setYearContributionsStop,
    growthMatrix: yoyGrowth,
    advanced: advanced,
    maxMonthlyWithdrawal: maxMonthlyWithdrawal,
    investmentId: 'investmentA',
  };

  // Calc 2
  const [currentAmountI, setCurrentAmountI] = useState<string | undefined>('10000');
  const [projectedGainI, setProjectedGainI] = useState<number>(10);
  const [yearsOfGrowthI, setYearsOfGrowthI] = useState<number>(30);
  const [monthlyContributionI, setMonthlyContributionI] = useState<number>(0);
  const [monthlyWithdrawalI, setMonthlyWithdrawalI] = useState<number>(0);
  const [yearWithdrawalsBeginI, setYearWithdrawalsBeginI] = useState<number>(0.9);
  const [yearContributionsStopI, setYearContributionsStopI] = useState<number | undefined>(yearsOfGrowthI);
  const yoyGrowthI: { x: Date; y: number }[] = [];
  const maxMonthlyWithdrawalI = 20000;
  const [rollOver, setRollOver] = useState<boolean>(false); // Rolls investment 1 > Investment 2 at end of 'years'

  const investmentCalcA = new InvestmentCalculator(investmentAProps);
  const investmentOneTotal = investmentCalcA.calculateGrowth();
  const investmentBProps: InvestmentCalculatorProps = {
    currentAmount: currentAmountI,
    setCurrentAmount: setCurrentAmountI,
    projectedGain: projectedGainI,
    setProjectedGain: setProjectedGainI,
    yearsOfGrowth: yearsOfGrowthI,
    setYearsOfGrowth: setYearsOfGrowthI,
    monthlyContribution: monthlyContributionI,
    setMonthlyContribution: setMonthlyContributionI,
    monthlyWithdrawal: monthlyWithdrawalI,
    setMonthlyWithdrawal: setMonthlyWithdrawalI,
    yearWithdrawalsBegin: yearWithdrawalsBeginI,
    setYearWithdrawalsBegin: setYearWithdrawalsBeginI,
    yearContributionsStop: yearContributionsStopI,
    setYearContributionsStop: setYearContributionsStopI,
    growthMatrix: yoyGrowthI,
    maxMonthlyWithdrawal: maxMonthlyWithdrawalI,
    investmentToRoll: investmentAProps.growthMatrix[investmentAProps.growthMatrix.length - 1]?.y ?? 0,
    advanced: advanced,
    rollOver: rollOver,
    yearOfRollover: investmentAProps.yearsOfGrowth,
    investmentId: 'investmentB',
  };
  const investmentCalcB = new InvestmentCalculator(investmentBProps);
  //
  const investmentTwoTotal = investmentCalcB.calculateGrowth();
  const investmentBTable = (
    <DateAmountTable
      items={investmentBProps.growthMatrix.map((entry) => ({
        investmentId: investmentBProps.investmentId,
        date: entry.x,
        amount: entry.y,
      }))}
    />
  );
  const investmentTwoDisplayText = <Popover size="medium" position="right" triggerType="custom" content={investmentBTable}>
  <h3>{investmentTwoTotal}</h3>
</Popover>
  const yearInvestmentOneAtZero =
    yoyGrowth.filter((yearXy) => {
      return yearXy.y <= 0;
    }) &&
    yoyGrowth.filter((yearXy) => {
      return yearXy.y <= 0;
    })[0] &&
    yoyGrowth.filter((yearXy) => {
      return yearXy.y <= 0;
    })[0].x;
  const yearInvestmentTwoAtZero =
    yoyGrowthI.filter((yearXy) => {
      return yearXy.y <= 0;
    }) &&
    yoyGrowthI.filter((yearXy) => {
      return yearXy.y <= 0;
    })[0] &&
    yoyGrowthI.filter((yearXy) => {
      return yearXy.y <= 0;
    })[0].x;
  const containerHeader = (
    <Grid>
      <Header>
        Investment Calculator
        <Toggle onChange={({ detail }) => setAdvanced(detail.checked)} checked={advanced}>
          Advanced
        </Toggle>
      </Header>
    </Grid>
  );
  const lineChart = (
    <LineChart
      series={[
        {
          title: 'Investment A',
          type: 'line',
          data: yoyGrowth,
          color: parseInt(investmentOneTotal.replace('$', '')) > 0 ? 'cyan' : 'red',
          valueFormatter: function o(e) {
            return Math.abs(e) >= 1e9
              ? '$' + (e / 1e9).toFixed(1).replace(/\.0$/, '') + 'B'
              : Math.abs(e) >= 1e6
                ? '$' + (e / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'
                : Math.abs(e) >= 1e3
                  ? (e / 1e3).toFixed(1).replace(/\.0$/, '') + 'K'
                  : '$' + e.toFixed(2);
          },
        },
        {
          title: 'Investment B',
          type: 'line',
          color: parseInt(investmentTwoTotal.replace('$', '')) > 0 ? 'green' : 'red',
          data: yoyGrowthI,
          valueFormatter: function o(e) {
            return Math.abs(e) >= 1e9
              ? '$' + (e / 1e9).toFixed(1).replace(/\.0$/, '') + 'B'
              : Math.abs(e) >= 1e6
                ? '$' + (e / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'
                : Math.abs(e) >= 1e3
                  ? (e / 1e3).toFixed(1).replace(/\.0$/, '') + 'K'
                  : '$' + e.toFixed(2);
          },
        },
        {
          title: `Rollover on Y${yearsOfGrowth}`,
          type: 'threshold',
          x: yoyGrowth[yearsOfGrowth - 1].x,
        },
        {
          title: `Investment A = 0 on ${yearInvestmentOneAtZero && yearInvestmentOneAtZero.toDateString()}`,
          type: 'threshold',
          x: yearInvestmentOneAtZero,
        },
        {
          title: `Investment B = 0 on ${yearInvestmentTwoAtZero && yearInvestmentTwoAtZero.toDateString()}`,
          type: 'threshold',
          x: yearInvestmentTwoAtZero,
        },
      ]}
      yScaleType="linear"
      i18nStrings={{
        xTickFormatter: (e) =>
          `${e
            .toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric',
            })
            .split(',')
            .join('\n')}`,
        yTickFormatter: function o(e) {
          return Math.abs(e) >= 1e9
            ? '$' + (e / 1e9).toFixed(1).replace(/\.0$/, '') + 'B'
            : Math.abs(e) >= 1e6
              ? '$' + (e / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'
              : Math.abs(e) >= 1e3
                ? '$' + (e / 1e3).toFixed(1).replace(/\.0$/, '') + 'K'
                : '$' + e.toFixed(2);
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
  const investmentATable = (
    <DateAmountTable
      items={investmentAProps.growthMatrix.map((entry) => ({
        investmentId: investmentAProps.investmentId,
        date: entry.x,
        amount: entry.y,
      }))}
    />
  );
  const investmentOneDisplayText = <Popover size="medium" position="right" triggerType="custom" content={investmentATable}>
  <h3>{investmentOneTotal}</h3>
</Popover>
  const investmentCalcOne = advanced && (
    <Box>
      <FormField description="Principal amount">
        <Input
          onChange={({ detail }) => {
            detail.value.length > 0 ? setCurrentAmount(detail.value.replace(/[^0-9]/g, '')) : setCurrentAmount('');
          }}
          value={`$${currentAmount && currentAmount.toLocaleString()}`}
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
          <FormField
            description={`Year withdrawals begin ${yearWithdrawalsBegin !== 0.9 ? `(${yearWithdrawalsBegin})` : ''}`}
          >
            <Slider
              onChange={({ detail }) => setYearWithdrawalsBegin(detail.value)}
              value={yearWithdrawalsBegin === 0.9 ? yearsOfGrowth : yearWithdrawalsBegin}
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
          <ToggleButton
            onChange={({ detail }) => setRollOver(detail.pressed)}
            pressed={rollOver}
            iconName="arrow-right"
            pressedIconName="angle-right-double"
          >
            Roll over
          </ToggleButton>
        </>
      )}
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>

      {investmentOneDisplayText}
    </Box>
  );
  const investmentCalcTwo = (
    <Box>
      <FormField description="Principal amount">
        <Input
          onChange={({ detail }) => {
            detail.value.length > 0 ? setCurrentAmountI(detail.value.replace(/[^0-9]/g, '')) : setCurrentAmountI('');
          }}
          value={`$${currentAmountI && currentAmountI.toLocaleString()}`}
        />
      </FormField>
      <FormField description={`Estimated return (${projectedGainI.toString()}%)`}>
        <Slider
          onChange={({ detail }) => setProjectedGainI(detail.value)}
          value={projectedGainI}
          max={30}
          min={0}
          tickMarks
        />
      </FormField>
      <FormField description={`Years (${yearsOfGrowthI.toString()})`}>
        <Slider
          onChange={({ detail }) => setYearsOfGrowthI(detail.value)}
          value={yearsOfGrowthI}
          max={100}
          min={0}
          tickMarks
        />
      </FormField>
      {advanced && (
        <>
          {/* <FormField description={`Year investment begins (${yearInvestmentBegins})`}>
            <Slider
              onChange={({ detail }) => setYearInvestmentBegins(detail.value)}
              value={yearInvestmentBegins}
              max={yearsOfGrowth}
              min={0}
              tickMarks
            />
          </FormField> */}

          <FormField description={`Monthly contribution ($${monthlyContributionI})`}>
            <Slider
              onChange={({ detail }) => setMonthlyContributionI(detail.value)}
              value={monthlyContributionI}
              max={5000}
              min={0}
              tickMarks
            />
          </FormField>
          <FormField description={`Year contributions stop (${yearContributionsStopI})`}>
            <Slider
              onChange={({ detail }) => setYearContributionsStopI(detail.value)}
              value={yearContributionsStopI}
              max={yearsOfGrowthI}
              min={0}
              tickMarks
            />
          </FormField>
          <FormField
            description={`Year withdrawals begin ${yearWithdrawalsBeginI !== 0.9 ? `(${yearWithdrawalsBeginI})` : ''}`}
          >
            <Slider
              onChange={({ detail }) => setYearWithdrawalsBeginI(detail.value)}
              value={yearWithdrawalsBeginI === 0.9 ? yearsOfGrowthI : yearWithdrawalsBeginI}
              max={yearsOfGrowthI}
              min={0}
              tickMarks
            />
          </FormField>
          <FormField description={`Monthly withdrawal ($${monthlyWithdrawalI})`}>
            <Slider
              onChange={({ detail }) => setMonthlyWithdrawalI(detail.value)}
              value={monthlyWithdrawalI}
              max={maxMonthlyWithdrawalI}
              tickMarks
              min={0}
            />
          </FormField>
        </>
      )}
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>

      {investmentTwoDisplayText}
    </Box>
  );

  return (
    <Container header={containerHeader}>
      <Grid>
        {investmentCalcOne}
        {investmentCalcTwo}
      </Grid>
      {lineChart}
      <small>
        This is a coding project, <b>NOT A FINANCIAL TOOL</b>, and is intended for educational purposes only;
        calculations are merely approximations and no guarantee should be assumed. <b>USE AT YOUR OWN RISK.</b>{' '}
        Information on this site does not constitute investment or financial advice.
      </small>
    </Container>
  );
}
