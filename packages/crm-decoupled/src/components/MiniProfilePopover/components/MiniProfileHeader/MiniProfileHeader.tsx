import React from 'react';
import Uuid from 'components/Uuid';
import './MiniProfileHeader.scss';

type Props = {
  type: string,
  title: string,
  children?: React.ReactNode,
  label?: string,
  uuid?: string,
  uuidDesctiption?: string,
  KYCStatus?: string,
  age?: string | null,
}

const MiniProfileHeader = (props: Props) => {
  const { type, title, children, label, uuid = '', uuidDesctiption, KYCStatus, age } = props;

  return (
    <div className="MiniProfileHeader">
      <If condition={!!label}>
        <div className="MiniProfileHeader__label">{label}</div>
      </If>

      <div className="MiniProfileHeader__type">{type}</div>

      <div className="MiniProfileHeader__title">
        <span className="MiniProfileHeader__title-name">{title}</span>

        <If condition={!!age}>
          {` (${age})`}
        </If>

        <If condition={KYCStatus === 'APPROVED'}>
          <i className="fa fa-check MiniProfileHeader__title-approvedIcon" />
        </If>
      </div>

      <div className="MiniProfileHeader__ids">
        <Uuid uuid={uuid} />

        <If condition={!!uuidDesctiption}>
          {` - ${uuidDesctiption}`}
        </If>
      </div>

      {children}
    </div>
  );
};

export default React.memo(MiniProfileHeader);
