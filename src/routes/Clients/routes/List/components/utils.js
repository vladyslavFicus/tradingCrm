/* eslint-disable react/prop-types */
import React, { Fragment } from 'react';
import moment from 'moment';
import { get } from 'lodash';
import {
  statusColorNames as userStatusColorNames,
  statusesLabels as userStatusesLabels,
} from '../../../../../constants/user';
import { salesStatuses, salesStatusesColor } from '../../../../../constants/salesStatuses';
import { retentionStatuses, retentionStatusesColor } from './constants';
import GridPlayerInfo from '../../../../../components/GridPlayerInfo';
import CountryLabelWithFlag from '../../../../../components/CountryLabelWithFlag';
import GridEmptyValue from '../../../../../components/GridEmptyValue';
import GridStatus from '../../../../../components/GridStatus';
import renderLabel from '../../../../../utils/renderLabel';

export default (
  I18n,
  auth,
  fetchPlayerMiniProfile
) => [{
  name: 'client',
  header: I18n.t('CLIENTS.LIST.GRID_HEADER.CLIENT'),
  render: data => (
    <GridPlayerInfo
      fetchPlayerProfile={fetchPlayerMiniProfile}
      profile={data}
      auth={auth}
    />
  ),
}, {
  name: 'country',
  header: I18n.t('CLIENTS.LIST.GRID_HEADER.COUNTRY'),
  render: ({ country, languageCode }) => (
    <CountryLabelWithFlag
      code={country}
      height="14"
      languageCode={languageCode}
    />
  ),
}, {
  name: 'balance',
  header: I18n.t('CLIENTS.LIST.GRID_HEADER.BALANCE'),
  render: (data) => {
    const tradingProfile = get(data, 'tradingProfile') || {};
    return (
      <Choose>
        <When condition={tradingProfile.balance && tradingProfile.equity}>
          <div className="header-block-middle">{data.currency} {Number(tradingProfile.balance).toFixed(2)}</div>
          <div className="header-block-small">
            {I18n.t('CLIENT_PROFILE.PROFILE.HEADER.EQUITY')}: {data.currency} {Number(tradingProfile.equity).toFixed(2)}
          </div>
        </When>
        <Otherwise>
          <GridEmptyValue I18n={I18n} />
        </Otherwise>
      </Choose>
    );
  },
}, {
  name: 'deposits',
  header: I18n.t('CLIENTS.LIST.GRID_HEADER.DEPOSITS'),
  render: (data) => {
    const tradingProfile = get(data, 'tradingProfile') || {};
    return (
      <Choose>
        <When condition={tradingProfile.lastDepositDate}>
          <div className="font-weight-700">{tradingProfile.depositCount}</div>
          <div className="font-size-11">
            {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.LAST')}
            {' '}
            {moment(tradingProfile.lastDepositDate).format('DD.MM.YYYY')}
          </div>
        </When>
        <Otherwise>
          <GridEmptyValue I18n={I18n} />
        </Otherwise>
      </Choose>
    );
  },
}, {
  name: 'affiliate',
  header: I18n.t('CLIENTS.LIST.GRID_HEADER.AFFILIATE'),
  render: ({ affiliateId }) => <span className="font-size-13">{affiliateId}</span> || <GridEmptyValue I18n={I18n} />,
}, {
  name: 'sales',
  header: I18n.t('CLIENTS.LIST.GRID_HEADER.SALES'),
  render: (data) => {
    const { salesStatus, salesRepName, aquisitionStatus } = get(data, 'tradingProfile') || {};
    const colorClassName = salesStatusesColor[salesStatus];

    return (
      <Choose>
        <When condition={salesStatus}>
          <GridStatus
            wrapperClassName={aquisitionStatus === 'SALES' ? `border-${colorClassName}` : ''}
            colorClassName={colorClassName}
            statusLabel={renderLabel(salesStatus, salesStatuses)}
            info={salesRepName}
          />
        </When>
        <Otherwise>
          <GridEmptyValue I18n={I18n} />
        </Otherwise>
      </Choose>
    );
  },
}, {
  name: 'retention',
  header: I18n.t('CLIENTS.LIST.GRID_HEADER.RETENTION'),
  render: (data) => {
    const { retentionStatus, retentionRepName, aquisitionStatus } = get(data, 'tradingProfile') || {};
    const colorClassName = retentionStatusesColor[retentionStatus];

    return (
      <Choose>
        <When condition={retentionStatus}>
          <GridStatus
            wrapperClassName={aquisitionStatus === 'RETENTION' ? `border-${colorClassName}` : ''}
            colorClassName={colorClassName}
            statusLabel={renderLabel(retentionStatus, retentionStatuses)}
            info={retentionRepName}
          />
        </When>
        <Otherwise>
          <GridEmptyValue I18n={I18n} />
        </Otherwise>
      </Choose>
    );
  },
}, {
  name: 'registrationDate',
  header: I18n.t('CLIENTS.LIST.GRID_HEADER.REGISTRATION'),
  render: ({ registrationDate }) => (
    <Fragment>
      <div className="font-weight-700">{moment.utc(registrationDate).local().format('DD.MM.YYYY')}</div>
      <div className="font-size-11">
        {moment.utc(registrationDate).local().format('HH:mm:ss')}
      </div>
    </Fragment>
  ),
}, {
  name: 'status',
  header: I18n.t('CLIENTS.LIST.GRID_HEADER.STATUS'),
  render: ({ profileStatus, profileStatusDate }) => (
    <GridStatus
      colorClassName={userStatusColorNames[profileStatus]}
      statusLabel={renderLabel(profileStatus, userStatusesLabels)}
      info={profileStatusDate}
      infoLabel={date => I18n.t('COMMON.SINCE', { date: moment.utc(date).local().format('DD.MM.YYYY HH:mm') })}
    />
  ),
}];
