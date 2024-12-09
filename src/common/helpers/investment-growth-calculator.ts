import { addYears } from 'date-fns';
import { InvestmentCalculatorProps } from '../types';

export class InvestmentCalculator {
  props: InvestmentCalculatorProps;
  today: Date = new Date();
  static props: InvestmentCalculatorProps;

  constructor(investmentCalculatorProps: InvestmentCalculatorProps) {
    this.props = investmentCalculatorProps;
  }
  public calculateGrowth(showInflation: boolean): string {
    const thisMonth = this.today.getMonth();
    if (this.props.currentAmount && this.props.projectedGain && this.props.yearsOfGrowth) {
      let pAmount = parseInt(this.props.currentAmount) || 0;
      let inflationAdjustedAmount = pAmount;

      for (let year = 0; year < this.props.yearsOfGrowth; year++) {
        // Calculate monthly changes
        for (let month = year == 0 ? thisMonth : 0; month < 12; month++) {
          // Handle withdrawals for both amounts
          console.log(
            `withdrawal yearWithdrawalsBegin, year, eval`,
            this.props.yearWithdrawalsBegin,
            year >= this.props.yearWithdrawalsBegin,
          );
          if (this.props.advanced && this.props.monthlyWithdrawal && this.props.yearWithdrawalsBegin) {
            if (this.props.yearWithdrawalsBegin && year >= this.props.yearWithdrawalsBegin) {
              pAmount -= this.props.monthlyWithdrawal;
              inflationAdjustedAmount -= this.props.monthlyWithdrawal;
            }
          }

          // Apply growth rate
          pAmount += (pAmount * (this.props.projectedGain / 100)) / 12;
          inflationAdjustedAmount += (inflationAdjustedAmount * (this.props.projectedGain / 100)) / 12;

          // Handle contributions
          if (
            (this.props.advanced && !this.props.yearContributionsStop) ||
            !(this.props.yearContributionsStop && year > this.props.yearContributionsStop)
          ) {
            pAmount += this.props.monthlyContribution;
            pAmount += this.props.monthlyContribution * (this.props.projectedGain / 100);

            inflationAdjustedAmount += this.props.monthlyContribution;
            inflationAdjustedAmount += this.props.monthlyContribution * (this.props.projectedGain / 100);
          }
        }

        // Handle rollover investment
        if (this.props.rollOver && this.props.investmentToRoll && this.props.yearOfRollover == year) {
          pAmount += this.props.investmentToRoll;
          inflationAdjustedAmount += this.props.investmentToRoll;
        }

        // Apply inflation to the inflation-adjusted amount
        if (this.props.depreciationRate) {
          inflationAdjustedAmount -= this.calculateDepreciation(inflationAdjustedAmount, this.props.depreciationRate);
        }

        // Store both values in the growth matrix
        this.props.growthMatrix.push({
          x: addYears(this.today, year),
          y: Math.floor(showInflation ? inflationAdjustedAmount : pAmount),
          alternateY: Math.floor(showInflation ? pAmount : inflationAdjustedAmount),
        });
      }

      return `$${Math.floor(showInflation ? inflationAdjustedAmount : pAmount).toLocaleString()}`;
    } else {
      return '';
    }
  }

  private calculateDepreciation(amount: number, percentageOfDepreciation: number) {
    return amount * (percentageOfDepreciation / 100);
  }

  public getInflationAdjusted(amount: number) {
    return Math.floor(amount - this.calculateDepreciation(amount, this.props.depreciationRate));
  }

  public getGrowthMatrix() {
    return this.props.growthMatrix;
  }

  public getInvestmentId() {
    return this.props.investmentId;
  }

  public getPercentageChange(originalAmount: number, newAmount: number) {
    return Math.floor(((newAmount - originalAmount) / originalAmount) * 100);
  }
}
