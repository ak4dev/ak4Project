import { AppLayout, AppLayoutProps } from '@cloudscape-design/components';
import { useNavigationPanelState } from '../common/hooks/use-navigation-panel-state';
import NavigationPanel from './navigation-panel';

/**
 * Base Application Layout Component
 * 
 * Provides the main layout structure for all pages using Cloudscape's AppLayout.
 * Manages navigation panel state and provides consistent layout behavior across the app.
 * 
 * Features:
 * - Persistent navigation panel state
 * - Responsive navigation panel behavior
 * - Consistent header integration
 * - Tools panel hidden by default
 */
export default function BaseAppLayout(props: AppLayoutProps) {
  // Manage navigation panel collapse/expand state
  const [navigationPanelState, setNavigationPanelState] = useNavigationPanelState();

  /**
   * Handle navigation panel open/close events
   * Updates the persistent state when user toggles the panel
   */
  const handleNavigationChange = ({ detail }: { detail: { open: boolean } }) => {
    setNavigationPanelState({ collapsed: !detail.open });
  };

  return (
    <AppLayout
      // Header integration selector for global navigation
      headerSelector="#awsui-top-navigation"
      
      // Navigation panel configuration
      navigation={<NavigationPanel />}
      navigationOpen={!navigationPanelState.collapsed}
      onNavigationChange={handleNavigationChange}
      
      // Hide tools panel (not used in this application)
      toolsHide={true}
      
      // Spread any additional props passed to the component
      {...props}
    />
  );
}
