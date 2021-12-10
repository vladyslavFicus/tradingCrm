import React, { PureComponent, Suspense } from 'react';
import classNames from 'classnames';
import { getBrand } from 'config';
import PropTypes from 'constants/propTypes';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import BackToTop from 'components/BackToTop';
import DebugMode from 'components/DebugMode';
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

  state = {
    downtime: {
      title: '',
      show: false,
    },
  };

  componentDidMount() {
    this.loadDowntime();
  }

  /**
   * Load downtime content from S3
   *
   * @return {Promise<void>}
   */
  loadDowntime = async () => {
    const response = await fetch(`/cloud-static/DOWNTIME.json?${Math.random()}`);

    let { downtime } = this.state;

    if (response.status === 200) {
      downtime = await response.json();

      this.setState({ downtime });
    }
  };

  render() {
    const {
      children,
      auth,
    } = this.props;

    const { downtime } = this.state;

    const isShowProductionAlert = auth.department === 'ADMINISTRATION' && getBrand().env.includes('prod');
    const isShowDowntimeAlert = downtime.show;

    return (
      <PermissionProvider key={auth.department}>
        <Notifications />

        <Header />
        <Sidebar />

        <main className={classNames(
          'content-container',
          {
            'content-container--padding-bottom': isShowProductionAlert && isShowDowntimeAlert,
          },
        )}
        >
          <ErrorBoundary>
            <Suspense fallback={<ShortLoader />}>
              {children}
            </Suspense>
          </ErrorBoundary>
        </main>

        <BackToTop />

        {/* Notify users about downtime */}
        <If condition={isShowDowntimeAlert}>
          <div className="downtime-footer">
            {downtime.title}
          </div>
        </If>

        {/* Notify ADMINISTRATION role if it's production environment */}
        <If condition={isShowProductionAlert}>
          <div className="production-footer">
            <span role="img" aria-label="fire">==== 🔥 PRODUCTION 🔥 ====</span>
          </div>
        </If>

        {/* Show debug mode alert */}
        <DebugMode />
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
