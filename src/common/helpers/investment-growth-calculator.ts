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
        console.log(`YEARTEST ${year}:`, this.props.growthMatrix[year - 1]);
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
            console.log(`pAmount at year ${year}, month ${month}:`, pAmount);
          }
        }
        pAmount += pAmount * (this.props.projectedGain / 100);
        console.log(`ROLLTEST`, this.props.rollOver, this.props.investmentToRoll, this.props.yearOfRollover, year);
        if (this.props.rollOver && this.props.investmentToRoll && this.props.yearOfRollover == year) {
          console.log(`Rolling ${year}`, this.props.growthMatrix && this.props.growthMatrix[year - 1]);
          pAmount += this.props.growthMatrix[year - 1].y;
        }
        if (
          !this.props.yearInvestmentBegins ||
          (this.props.yearInvestmentBegins && year >= this.props.yearInvestmentBegins)
        ) {
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
