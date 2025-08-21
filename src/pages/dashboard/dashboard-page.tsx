import { BreadcrumbGroup, ContentLayout, SpaceBetween } from '@cloudscape-design/components';

import { APP_NAME } from '../../common/constants';
import { useOnFollow } from '../../common/hooks/use-on-follow';
import BaseAppLayout from '../../components/base-app-layout';
import InvestmentCalculator from '../../components/investment-calculator';

/**
 * Dashboard Page Component
 * 
 * The main landing page of the application featuring the investment calculator.
 * Provides a clean, focused interface for users to perform investment calculations
 * and visualize their investment growth over time.
 * 
 * Features:
 * - Investment calculator with basic and advanced modes
 * - Interactive charts and data visualization
 * - Breadcrumb navigation
 * - Responsive layout
 */
export default function DashboardPage() {
  // Handle breadcrumb navigation events
  const onFollow = useOnFollow();

  // Define breadcrumb navigation structure
  const breadcrumbItems = [
    {
      text: APP_NAME,
      href: '/',
    },
  ];

  return (
    <BaseAppLayout
      breadcrumbs={
        <BreadcrumbGroup
          onFollow={onFollow}
          items={breadcrumbItems}
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
