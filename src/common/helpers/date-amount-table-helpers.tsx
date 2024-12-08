import { DateAmountPair } from '../types';
import { InvestmentCalculator } from './investment-growth-calculator';
import { Box } from '@cloudscape-design/components';

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
