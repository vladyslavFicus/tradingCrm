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
  ErrorBoundary,
  DebugMode,
  ForbiddenChecker,
  CircleLoader } from '@crm/common';
import './AuthorizedLayout.scss';

const AuthorizedLayout = () => {
  const {
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
                    {/* TODO: add Notifications */}
                    {/* <Notifications /> */}

                    {/* TODO: add Sidebar */}
                    {/* <Sidebar /> */}

                    <main className={classNames(
                      'content-container',
                      {
                        'content-container--padding-bottom': isShowProductionAlert && downtime.show,
                      },
                    )}
                    >
                      <ForbiddenChecker>
                        <ErrorBoundary>
                          <Suspense fallback={<CircleLoader />}>
                            <Outlet />
                          </Suspense>
                        </ErrorBoundary>
                      </ForbiddenChecker>
                    </main>

                    {/* <BackToTop position={sidebarPosition} /> */}

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
