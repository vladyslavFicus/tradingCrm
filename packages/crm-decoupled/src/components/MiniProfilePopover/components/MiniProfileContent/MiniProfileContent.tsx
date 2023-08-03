import React from 'react';
import './MiniProfileContent.scss';

type Props = {
  children: React.ReactNode,
}

const MiniProfileContent = (props: Props) => (
  <table className="MiniProfileContent">
    <tbody>
      {props.children}
    </tbody>
  </table>
);

export default React.memo(MiniProfileContent);
