import { DateAmountPair } from '../types';
import { InvestmentCalculator } from './investment-growth-calculator';
import { Box, Popover } from '@cloudscape-design/components';

export function returnInflationAdjustedText(dateAmountPair: DateAmountPair, investmentCalc: InvestmentCalculator) {
  /*
  Retrieves the percentage change between the first year of the growth matrix and the inflation adjusted amount,
  used in table which displays the amount and the percentage change
  */
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
  /*
  Retrieves the percentage change between the first year of the growth matrix and the amount,
  used in table which displays the amount and the percentage change
  */
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
  /*
  Returns a popover which displays the year of rollover and the amount of the rollover if the year of rollover is the same as the year of the dateAmountPair
  */
  const year = dateAmountPair.date.getFullYear();
  const yearOfRollover = investmentCalc.props.yearOfRollover;
  const rolloverDatePair = yearOfRollover && investmentCalc.props.growthMatrix[yearOfRollover];
  const investmentToRoll = investmentCalc.props.investmentToRoll;
  const eventInYear = investmentCalc.props.yearOfRollover
    ? investmentCalc.getGrowthMatrix().filter((entry) => {
        return (
          yearOfRollover &&
          rolloverDatePair &&
          entry.x.getFullYear() === year &&
          year === rolloverDatePair.x.getFullYear()
        );
      })
    : [];
  const rolledInvestmentPositive = investmentToRoll && investmentToRoll > 0 ? true : false;
  const eventTextColor = rolledInvestmentPositive ? 'text-status-success' : 'text-status-error';
  const eventText = rolledInvestmentPositive
    ? `+${investmentToRoll?.toLocaleString()}`
    : `-$${investmentToRoll?.toLocaleString().replace('-', '')}`;
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
              <Box color={eventTextColor}>{eventText}</Box>
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
