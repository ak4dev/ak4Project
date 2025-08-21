/**
 * Type Definitions
 *
 * Contains all TypeScript interfaces and types used throughout the application.
 * Organized by feature area for better maintainability.
 */

// ============================================================================
// Navigation Types
// ============================================================================

/**
 * State management for the navigation panel
 */
export interface NavigationPanelState {
  /** Whether the navigation panel is collapsed */
  collapsed?: boolean;
  /** Track which navigation sections are collapsed by index */
  collapsedSections?: Record<number, boolean>;
}

// ============================================================================
// Investment Calculator Types
// ============================================================================

/**
 * Complete configuration and state for an investment calculator instance
 * Includes both input parameters and state management functions
 */
export interface InvestmentCalculatorProps {
  // Core Investment Parameters
  /** Initial investment amount as string for input handling */
  currentAmount: string | undefined;
  setCurrentAmount: (value: string | undefined) => void;

  /** Expected annual return percentage */
  projectedGain: number;
  setProjectedGain: (value: number) => void;

  /** Total years to calculate growth */
  yearsOfGrowth: number;
  setYearsOfGrowth: (value: number) => void;

  // Advanced Parameters
  /** Year when withdrawals should begin */
  yearWithdrawalsBegin: number;
  setYearWithdrawalsBegin: (value: number) => void;

  /** Monthly withdrawal amount */
  monthlyWithdrawal: number;
  setMonthlyWithdrawal: (value: number) => void;

  /** Monthly contribution amount */
  monthlyContribution: number;
  setMonthlyContribution: (value: number) => void;

  /** Year when contributions should stop */
  yearContributionsStop: number | undefined;
  setYearContributionsStop: (value: number | undefined) => void;

  // Configuration & Limits
  /** Maximum allowed monthly withdrawal */
  maxMonthlyWithdrawal: number;

  /** Annual inflation/depreciation rate */
  depreciationRate: number;

  /** Unique identifier for this investment */
  investmentId: string;

  // Advanced Features
  /** Whether advanced features are enabled */
  advanced?: boolean;

  /** Whether this investment should roll over from another */
  rollOver?: boolean;

  /** Amount to roll over from another investment */
  investmentToRoll?: number;

  /** Year when rollover should occur */
  yearOfRollover?: number;

  // Data Storage
  /** Array storing calculated growth data for charting */
  growthMatrix: LineGraphEntry[];
}

/**
 * Data structure for date-amount pairs used in tables and calculations
 */
export interface DateAmountPair {
  /** The date for this data point */
  date: Date;

  /** The nominal amount at this date */
  amount: number;

  /** The inflation-adjusted amount at this date */
  inflationAdjustedAmount: number;

  /** Which investment this data belongs to */
  investmentId: string;
}

/**
 * Data structure for line graph entries
 * Used by the charting component to display investment growth over time
 */
export interface LineGraphEntry {
  /** Date for the x-axis */
  x: Date;

  /** Primary value for the y-axis (nominal or inflation-adjusted) */
  y: number;

  /** Alternative value for comparison (inflation-adjusted or nominal) */
  alternateY: number;
}
