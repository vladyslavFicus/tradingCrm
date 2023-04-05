import React, { Suspense } from 'react';
import ModalProvider from 'providers/ModalProvider';
import { getCrmBrandStaticFileUrl } from 'config';
import './UnauthorizedLayout.scss';

type Props = {
  children: React.ReactNode,
};

const UnauthorizedLayout = ({ children }: Props) => (
  <Suspense fallback={null}>
    <ModalProvider>
      <div
        className="UnauthorizedLayout"
        style={{ backgroundImage: `url(${getCrmBrandStaticFileUrl('assets/auth-background.svg')})` }}
      >
        {children}
      </div>
    </ModalProvider>
  </Suspense>
);

export default UnauthorizedLayout;
