import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import { Types } from '@crm/common';
import { Operator } from '__generated__/types';
import Link from 'components/Link';
import MiniProfilePopover from 'components/MiniProfilePopover';
import { Table, Column } from 'components/Table';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import Uuid from 'components/Uuid';
import { statusesLabels, statuses } from 'constants/operators';
import './OperatorsGrid.scss';

type Props = {
  content: Array<Operator>,
  loading: boolean,
  last: boolean,
  onFetchMore: () => void,
  onSort: (sorts: Types.Sorts) => void,
};

const OperatorsGrid = (props: Props) => {
  const {
    content,
    loading,
    last,
    onFetchMore,
    onSort,
  } = props;

  const renderOperator = ({ uuid, fullName }: Operator) => (
    <>
      <Link className="OperatorsGrid__name" to={`/operators/${uuid}`}>
        {fullName}
      </Link>

      <div className="OperatorsGrid__uuid">
        <MiniProfilePopover uuid={uuid} type="operator">
          <Uuid uuid={uuid} />
        </MiniProfilePopover>
      </div>
    </>
  );

  const renderCountry = ({ country }: Operator) => {
    if (!country) {
      return <span>&mdash;</span>;
    }

    return <CountryLabelWithFlag code={country} height="14" />;
  };

  const renderRegistered = ({ registrationDate }: Operator) => (
    <>
      <div className="OperatorsGrid__registration-date">
        {moment.utc(registrationDate || '').local().format('DD.MM.YYYY')}
      </div>

      <div className="OperatorsGrid__registration-time">
        {moment.utc(registrationDate || '').local().format('HH:mm')}
      </div>
    </>
  );

  const renderStatus = ({ operatorStatus, statusChangeDate }: Operator) => (
    <>
      <div
        className={
          classNames(
            'OperatorsGrid__status-name',
            { 'OperatorsGrid__status-name--active': operatorStatus === 'ACTIVE' },
            { 'OperatorsGrid__status-name--closed': operatorStatus === 'CLOSED' },
            { 'OperatorsGrid__status-name--inactive': operatorStatus === 'INACTIVE' },
          )
        }
      >
        {I18n.t(statusesLabels[operatorStatus as statuses])}
      </div>

      <If condition={!!statusChangeDate}>
        <div className="OperatorsGrid__status-date">
          {I18n.t('COMMON.SINCE', { date: moment.utc(statusChangeDate || '').local().format('DD.MM.YYYY') })}
        </div>
      </If>
    </>
  );

  return (
    <div className="OperatorsGrid">
      <Table
        stickyFromTop={137}
        items={content}
        loading={loading}
        hasMore={!last}
        onMore={onFetchMore}
        onSort={onSort}
      >
        <Column
          sortBy="firstName"
          header={I18n.t('OPERATORS.GRID_HEADER.OPERATOR')}
          render={renderOperator}
        />

        <Column
          sortBy="country"
          header={I18n.t('OPERATORS.GRID_HEADER.COUNTRY')}
          render={renderCountry}
        />

        <Column
          sortBy="registrationDate"
          header={I18n.t('OPERATORS.GRID_HEADER.REGISTERED')}
          render={renderRegistered}
        />

        <Column
          sortBy="operatorStatus"
          header={I18n.t('OPERATORS.GRID_HEADER.STATUS')}
          render={renderStatus}
        />
      </Table>
    </div>
  );
};

export default React.memo(OperatorsGrid);
