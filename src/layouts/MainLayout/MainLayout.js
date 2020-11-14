import React, { PureComponent, Suspense } from 'react';
import { getBrand } from 'config';
import PropTypes from 'constants/propTypes';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import BackToTop from 'components/BackToTop';
import ShortLoader from 'components/ShortLoader';
import ErrorBoundary from 'components/ErrorBoundary';
import Notifications from 'components/WS/Notifications';
import { withStorage } from 'providers/StorageProvider';
import PermissionProvider from 'providers/PermissionsProvider';
import ConfigProvider from 'providers/ConfigProvider';
import './MainLayout.scss';


class MainLayout extends PureComponent {
  static propTypes = {
    children: PropTypes.any.isRequired,
    auth: PropTypes.auth.isRequired,
  };

  render() {
    const {
      children,
      auth,
    } = this.props;

    const isShowProductionAlert = auth.department === 'ADMINISTRATION' && getBrand().env.includes('prod');

    return (
      <PermissionProvider key={auth.department}>
        <Notifications />

        <Header />

        <Sidebar />

        <main className="content-container">
          <ErrorBoundary>
            <Suspense fallback={<ShortLoader />}>
              {children}
            </Suspense>
          </ErrorBoundary>
        </main>

        <BackToTop />

        {/* Notify ADMINISTRATION role if it's production environment */}
        <If condition={isShowProductionAlert}>
          <div className="production-footer">
            <span role="img" aria-label="fire">==== 🔥 PRODUCTION 🔥 ====</span>
          </div>
        </If>
      </PermissionProvider>
    );
  }
}

/**
 * Container to download brand config before MainLayout rendering
 *
 * @param props
 *
 * @return {JSX.Element}
 * @constructor
 */
const MainLayoutContainer = props => (
  <ConfigProvider>
    <MainLayout {...props} />
  </ConfigProvider>
);

export default withStorage(['auth'])(MainLayoutContainer);
