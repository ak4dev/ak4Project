import { addYears } from 'date-fns';
import { InvestmentCalculatorProps } from '../types';

export class InvestmentCalculator {
  props: InvestmentCalculatorProps;
  private today: Date = new Date();
  private thisMonth: number = this.today.getMonth();
  static props: InvestmentCalculatorProps;

  constructor(investmentCalculatorProps: InvestmentCalculatorProps) {
    this.props = investmentCalculatorProps;
  }
  public calculateGrowth(showInflation: boolean): string {
    if (!(this.props.currentAmount && this.props.projectedGain && this.props.yearsOfGrowth)) {
      return '';
    }

    let pAmount = parseInt(this.props.currentAmount) || 0;
    let inflationAdjustedAmount = pAmount;
    const monthlyGrowthRate = this.props.projectedGain / 100 / 12;

    for (let year = 0; year <= this.props.yearsOfGrowth; year++) {
      const startMonth = year === 0 ? this.thisMonth : 0;
      console.log(`YEAR WITHDRAWALS BEGIN:`, this.props.yearWithdrawalsBegin);
      for (let month = startMonth; month < 12; month++) {
        // Handle withdrawals
        if (this.shouldApplyWithdrawal(year, month)) {
          pAmount -= this.props.monthlyWithdrawal;
          inflationAdjustedAmount -= this.props.monthlyWithdrawal;
        }

        // Apply monthly growth
        pAmount += pAmount * monthlyGrowthRate;
        inflationAdjustedAmount += inflationAdjustedAmount * monthlyGrowthRate;

        // Handle contributions
        if (this.shouldApplyContribution(year, month)) {
          const contribution = this.props.monthlyContribution;
          const contributionGrowth = contribution * monthlyGrowthRate;

          pAmount += contribution + contributionGrowth;
          inflationAdjustedAmount += contribution + contributionGrowth;
        }
      }

      // Handle one-time rollover investment
      if (this.shouldApplyRollover(year)) {
        pAmount += this.props.investmentToRoll || 0;
        inflationAdjustedAmount += this.props.investmentToRoll || 0;
      }

      // Apply yearly inflation adjustment
      if (this.props.depreciationRate) {
        inflationAdjustedAmount -= this.calculateDepreciation(inflationAdjustedAmount, this.props.depreciationRate);
      }

      // Store growth data
      this.props.growthMatrix.push({
        x: addYears(this.today, year),
        y: Math.floor(showInflation ? inflationAdjustedAmount : pAmount),
        alternateY: Math.floor(showInflation ? pAmount : inflationAdjustedAmount),
      });
    }

    return `$${Math.floor(showInflation ? inflationAdjustedAmount : pAmount).toLocaleString()}`;
  }

  private shouldApplyWithdrawal(year: number, month: number): boolean {
    // Change the check to explicitly check for undefined or null
    if (
      !this.props.advanced ||
      !this.props.monthlyWithdrawal ||
      this.props.yearWithdrawalsBegin === undefined ||
      this.props.yearWithdrawalsBegin === null
    ) {
      return false;
    }

    if (year === 0) {
      // If withdrawals should start in year 0, apply them from thisMonth onwards
      if (this.props.yearWithdrawalsBegin === 0) {
        return month >= this.thisMonth;
      }
      return false;
    }

    return year > this.props.yearWithdrawalsBegin || (year === this.props.yearWithdrawalsBegin && month >= 0);
  }

  private shouldApplyContribution(year: number, month: number): boolean {
    if (!this.props.advanced || !this.props.yearContributionsStop) {
      return true;
    }

    if (year === 0) {
      return month >= this.thisMonth;
    }

    return (
      year < this.props.yearContributionsStop || (year === this.props.yearContributionsStop && month < this.thisMonth)
    );
  }

  private shouldApplyRollover(year: number): boolean {
    return (
      Boolean(this.props.rollOver) &&
      Boolean(this.props.investmentToRoll) &&
      this.props.yearOfRollover != null &&
      Number(this.props.yearOfRollover) === year
    );
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
