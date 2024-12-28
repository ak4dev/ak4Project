import { APP_NAME } from '../../common/constants';
import { BreadcrumbGroup, ContentLayout, SpaceBetween } from '@cloudscape-design/components';
import { useOnFollow } from '../../common/hooks/use-on-follow';
import BaseAppLayout from '../../components/base-app-layout';
import InvestmentCalculator from '../../components/investment-calculator';

export default function DashboardPage() {
  /*
  Landing page for the application
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
          ]}
        />
      }
      content={
        <ContentLayout>
          <SpaceBetween size="l">
            <InvestmentCalculator />
          </SpaceBetween>
        </ContentLayout>
      }
    />
  );
}
