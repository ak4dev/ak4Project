import { addYears } from 'date-fns';
import { InvestmentCalculatorProps } from '../types';

export class InvestmentCalculator {
  props: InvestmentCalculatorProps;
  today: Date = new Date();
  static props: InvestmentCalculatorProps;

  constructor(investmentCalculatorProps: InvestmentCalculatorProps) {
    this.props = investmentCalculatorProps;
  }
  public calculateGrowth(inflationAdjusted?: boolean | undefined): string {
    const thisMonth = this.today.getMonth();
    if (this.props.currentAmount && this.props.projectedGain && this.props.yearsOfGrowth) {
      let pAmount = parseInt(this.props.currentAmount) || 0;
      for (let year = 0; year < this.props.yearsOfGrowth; year++) {
        // Calculate monthly changes
        for (let month = year == 0 ? thisMonth : 0; month < 12; month++) {
          console.log(`pAmount month ${month} year ${year}`, pAmount);
          if (this.props.advanced && this.props.monthlyWithdrawal && this.props.yearWithdrawalsBegin) {
            if (this.props.yearWithdrawalsBegin && year >= this.props.yearWithdrawalsBegin) {
              pAmount -= this.props.monthlyWithdrawal; // Handles monthly withdrawals
            }
          }
          pAmount += (pAmount * (this.props.projectedGain / 100)) / 12;
          if (
            (this.props.advanced && !this.props.yearContributionsStop) ||
            !(this.props.yearContributionsStop && year > this.props.yearContributionsStop)
          ) {
            pAmount += this.props.monthlyContribution; // Handles adding monthly contributions
            pAmount += this.props.monthlyContribution * (this.props.projectedGain / 100);
          }
        }

        if (this.props.rollOver && this.props.investmentToRoll && this.props.yearOfRollover == year) {
          pAmount += this.props.investmentToRoll; // Handles rolling investment A into B
        }
        if (inflationAdjusted && this.props.depreciationRate) {
          pAmount -= this.calculateDepreciation(pAmount, this.props.depreciationRate);
        }
        if (true) {
          this.props.growthMatrix.push({
            x: addYears(this.today, year),
            y: Math.floor(pAmount),
          });
        }
      }

      return `$${pAmount.toLocaleString()}`;
    } else {
      return '';
    }
  }

  private calculateDepreciation(amount: number, percentageOfDepreciation: number) {
    return amount * (percentageOfDepreciation / 100);
  }

  public getInflationAdjusted(amount:number) {
    return amount - (amount * this.props.depreciationRate)
  }

  public getGrowthMatrix() {
    return this.props.growthMatrix;
  }

  public getInvestmentId() {
    return this.props.investmentId;
  }
}
