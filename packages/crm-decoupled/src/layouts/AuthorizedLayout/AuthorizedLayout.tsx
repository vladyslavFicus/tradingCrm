import React, { Suspense, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import classNames from 'classnames';
import {
  Config,
  AutoLogoutProvider,
  ConfigProvider,
  useStorageState, Auth,
  PermissionProvider,
  ModalProvider,
  LightboxProvider,
} from '@crm/common';
import RSocketProvider from 'rsocket';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import BackToTop from 'components/BackToTop';
import DebugMode from 'components/DebugMode';
import ShortLoader from 'components/ShortLoader';
import ErrorBoundary from 'components/ErrorBoundary';
import Notifications from 'components/Notifications';
import ForbiddenChecker from './components/ForbiddenChecker';
import './AuthorizedLayout.scss';

const AuthorizedLayout = () => {
  const [downtime, setDowntime] = useState({ title: '', show: false });

  // ===== Storage ===== //
  const [token] = useStorageState<string>('token');
  const [auth] = useStorageState<Auth | undefined>('auth');

  // ===== Effects ===== //
  useEffect(() => {
    (async () => {
      const response = await fetch(`/cloud-static/DOWNTIME.json?${Math.random()}`);

      const responseDowntime = await response.json();

      if (response.status === 200 && responseDowntime?.show) {
        setDowntime(responseDowntime);
      }
    })();
  }, []);

  const sidebarPosition = Config.getBackofficeBrand()?.sidebarPosition || 'left';
  const isShowProductionAlert = auth?.department === 'ADMINISTRATION' && Config.getBrand()?.env?.includes('prod');

  return (
    <Choose>
      <When condition={!token || !auth}>
        <Navigate replace to="/sign-in" />
      </When>

      <Otherwise>
        <RSocketProvider>
          <ConfigProvider>
            <AutoLogoutProvider>
              <PermissionProvider>
                <LightboxProvider>
                  <ModalProvider>
                    <Notifications />

                    <Header />

                    <Sidebar position={sidebarPosition} />

                    <main className={classNames(
                      'content-container',
                      `content-container--padding-${sidebarPosition}`,
                      {
                        'content-container--padding-bottom': isShowProductionAlert && downtime.show,
                      },
                    )}
                    >
                      <ForbiddenChecker>
                        <ErrorBoundary>
                          <Suspense fallback={<ShortLoader />}>
                            <Outlet />
                          </Suspense>
                        </ErrorBoundary>
                      </ForbiddenChecker>
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
                  </ModalProvider>
                </LightboxProvider>
              </PermissionProvider>
            </AutoLogoutProvider>
          </ConfigProvider>
        </RSocketProvider>
      </Otherwise>
    </Choose>
  );
};

export default React.memo(AuthorizedLayout);
