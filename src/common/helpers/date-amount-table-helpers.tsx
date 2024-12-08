import { DateAmountPair } from '../types';
import { InvestmentCalculator } from './investment-growth-calculator';
import { Box, Popover } from '@cloudscape-design/components';

export function returnInflationAdjustedText(dateAmountPair: DateAmountPair, investmentCalc: InvestmentCalculator) {
  const percentChange = investmentCalc.getPercentageChange(
    investmentCalc.getGrowthMatrix()[0].y,
    dateAmountPair.inflationAdjustedAmount,
  );
  const textColor = percentChange > 0 ? 'text-status-success' : 'text-status-error';
  return (
    <Box color={textColor}>
      ${dateAmountPair.inflationAdjustedAmount.toLocaleString()} (
      {investmentCalc.getPercentageChange(
        investmentCalc.getGrowthMatrix()[0].y,
        dateAmountPair.inflationAdjustedAmount,
      )}
      %)
    </Box>
  );
}

export function returnGrowthText(dateAmountPair: DateAmountPair, investmentCalc: InvestmentCalculator) {
  const percentChange = investmentCalc.getPercentageChange(
    investmentCalc.getGrowthMatrix()[0].y,
    dateAmountPair.amount,
  );
  const textColor = percentChange >= 0 ? 'text-status-success' : 'text-status-error';
  return (
    <Box color={textColor}>
      ${dateAmountPair.amount.toLocaleString()} (
      {investmentCalc.getPercentageChange(investmentCalc.getGrowthMatrix()[0].y, dateAmountPair.amount)}%)
    </Box>
  );
}

export function returnDateElement(dateAmountPair: DateAmountPair, investmentCalc: InvestmentCalculator) {
  // Returns plainly formatted text formatted with shortMonth 4-digit-year unless an event occured in the year
  // in which case a popover will be returned with the event description
  const year = dateAmountPair.date.getFullYear();
  const yearOfRollover = investmentCalc.props.yearOfRollover;
  const rolloverDatePair = yearOfRollover &&  investmentCalc.props.growthMatrix[yearOfRollover]
  const eventInYear = investmentCalc.props.yearOfRollover ? investmentCalc.getGrowthMatrix().filter((entry) => {
    return (
      yearOfRollover && rolloverDatePair && 
      entry.x.getFullYear() === year &&
      year === rolloverDatePair.x.getFullYear()
    );
  }) : [];
  if (eventInYear.length > 0) {
    return (
      <Box color="text-status-info">
        <Popover
          dismissButton={false}
          size="small"
          triggerType="custom"
          content={
            <div>
              <h4>Year of Rollover</h4>
              <Box color="text-status-success">+ ${investmentCalc.props.investmentToRoll?.toLocaleString()}</Box>
            </div>
          }
        >
          {dateAmountPair.date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
        </Popover>
      </Box>
    );
  } else {
    return dateAmountPair.date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }
}
