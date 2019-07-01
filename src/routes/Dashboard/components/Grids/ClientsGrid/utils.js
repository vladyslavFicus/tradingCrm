/* eslint-disable react/prop-types */
import React, { Fragment } from 'react';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import { get } from 'lodash';
import { getActiveBrandConfig } from 'config';
import Uuid from 'components/Uuid';
import GridStatusDeskTeam from 'components/GridStatusDeskTeam';
import {
  statusColorNames as userStatusColorNames,
  statusesLabels as userStatusesLabels,
} from '../../../../../constants/user';
import { salesStatuses, salesStatusesColor } from '../../../../../constants/salesStatuses';
import { retentionStatuses, retentionStatusesColor } from '../../../../../constants/retentionStatuses';
import GridPlayerInfo from '../../../../../components/GridPlayerInfo';
import CountryLabelWithFlag from '../../../../../components/CountryLabelWithFlag';
import GridEmptyValue from '../../../../../components/GridEmptyValue';
import GridStatus from '../../../../../components/GridStatus';
import renderLabel from '../../../../../utils/renderLabel';

export default ({ auth, fetchPlayerMiniProfile }) => [{
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
    <Choose>
      <When condition={country}>
        <CountryLabelWithFlag
          code={country}
          height="14"
          languageCode={languageCode}
        />
      </When>
      <Otherwise>
        <GridEmptyValue I18n={I18n} />
      </Otherwise>
    </Choose>
  ),
}, {
  name: 'balance',
  header: I18n.t('CLIENTS.LIST.GRID_HEADER.BALANCE'),
  render: (data) => {
    const currency = getActiveBrandConfig().currencies.base;
    const tradingProfile = get(data, 'tradingProfile') || {};

    return (
      <Choose>
        <When condition={tradingProfile.baseCurrencyBalance && tradingProfile.baseCurrencyEquity}>
          <div className="header-block-middle">
            {currency} {Number(tradingProfile.baseCurrencyBalance).toFixed(2)}
          </div>
          <div className="header-block-small">
            {I18n.t('CLIENT_PROFILE.PROFILE.HEADER.EQUITY')}:&nbsp;
            {currency} {Number(tradingProfile.baseCurrencyEquity).toFixed(2)}
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
  render: (data) => {
    const affiliateProfile = get(data, 'tradingProfile.affiliateProfileDocument');

    return (
      <Choose>
        <When condition={affiliateProfile}>
          <If condition={affiliateProfile.affiliate}>
            <div className="header-block-middle">{affiliateProfile.affiliate.fullName}</div>
          </If>
          <Uuid className="header-block-small" uuid={affiliateProfile._id} />
        </When>
        <Otherwise>
          <GridEmptyValue I18n={I18n} />
        </Otherwise>
      </Choose>
    );
  },
}, {
  name: 'sales',
  header: I18n.t('CLIENTS.LIST.GRID_HEADER.SALES'),
  render: (data) => {
    const {
      salesStatus,
      salesRep,
      aquisitionStatus,
    } = get(data, 'tradingProfile') || {};
    const colorClassName = salesStatusesColor[salesStatus];

    return (
      <Choose>
        <When condition={salesStatus}>
          <GridStatus
            wrapperClassName={aquisitionStatus === 'SALES' ? `border-${colorClassName}` : ''}
            colorClassName={colorClassName}
            statusLabel={renderLabel(salesStatus, salesStatuses)}
            info={
              <If condition={salesRep}>
                <GridStatusDeskTeam
                  fullName={salesRep.fullName}
                  hierarchy={salesRep.hierarchy}
                />
              </If>
            }
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
    const {
      retentionStatus,
      retentionRep,
      aquisitionStatus,
    } = get(data, 'tradingProfile') || {};
    const colorClassName = retentionStatusesColor[retentionStatus];

    return (
      <Choose>
        <When condition={retentionStatus}>
          <GridStatus
            wrapperClassName={aquisitionStatus === 'RETENTION' ? `border-${colorClassName}` : ''}
            colorClassName={colorClassName}
            statusLabel={renderLabel(retentionStatus, retentionStatuses)}
            info={
              <If condition={retentionRep}>
                <GridStatusDeskTeam
                  fullName={retentionRep.fullName}
                  hierarchy={retentionRep.hierarchy}
                />
              </If>
            }
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
