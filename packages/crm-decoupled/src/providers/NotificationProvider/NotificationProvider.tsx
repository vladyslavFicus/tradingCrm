import 'react-toastify/dist/ReactToastify.css';

import React from 'react';
import { ToastContainer } from 'react-toastify';
import './NotificationProvider.scss';

type Props = {
  children: React.ReactNode,
};

const NotificationProvider = (props: Props) => (
  <>
    <ToastContainer
      newestOnTop
      hideProgressBar
      className="NotificationProvider"
      closeOnClick={false}
      position="bottom-right"
    />
    {props.children}
  </>
);

export default React.memo(NotificationProvider);
