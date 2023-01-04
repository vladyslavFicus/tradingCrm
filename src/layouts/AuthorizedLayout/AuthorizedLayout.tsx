import React, { Suspense, useEffect, useState } from 'react';
import compose from 'compose-function';
import classNames from 'classnames';
import RSocketProvider from 'rsocket';
import { getBrand, getBackofficeBrand } from 'config';
import ConfigProvider from 'providers/ConfigProvider';
import { withStorage } from 'providers/StorageProvider';
import PermissionProvider from 'providers/PermissionsProvider';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import BackToTop from 'components/BackToTop';
import DebugMode from 'components/DebugMode';
import ShortLoader from 'components/ShortLoader';
import ErrorBoundary from 'components/ErrorBoundary';
import Notifications from 'components/WS/Notifications';
import './AuthorizedLayout.scss';

type Auth = {
  department: string,
  role: string,
  uuid: string,
};

type Props = {
  auth: Auth,
  children: React.ReactNode,
};

const AuthorizedLayout = (props: Props) => {
  const { auth, children } = props;

  const [downtime, setDowntime] = useState({ title: '', show: false });

  useEffect(() => {
    (async () => {
      const response = await fetch(`/cloud-static/DOWNTIME.json?${Math.random()}`);

      const responseDowntime = await response.json();

      if (response.status === 200 && responseDowntime?.show) {
        setDowntime(responseDowntime);
      }
    })();
  }, []);

  const sidebarPosition = getBackofficeBrand()?.sidebarPosition || 'left';
  const isShowProductionAlert = auth.department === 'ADMINISTRATION' && getBrand().env?.includes('prod');

  return (
    <RSocketProvider>
      <ConfigProvider>
        <PermissionProvider key={auth.department}>
          <Notifications />

          <Header />

          <Sidebar
            // @ts-ignore Component withRouter HOC types issue
            position={sidebarPosition}
          />

          <main className={classNames(
            'content-container',
            `content-container--padding-${sidebarPosition}`,
            {
              'content-container--padding-bottom': isShowProductionAlert && downtime.show,
            },
          )}
          >
            <ErrorBoundary>
              <Suspense fallback={<ShortLoader />}>
                {children}
              </Suspense>
            </ErrorBoundary>
          </main>

          <BackToTop position={sidebarPosition} />

          {/* Notify users about downtime */}
          <If condition={downtime.show}>
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
      </ConfigProvider>
    </RSocketProvider>
  );
};

export default compose(
  React.memo,
  withStorage(['auth']),
)(AuthorizedLayout);
