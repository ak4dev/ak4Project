import { SideNavigation, SideNavigationProps } from '@cloudscape-design/components';
import { useNavigationPanelState } from '../common/hooks/use-navigation-panel-state';
import { useState } from 'react';
import { useOnFollow } from '../common/hooks/use-on-follow';
import { APP_NAME } from '../common/constants';
import { useLocation } from 'react-router-dom';

export default function NavigationPanel() {
  /*
  Side navigation panel component.
  Handles the navigation panel state and updates the navigation panel items based on the current route
  */
  const location = useLocation();
  const onFollow = useOnFollow();
  const [navigationPanelState, setNavigationPanelState] = useNavigationPanelState();

  const [items] = useState<SideNavigationProps.Item[]>(() => {
    const items: SideNavigationProps.Item[] = [
      {
        type: 'section',
        text: 'Calculators',
        items: [{ type: 'link', text: 'Investment', href: '/investment-calculator' }],
      },
    ];

    items.push({ type: 'divider' });

    return items;
  });

  const onChange = ({ detail }: { detail: SideNavigationProps.ChangeDetail }) => {
    const sectionIndex = items.indexOf(detail.item);
    setNavigationPanelState({
      collapsedSections: {
        ...navigationPanelState.collapsedSections,
        [sectionIndex]: !detail.expanded,
      },
    });
  };

  return (
    <SideNavigation
      onFollow={onFollow}
      onChange={onChange}
      header={{ href: '/', text: APP_NAME }}
      activeHref={location.pathname}
      items={items.map((value, idx) => {
        if (value.type === 'section') {
          const collapsed = navigationPanelState.collapsedSections?.[idx] === true;
          value.defaultExpanded = !collapsed;
        }

        return value;
      })}
    />
  );
}
