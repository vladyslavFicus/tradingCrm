import React, { Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getCrmBrandStaticFileUrl } from 'config';
import ModalProvider from 'providers/ModalProvider';
import { useStorageState, Auth } from 'providers/StorageProvider';
import './UnauthorizedLayout.scss';

type Props = {
  skipCheck?: boolean,
};

const UnauthorizedLayout = (props: Props) => {
  // ===== Storage ===== //
  const [token] = useStorageState<string>('token');
  const [auth] = useStorageState<Auth | undefined>('auth');

  return (
    <Choose>
      {/* Redirect to index route when token exist */}
      <When condition={!!token && !!auth && !props.skipCheck}>
        <Navigate replace to="/dashboard" />
      </When>

      <Otherwise>
        <Suspense fallback={null}>
          <ModalProvider>
            <div
              className="UnauthorizedLayout"
              style={{ backgroundImage: `url(${getCrmBrandStaticFileUrl('assets/auth-background.svg')})` }}
            >
              <Outlet />
            </div>
          </ModalProvider>
        </Suspense>
      </Otherwise>
    </Choose>
  );
};

export default React.memo(UnauthorizedLayout);
