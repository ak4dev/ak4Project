import { useState } from 'react';
import { TopNavigation } from '@cloudscape-design/components';
import { Mode } from '@cloudscape-design/global-styles';
import { StorageHelper } from '../common/helpers/storage-helper';
import { APP_NAME } from '../common/constants';

export default function GlobalHeader() {
  const [theme, setTheme] = useState<Mode>(StorageHelper.applyTheme(Mode.Dark));

  const onChangeThemeClick = () => {
    /*
    Handle the theme change click event.
    Toggles between light and dark mode, and updates the theme state accordingly.
    Not currently utilized as the theme is always set to dark mode.
    */
    if (theme === Mode.Dark) {
      setTheme(StorageHelper.applyTheme(Mode.Light));
    } else {
      setTheme(StorageHelper.applyTheme(Mode.Dark));
    }
  };

  return (
    <div style={{ zIndex: 1002, top: 0, left: 0, right: 0, position: 'fixed' }} id="awsui-top-navigation">
      <TopNavigation
        identity={{
          href: '/',
          logo: { src: '/images/logo.png', alt: `${APP_NAME}` },
        }}
        utilities={[
          {
            type: 'button',
            text: theme === Mode.Dark ? 'Light Mode' : 'Dark Mode',
            onClick: onChangeThemeClick,
          },
        ]}
      />
    </div>
  );
}
