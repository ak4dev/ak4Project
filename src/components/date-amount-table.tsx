import { Table } from '@cloudscape-design/components';
import { DateAmountPair } from '../common/types';

export interface DateAmountTableProps {
  items: DateAmountPair[];
}
export default function DateAmountTable({ items }: DateAmountTableProps) {
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
          cell: (item: DateAmountPair) => item.amount,
          sortingField: 'amount',
        },
      ]}
    />
  );

  return <>{dateAmountTable}</>;
}
