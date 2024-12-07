export interface NavigationPanelState {
  collapsed?: boolean;
  collapsedSections?: Record<number, boolean>;
}

export interface InvestmentCalculatorProps {
  currentAmount: string | undefined;
  setCurrentAmount: (value: string | undefined) => void;
  projectedGain: number;
  setProjectedGain: (value: number) => void;
  yearsOfGrowth: number;
  setYearsOfGrowth: (value: number) => void;
  yearWithdrawalsBegin: number;
  setYearWithdrawalsBegin: (value: number) => void;
  monthlyWithdrawal: number;
  setMonthlyWithdrawal: (value: number) => void;
  monthlyContribution: number;
  setMonthlyContribution: (value: number) => void;
  yearContributionsStop: number | undefined;
  setYearContributionsStop: (value: number | undefined) => void;
  growthMatrix: { x: Date; y: number }[];
  maxMonthlyWithdrawal: number;
  rollOver?: boolean;
  advanced?: boolean;
  investmentToRoll?: number;
  yearOfRollover?: number;
}
