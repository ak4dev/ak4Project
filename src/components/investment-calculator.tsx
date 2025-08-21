import {
  Box,
  Button,
  ColumnLayout,
  Container,
  FormField,
  Grid,
  Header,
  Input,
  LineChart,
  Popover,
  Slider,
  StatusIndicator,
  Toggle,
  ToggleButton,
} from '@cloudscape-design/components';
import { useState } from 'react';
import { addYears } from 'date-fns';

import { InvestmentCalculatorProps, LineGraphEntry } from '../common/types';
import { InvestmentCalculator } from '../common/helpers/investment-growth-calculator';
import DateAmountTable from './date-amount-table';

/**
 * Investment Calculator Component
 *
 * A comprehensive investment calculator that supports:
 * - Basic investment growth calculations
 * - Advanced features including contributions, withdrawals, and rollovers
 * - Dual investment comparison
 * - Inflation adjustment calculations
 * - Interactive charting and data visualization
 *
 * The component manages two separate investment calculations (A and B) and provides
 * a rich interface for comparing different investment scenarios.
 */

// ============================================================================
// Constants and Configuration
// ============================================================================

const DEFAULT_INITIAL_AMOUNT = '10000';
const DEFAULT_PROJECTED_GAIN = 10;
const DEFAULT_YEARS_OF_GROWTH = 30;
const DEFAULT_INFLATION_RATE = 2.5;
const MAX_MONTHLY_WITHDRAWAL_A = 10000;
const MAX_MONTHLY_WITHDRAWAL_B = 20000;
const MAX_CONTRIBUTION = 5000;
const MAX_RETURN_RATE = 30;
const MAX_YEARS = 100;
const MAX_INFLATION_RATE = 5;
const INFLATION_STEP = 0.5;

