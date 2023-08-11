import React, { Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import classNames from 'classnames';
import {
  AutoLogoutProvider,
  ConfigProvider,
  PermissionProvider,
  ModalProvider,
  LightboxProvider,
  RSocketProvider,
  useAuthorizedLayout,
} from '@crm/common';
import { ErrorBoundary, DebugMode, ForbiddenChecker } from 'components';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import BackToTop from 'components/BackToTop';
import ShortLoader from 'components/ShortLoader';
import Notifications from 'components/Notifications';
import './AuthorizedLayout.scss';

const AuthorizedLayout = () => {
  const {
    sidebarPosition,
    isShowProductionAlert,
    token,
    auth,
    downtime,
  } = useAuthorizedLayout();

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
