import React, { useCallback } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import { Sorts, TableSelection } from 'types';
import { Partner } from '__generated__/types';
import Link from 'components/Link';
import { Table, Column } from 'components/Table';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import Uuid from 'components/Uuid';
import { statuses } from 'routes/Partners/constants';
import './PartnersGrid.scss';

type Props = {
  content: Array<Partner>,
  loading: boolean,
  totalElements: number,
  last: boolean,
  onFetchMore: () => void,
  onSort: (sorts: Sorts) => void,
  onSelect: (select: TableSelection) => void,
};

const PartnersGrid = (props: Props) => {
  const {
    content,
    loading,
    totalElements,
    last,
    onFetchMore,
    onSort,
    onSelect,
  } = props;

  // ===== Renders ===== //
  const renderPartner = useCallback(({ uuid, fullName }: Partner) => (
    <>
      <Link className="PartnersGrid__name" to={`/partners/${uuid}`}>{fullName}</Link>
      <div className="PartnersGrid__uuid">
        <Uuid uuid={uuid} />
      </div>
    </>
  ), []);

  const renderExternalAffiliateId = useCallback(({ externalAffiliateId }: Partner) => (
    <If condition={!!externalAffiliateId}>
      <div>{externalAffiliateId}</div>
    </If>
  ), []);

  const renderCountry = useCallback(({ country }: Partner) => (
    <Choose>
      <When condition={!!country}>
        <CountryLabelWithFlag code={country} height="14" />
      </When>

      <Otherwise>
        &mdash;
      </Otherwise>
    </Choose>
  ), []);

  const renderRegistered = useCallback(({ createdAt }: Partner) => (
    <>
      <div className="PartnersGrid__registration-date">
        {moment.utc(createdAt || '').local().format('DD.MM.YYYY')}
      </div>

      <div className="PartnersGrid__registration-time">
        {moment.utc(createdAt || '').local().format('HH:mm')}
      </div>
    </>
  ), []);

  const renderStatus = useCallback(({ status, statusChangeDate }: Partner) => (
    <>
      <div
        className={
          classNames(
            'PartnersGrid__status-name',
            { 'PartnersGrid__status-name--active': status === statuses.ACTIVE },
            { 'PartnersGrid__status-name--closed': status === statuses.CLOSED },
            { 'PartnersGrid__status-name--inactive': status === statuses.INACTIVE },
          )
        }
      >
        {status}
      </div>

      <If condition={!!statusChangeDate}>
        <div className="PartnersGrid__status-date">
          {I18n.t('COMMON.SINCE', { date: moment.utc(statusChangeDate || '').local().format('DD.MM.YYYY') })}
        </div>
      </If>
    </>
  ), []);

  return (
    <div className="PartnersGrid">
      <Table
        withMultiSelect
        stickyFromTop={162}
        items={content}
        loading={loading}
        totalCount={totalElements}
        hasMore={!last}
        onMore={onFetchMore}
        onSort={onSort}
        onSelect={onSelect}
      >
        <Column
          sortBy="firstName"
          header={I18n.t('PARTNERS.GRID_HEADER.PARTNER')}
          render={renderPartner}
        />

        <Column
          header={I18n.t('PARTNERS.GRID_HEADER.EXTERNAL_ID')}
          render={renderExternalAffiliateId}
        />

        <Column
          sortBy="country"
          header={I18n.t('PARTNERS.GRID_HEADER.COUNTRY')}
          render={renderCountry}
        />

        <Column
          sortBy="createdAt"
          header={I18n.t('PARTNERS.GRID_HEADER.REGISTERED')}
          render={renderRegistered}
        />

        <Column
          sortBy="status"
          header={I18n.t('PARTNERS.GRID_HEADER.STATUS')}
          render={renderStatus}
        />
      </Table>
    </div>
  );
};

export default React.memo(PartnersGrid);
