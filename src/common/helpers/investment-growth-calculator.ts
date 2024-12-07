import { addYears } from 'date-fns';
import { InvestmentCalculatorProps } from '../types';

export class InvestmentCalculator {
  props: InvestmentCalculatorProps;
  static props: InvestmentCalculatorProps;

  constructor(investmentCalculatorProps: InvestmentCalculatorProps) {
    this.props = investmentCalculatorProps;
  }
  public calculateGrowth(): string {
    const today = new Date();
    if (this.props.currentAmount && this.props.projectedGain && this.props.yearsOfGrowth) {
      let pAmount = parseInt(this.props.currentAmount) || 0;
      for (let year = 0; year < this.props.yearsOfGrowth; year++) {
        for (let month = 0; month < 12; month++) {
          if (this.props.advanced && this.props.monthlyWithdrawal && this.props.yearWithdrawalsBegin) {
            if (this.props.yearWithdrawalsBegin && year >= this.props.yearWithdrawalsBegin) {
              pAmount -= this.props.monthlyWithdrawal;
            }
          }
          if (
            (this.props.advanced && !this.props.yearContributionsStop) ||
            !(this.props.yearContributionsStop && year > this.props.yearContributionsStop)
          ) {
            pAmount += this.props.monthlyContribution;
            pAmount += this.props.monthlyContribution * (this.props.projectedGain / 100);
          }
        }
        pAmount += pAmount * (this.props.projectedGain / 100);
        if (this.props.rollOver && this.props.investmentToRoll && this.props.yearOfRollover == year) {
          pAmount += this.props.investmentToRoll;
        }
        if (true) {
          this.props.growthMatrix.push({
            x: addYears(today, year),
            y: Math.floor(pAmount),
          });
        }
      }

      return `$${pAmount.toLocaleString()}`;
    } else {
      return '';
    }
  }
}
