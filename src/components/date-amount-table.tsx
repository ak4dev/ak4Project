import { Table } from '@cloudscape-design/components';
import { DateAmountPair } from '../common/types';
import { InvestmentCalculator } from '../common/helpers/investment-growth-calculator';

export interface DateAmountTableProps {
  investmentCalc: InvestmentCalculator;
}
export default function DateAmountTable({ investmentCalc }: DateAmountTableProps) {
  const items: DateAmountPair[] = investmentCalc.getGrowthMatrix().map((entry) => ({
    date: new Date(entry.x),
    amount: entry.y,
    investmentId: investmentCalc.getInvestmentId(),
    inflationAdjustedAmount: investmentCalc.getInflationAdjusted(entry.y),
  }));
  const dateAmountTable = (
    <Table
      items={items}
      stripedRows
      columnDefinitions={[
        {
          id: 'date',
          header: 'Date',
          cell: (item: DateAmountPair) => item.date.toLocaleDateString(),
          sortingField: 'date',
          isRowHeader: true,
        },
        {
          id: 'amount',
          header: 'Amount',
          cell: (item: DateAmountPair) => `$${item.amount.toLocaleString()}`,
          sortingField: 'amount',
        },
        {
          id: 'inflation-adjusted',
          header: 'Inflation Adjusted',
          cell: (item: DateAmountPair) => item.inflationAdjusted && `$${item.inflationAdjusted.toLocaleString()}`,
          sortingField: 'amount',
        },
      ]}
    />
  );

  return <>{dateAmountTable}</>;
}
