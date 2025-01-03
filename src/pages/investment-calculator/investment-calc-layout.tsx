import { BreadcrumbGroup } from '@cloudscape-design/components';
import { APP_NAME } from '../../common/constants';
import { useOnFollow } from '../../common/hooks/use-on-follow';
import BaseAppLayout from '../../components/base-app-layout';
import InvestmentCalculator from '../../components/investment-calculator';

export default function InvestmentCalculatorLayout() {
  /*
  Layout for the investment calculator page
  */
  const onFollow = useOnFollow();

  return (
    <BaseAppLayout
      breadcrumbs={
        <BreadcrumbGroup
          onFollow={onFollow}
          items={[
            {
              text: APP_NAME,
              href: '/',
            },
            {
              text: 'Investment Calculator',
              href: '/investment-calculator',
            },
          ]}
        />
      }
      content={<InvestmentCalculator />}
    />
  );
}
