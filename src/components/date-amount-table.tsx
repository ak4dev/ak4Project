import { Table } from '@cloudscape-design/components';
import { DateAmountPair } from '../common/types';
import { InvestmentCalculator } from '../common/helpers/investment-growth-calculator';
import {
  returnDateElement,
  returnGrowthText,
  returnInflationAdjustedText,
} from '../common/helpers/date-amount-table-helpers';

export interface DateAmountTableProps {
  investmentCalc: InvestmentCalculator;
}
export default function DateAmountTable({ investmentCalc }: DateAmountTableProps) {
  const items: DateAmountPair[] = investmentCalc.getGrowthMatrix().map((entry) => ({
    date: new Date(entry.x),
    amount: entry.y,
    investmentId: investmentCalc.getInvestmentId(),
    inflationAdjustedAmount: entry.alternateY,
  }));
  const dateAmountTable = (
    <Table
      items={items}
      stripedRows
      columnDefinitions={[
        {
          id: 'date',
          header: 'Date',
          cell: (item: DateAmountPair) => returnDateElement(item, investmentCalc),
          sortingField: 'date',
          isRowHeader: true,
        },
        {
          id: 'graphed-amount',
          header: 'Graphed Amount',
          cell: (item: DateAmountPair) => returnGrowthText(item, investmentCalc),
          sortingField: 'graphed-amount',
        },
        {
          id: 'alt-amount',
          header: 'Alt Amount',
          cell: (item: DateAmountPair) => returnInflationAdjustedText(item, investmentCalc),
          sortingField: 'alt-amount',
        },
      ]}
    />
  );

  return <>{dateAmountTable}</>;
}