export default function InvestmentCalculatorComponent() {
  // ============================================================================
  // State Management - Investment A (Primary)
  // ============================================================================

  const [advanced, setAdvanced] = useState<boolean>(false);
  const [currentAmount, setCurrentAmount] = useState<string | undefined>(DEFAULT_INITIAL_AMOUNT);
  const [projectedGain, setProjectedGain] = useState<number>(DEFAULT_PROJECTED_GAIN);
  const [yearsOfGrowth, setYearsOfGrowth] = useState<number>(DEFAULT_YEARS_OF_GROWTH);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(0);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState<number>(0);
  const [yearWithdrawalsBegin, setYearWithdrawalsBegin] = useState<number>(0);
  const [yearContributionsStop, setYearContributionsStop] = useState<number | undefined>(DEFAULT_YEARS_OF_GROWTH);

  // ============================================================================
  // State Management - Investment B (Comparison)
  // ============================================================================

  const [currentAmountB, setCurrentAmountB] = useState<string | undefined>(DEFAULT_INITIAL_AMOUNT);
  const [projectedGainB, setProjectedGainB] = useState<number>(DEFAULT_PROJECTED_GAIN);
  const [yearsOfGrowthB, setYearsOfGrowthB] = useState<number>(DEFAULT_YEARS_OF_GROWTH);
  const [monthlyContributionB, setMonthlyContributionB] = useState<number>(0);
  const [monthlyWithdrawalB, setMonthlyWithdrawalB] = useState<number>(0);
  const [yearWithdrawalsBeginB, setYearWithdrawalsBeginB] = useState<number>(0);
  const [yearContributionsStopB, setYearContributionsStopB] = useState<number | undefined>(DEFAULT_YEARS_OF_GROWTH);

  // ============================================================================
  // State Management - Global Settings
  // ============================================================================

  const [yearlyInflation, setYearlyInflation] = useState<number>(DEFAULT_INFLATION_RATE);
  const [showInflation, setShowInflation] = useState<boolean>(false);
  const [rollOver, setRollOver] = useState<boolean>(false);

  // ============================================================================
  // Investment Calculator Configuration
  // ============================================================================

  // Growth matrices for chart data
  const growthMatrixA: LineGraphEntry[] = [];
  const growthMatrixB: LineGraphEntry[] = [];

  // Investment A configuration
  const investmentAProps: InvestmentCalculatorProps = {
    currentAmount,
    setCurrentAmount,
    projectedGain,
    setProjectedGain,
    yearsOfGrowth,
    setYearsOfGrowth,
    monthlyContribution,
    setMonthlyContribution,
    monthlyWithdrawal,
    setMonthlyWithdrawal,
    yearWithdrawalsBegin,
    setYearWithdrawalsBegin,
    yearContributionsStop,
    setYearContributionsStop,
    growthMatrix: growthMatrixA,
    advanced,
    maxMonthlyWithdrawal: MAX_MONTHLY_WITHDRAWAL_A,
    investmentId: 'investmentA',
    depreciationRate: yearlyInflation,
  };

  // Investment B configuration
  const investmentBProps: InvestmentCalculatorProps = {
    currentAmount: currentAmountB,
    setCurrentAmount: setCurrentAmountB,
    projectedGain: projectedGainB,
    setProjectedGain: setProjectedGainB,
    yearsOfGrowth: yearsOfGrowthB,
    setYearsOfGrowth: setYearsOfGrowthB,
    monthlyContribution: monthlyContributionB,
    setMonthlyContribution: setMonthlyContributionB,
    monthlyWithdrawal: monthlyWithdrawalB,
    setMonthlyWithdrawal: setMonthlyWithdrawalB,
    yearWithdrawalsBegin: yearWithdrawalsBeginB,
    setYearWithdrawalsBegin: setYearWithdrawalsBeginB,
    yearContributionsStop: yearContributionsStopB,
    setYearContributionsStop: setYearContributionsStopB,
    growthMatrix: growthMatrixB,
    maxMonthlyWithdrawal: MAX_MONTHLY_WITHDRAWAL_B,
    investmentToRoll: growthMatrixA[growthMatrixA.length - 1]?.y ?? 0,
    advanced,
    rollOver,
    yearOfRollover: yearsOfGrowth,
    investmentId: 'investmentB',
    depreciationRate: yearlyInflation,
  };

  // ============================================================================
  // Calculator Instances and Results
  // ============================================================================

  const investmentCalcA = new InvestmentCalculator(investmentAProps);
  const investmentCalcB = new InvestmentCalculator(investmentBProps);

  const investmentATotal = investmentCalcA.calculateGrowth(showInflation);
  const investmentBTotal = investmentCalcB.calculateGrowth(showInflation);

  // ============================================================================
  // Event Handlers
  // ============================================================================

  /**
   * Handles numeric input changes with validation
   */
  const handleNumericInput = (value: string, setter: (value: string | undefined) => void) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setter(numericValue.length > 0 ? numericValue : undefined);
  };

  /**
   * Formats currency for display in input fields
   */
  const formatCurrencyInput = (value: string | undefined): string => {
    return value ? `$${parseInt(value).toLocaleString()}` : '';
  };

  // ============================================================================
  // Chart Configuration
  // ============================================================================

  /**
   * Formats values for chart display
   */
  const formatChartValue = (value: number): string => {
    const absValue = Math.abs(value);
    if (absValue >= 1e9) {
      return `$${(value / 1e9).toFixed(1).replace(/\.0$/, '')}B`;
    }
    if (absValue >= 1e6) {
      return `$${(value / 1e6).toFixed(1).replace(/\.0$/, '')}M`;
    }
    if (absValue >= 1e3) {
      return `${(value / 1e3).toFixed(1).replace(/\.0$/, '')}K`;
    }
    return `$${value.toFixed(2)}`;
  };

  /**
   * Determines when investments reach zero for threshold display
   */
  const getZeroDate = (matrix: LineGraphEntry[]): Date | undefined => {
    const zeroPoint = matrix.find((point) => point.y <= 0);
    return zeroPoint?.x;
  };

  const investmentAZeroDate = getZeroDate(growthMatrixA);
  const investmentBZeroDate = getZeroDate(growthMatrixB);

  // ============================================================================
  // Render Methods
  // ============================================================================

  /**
   * Renders the container header with advanced mode toggle
   */
  const renderHeader = () => (
    <Header>
      Investment Calculator
      <Toggle onChange={({ detail }) => setAdvanced(detail.checked)} checked={advanced}>
        Advanced
      </Toggle>
    </Header>
  );

  /**
   * Renders Investment A control panel
   */
  const renderInvestmentAControls = () => (
    <Box>
      <FormField description="Principal amount">
        <Input
          inputMode="numeric"
          onChange={({ detail }) => handleNumericInput(detail.value, setCurrentAmount)}
          value={formatCurrencyInput(currentAmount)}
        />
      </FormField>

      <FormField description={`Estimated return (${projectedGain}%)`}>
        <Slider
          onChange={({ detail }) => setProjectedGain(detail.value)}
          value={projectedGain}
          max={MAX_RETURN_RATE}
          min={0}
          tickMarks
        />
      </FormField>

      <FormField description={`Years (${yearsOfGrowth})`}>
        <Slider
          onChange={({ detail }) => setYearsOfGrowth(detail.value)}
          value={yearsOfGrowth}
          max={MAX_YEARS}
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
              max={MAX_CONTRIBUTION}
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

          <FormField description={`Year withdrawals begin ${yearWithdrawalsBegin ? `(${yearWithdrawalsBegin})` : ''}`}>
            <Slider
              onChange={({ detail }) => setYearWithdrawalsBegin(detail.value)}
              value={yearWithdrawalsBegin}
              max={yearsOfGrowth}
              min={0}
              tickMarks
            />
          </FormField>

          <FormField description={`Monthly withdrawal ($${monthlyWithdrawal})`}>
            <Slider
              onChange={({ detail }) => setMonthlyWithdrawal(detail.value)}
              value={monthlyWithdrawal}
              max={MAX_MONTHLY_WITHDRAWAL_A}
              min={0}
              tickMarks
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
    </Box>
  );

  /**
   * Renders Investment B control panel (advanced mode only)
   */
  const renderInvestmentBControls = () => (
    <Box>
      <FormField description="Principal amount">
        <Input
          inputMode="numeric"
          onChange={({ detail }) => handleNumericInput(detail.value, setCurrentAmountB)}
          value={formatCurrencyInput(currentAmountB)}
        />
      </FormField>

      <FormField description={`Estimated return (${projectedGainB}%)`}>
        <Slider
          onChange={({ detail }) => setProjectedGainB(detail.value)}
          value={projectedGainB}
          max={MAX_RETURN_RATE}
          min={0}
          tickMarks
        />
      </FormField>

      <FormField description={`Years (${yearsOfGrowthB})`}>
        <Slider
          onChange={({ detail }) => setYearsOfGrowthB(detail.value)}
          value={yearsOfGrowthB}
          max={MAX_YEARS}
          min={0}
          tickMarks
        />
      </FormField>

      <FormField description={`Monthly contribution ($${monthlyContributionB})`}>
        <Slider
          onChange={({ detail }) => setMonthlyContributionB(detail.value)}
          value={monthlyContributionB}
          max={MAX_CONTRIBUTION}
          min={0}
          tickMarks
        />
      </FormField>

      <FormField description={`Year contributions stop (${yearContributionsStopB})`}>
        <Slider
          onChange={({ detail }) => setYearContributionsStopB(detail.value)}
          value={yearContributionsStopB}
          max={yearsOfGrowthB}
          min={0}
          tickMarks
        />
      </FormField>

      <FormField description={`Year withdrawals begin ${yearWithdrawalsBeginB ? `(${yearWithdrawalsBeginB})` : ''}`}>
        <Slider
          onChange={({ detail }) => setYearWithdrawalsBeginB(detail.value)}
          value={yearWithdrawalsBeginB}
          max={yearsOfGrowthB}
          min={0}
          tickMarks
        />
      </FormField>

      <FormField description={`Monthly withdrawal ($${monthlyWithdrawalB})`}>
        <Slider
          onChange={({ detail }) => setMonthlyWithdrawalB(detail.value)}
          value={monthlyWithdrawalB}
          max={MAX_MONTHLY_WITHDRAWAL_B}
          min={0}
          tickMarks
        />
      </FormField>
    </Box>
  );

  /**
   * Renders inflation and information panel
   */
  const renderInflationPanel = () => {
    const informationItems = [
      {
        name: '(A) Withdrawal Start',
        value: yearWithdrawalsBegin
          ? addYears(new Date(), yearWithdrawalsBegin).toDateString()
          : monthlyWithdrawal > 0
            ? new Date().toDateString()
            : 'N/A',
      },
      {
        name: '(B) Withdrawal Start',
        value: yearWithdrawalsBeginB
          ? addYears(new Date(), yearWithdrawalsBeginB).toDateString()
          : monthlyWithdrawalB > 0
            ? new Date().toDateString()
            : 'N/A',
      },
      {
        name: '(A) Contributions End',
        value: yearContributionsStop ? addYears(new Date(), yearContributionsStop).toDateString() : 'N/A',
      },
      {
        name: '(B) Contributions End',
        value: yearContributionsStopB ? addYears(new Date(), yearContributionsStopB).toDateString() : 'N/A',
      },
      {
        name: 'Rollover Date',
        value: rollOver && yearsOfGrowth ? addYears(new Date(), yearsOfGrowth).toDateString() : 'N/A',
      },
      {
        name: 'Rollover Amount',
        value: investmentBProps.investmentToRoll ? `$${investmentBProps.investmentToRoll.toLocaleString()}` : 'N/A',
      },
      {
        name: 'Inflation Rate',
        value: `${yearlyInflation}%`,
      },
    ];

    return (
      <Box>
        <FormField description={`Inflation (${yearlyInflation}%)`}>
          <Slider
            onChange={({ detail }) => setYearlyInflation(detail.value)}
            value={yearlyInflation}
            max={MAX_INFLATION_RATE}
            step={INFLATION_STEP}
            min={0}
          />
          <ToggleButton
            pressed={showInflation}
            iconName="view-full"
            pressedIconName="view-horizontal"
            onChange={({ detail }) => setShowInflation(detail.pressed)}
          >
            Graph Inflation
          </ToggleButton>
        </FormField>

        <Box>
          <ColumnLayout columns={2} variant="text-grid">
            {informationItems.map((item) => (
              <div
                key={item.name}
                style={{
                  marginBottom: '-8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <strong style={{ width: '150px' }}>{item.name}:</strong>
                <StatusIndicator type="info">
                  <small>{item.value}</small>
                </StatusIndicator>
              </div>
            ))}
          </ColumnLayout>
        </Box>
      </Box>
    );
  };

  /**
   * Renders the investment totals with popover tables
   */
  const renderInvestmentTotals = () => {
    const investmentATable = <DateAmountTable investmentCalc={investmentCalcA} />;
    const investmentBTable = <DateAmountTable investmentCalc={investmentCalcB} />;

    const investmentADisplay = (
      <Popover size="large" position="right" triggerType="custom" content={investmentATable}>
        <h3>{investmentATotal}</h3>
      </Popover>
    );

    const investmentBDisplay = (
      <Popover size="large" position="right" triggerType="custom" content={investmentBTable}>
        <h3>{investmentBTotal}</h3>
      </Popover>
    );

    return advanced ? (
      <Grid gridDefinition={[{ colspan: 2 }, { colspan: 2 }]}>
        {investmentADisplay}
        {investmentBDisplay}
      </Grid>
    ) : (
      investmentADisplay
    );
  };

  /**
   * Renders the line chart with investment data
   */
  const renderLineChart = () => (
    <LineChart
      series={[
        {
          title: 'Investment A',
          type: 'line',
          data: growthMatrixA,
          color: parseInt(investmentATotal.replace('$', '').replace(/,/g, '')) > 0 ? 'cyan' : 'red',
          valueFormatter: formatChartValue,
        },
        {
          title: 'Investment B',
          type: 'line',
          color: parseInt(investmentBTotal.replace('$', '').replace(/,/g, '')) > 0 ? 'green' : 'red',
          data: advanced ? growthMatrixB : [],
          valueFormatter: formatChartValue,
        },
        {
          title: `Rollover on Y${yearsOfGrowth}`,
          type: 'threshold',
          x: growthMatrixA[yearsOfGrowth - 1]?.x || new Date(),
        },
        {
          title: `[B] Withdrawals begin on Y${yearWithdrawalsBeginB}`,
          type: 'threshold',
          x: addYears(new Date(), yearWithdrawalsBeginB),
        },
        {
          title: `[A] Withdrawals begin on Y${yearWithdrawalsBegin}`,
          type: 'threshold',
          x: addYears(new Date(), yearWithdrawalsBegin),
        },
        ...(investmentAZeroDate
          ? [
              {
                title: `Investment A = 0 on ${investmentAZeroDate.toDateString()}`,
                type: 'threshold' as const,
                x: investmentAZeroDate,
              },
            ]
          : []),
        ...(investmentBZeroDate
          ? [
              {
                title: `Investment B = 0 on ${investmentBZeroDate.toDateString()}`,
                type: 'threshold' as const,
                x: investmentBZeroDate,
              },
            ]
          : []),
      ]}
      yScaleType="linear"
      i18nStrings={{
        xTickFormatter: (date) =>
          date
            .toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric',
            })
            .replace(',', '\n'),
        yTickFormatter: formatChartValue,
      }}
      ariaLabel="Investment growth comparison chart"
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

  /**
   * Renders the disclaimer text
   */
  const renderDisclaimer = () => (
    <small>
      This is a coding project, <b>NOT A FINANCIAL TOOL</b>, and is intended for educational purposes only; calculations
      are merely approximations and no guarantee should be assumed. <b>USE AT YOUR OWN RISK.</b> Information on this
      site does not constitute investment or financial advice.
    </small>
  );

  // ============================================================================
  // Main Render
  // ============================================================================

  return (
    <Container header={renderHeader()}>
      <Grid gridDefinition={[{ colspan: 3 }, { colspan: 3 }, { colspan: 3 }]}>
        <Box>{renderInvestmentAControls()}</Box>

        {advanced && <Box>{renderInvestmentBControls()}</Box>}

        {renderInflationPanel()}
      </Grid>

      {renderInvestmentTotals()}
      {renderLineChart()}
      {renderDisclaimer()}
    </Container>
  );
}
