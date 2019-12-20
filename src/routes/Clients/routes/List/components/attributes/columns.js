/* eslint-disable */
/* eslint-disable react/prop-types */
import React, { Fragment } from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { getActiveBrandConfig } from 'config';
import { statusColorNames, statusesLabels } from 'constants/user';
import { salesStatuses, salesStatusesColor } from 'constants/salesStatuses';
import { retentionStatuses, retentionStatusesColor } from 'constants/retentionStatuses';
import GridPlayerInfo from 'components/GridPlayerInfo';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import { UncontrolledTooltip } from 'components/Reactstrap/Uncontrolled';
import GridStatusDeskTeam from 'components/GridStatusDeskTeam';
import GridEmptyValue from 'components/GridEmptyValue';
import GridStatus from 'components/GridStatus';
import Uuid from 'components/Uuid';
import renderLabel from 'utils/renderLabel';

export default () => [{
  name: 'client',
  header: I18n.t('CLIENTS.LIST.GRID_HEADER.CLIENT'),
  render: data => (
    <GridPlayerInfo
      profile={data}
    />
  ),
}, {
  name: 'country',
  header: I18n.t('CLIENTS.LIST.GRID_HEADER.COUNTRY'),
  render: ({ address: { countryCode }, languageCode }) => (
    <Choose>
      <When condition={countryCode}>
        <CountryLabelWithFlag
          code={countryCode}
          height="14"
          languageCode={languageCode}
        />
      </When>
      <Otherwise>
        <GridEmptyValue I18n={I18n} />
      </Otherwise>
    </Choose>
  )
}, {
  name: 'balance',
  header: I18n.t('CLIENTS.LIST.GRID_HEADER.BALANCE'),
  render: (data) => {
    const currency = getActiveBrandConfig().currencies.base;
    const amount = get(data, 'balance.amount') || 0;

    return (
      <div>
        <div className="header-block-middle">
          {currency} {Number(amount).toFixed(2)}
        </div>
      </div>
    );
  },
}, {
  name: 'deposits',
  header: I18n.t('CLIENTS.LIST.GRID_HEADER.DEPOSITS'),
  render: (data) => {
    const { depositsCount, lastDepositTime } = get(data, 'paymentDetails') || {};

    return (
      <Choose>
        <When condition={lastDepositTime}>
          <div className="font-weight-700">{depositsCount}</div>
          <div className="font-size-11">
            {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.LAST')}
            {' '}
            {moment(lastDepositTime).format('DD.MM.YYYY')}
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
    const { uuid, firstName, source } = get(data, 'affiliate') || {};

    return (
      <Choose>
        <When condition={uuid}>
          <div>
              <a
                className="header-block-middle"
                target="_blank"
                rel="noopener noreferrer"
                href={`/partners/${uuid}/profile`}
              >
                {firstName}
              </a>
            </div>
            <If condition={source}>
              <div id={`${data.uuid}`}>
                <Uuid className="header-block-small" uuidPostfix="..." length={12} uuid={source} />
              </div>
              <UncontrolledTooltip
                placement="bottom-start"
                target={`${data.uuid}`}
                delay={{
                  show: 350, hide: 250,
                }}
              >
                {source}
              </UncontrolledTooltip>
            </If>
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
      acquisitionStatus,
      salesStatus,
      salesOperator,
    } = get(data, 'acquisition') || {};

    const colorClassName = salesStatusesColor[salesStatus];

    return (
      <Choose>
        <When condition={salesStatus}>
          <GridStatus
            wrapperClassName={acquisitionStatus === 'SALES' ? `border-${colorClassName}` : ''}
            colorClassName={colorClassName}
            statusLabel={I18n.t(renderLabel(salesStatus, salesStatuses))}
            info={(
              <If condition={salesOperator}>
                <GridStatusDeskTeam
                  fullName={salesOperator.fullName}
                  hierarchy={salesOperator.hierarchy}
                />
              </If>
            )}
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
      acquisitionStatus,
      retentionStatus,
      retentionOperator,
    } = get(data, 'acquisition') || {};

    const colorClassName = retentionStatusesColor[retentionStatus];

    return (
      <Choose>
        <When condition={retentionStatus}>
          <GridStatus
            wrapperClassName={acquisitionStatus === 'RETENTION' ? `border-${colorClassName}` : ''}
            colorClassName={colorClassName}
            statusLabel={I18n.t(renderLabel(retentionStatus, retentionStatuses))}
            info={(
              <If condition={retentionOperator}>
                <GridStatusDeskTeam
                  fullName={retentionOperator.fullName}
                  hierarchy={retentionOperator.hierarchy}
                />
              </If>
            )}
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
  render: ({ registrationDetails: { registrationDate } }) => (
    <Fragment>
      <div className="font-weight-700">{moment.utc(registrationDate).local().format('DD.MM.YYYY')}</div>
      <div className="font-size-11">
        {moment.utc(registrationDate).local().format('HH:mm:ss')}
      </div>
    </Fragment>
  ),
}, {
  name: 'lastNote',
  header: I18n.t('CLIENTS.LIST.GRID_HEADER.LAST_NOTE'),
  render: (data) => {
    const { uuid, changedAt, content } = get(data, 'lastNote') || {};
    
    return (
      <Choose>
        <When condition={uuid}>
          <div className="max-width-200">
            <div className="font-weight-700">{moment.utc(changedAt).local().format('DD.MM.YYYY')}</div>
            <div className="font-size-11">{moment.utc(changedAt).local().format('HH:mm:ss')}</div>
            <div className="text-truncate-2-lines max-height-35 font-size-11" id={`${uuid}-note`}>{content}</div>
            <UncontrolledTooltip
              placement="bottom-start"
              target={`${uuid}-note`}
              delay={{
                show: 350, hide: 250,
              }}
            >
              {content}
            </UncontrolledTooltip>
          </div>
        </When>
        <Otherwise>
          <GridEmptyValue I18n={I18n} />
        </Otherwise>
      </Choose>
    );
  },
}, {
  name: 'status',
  header: I18n.t('CLIENTS.LIST.GRID_HEADER.STATUS'),
  render: (data) => {
    const { changedAt, type } = get(data, 'status') || {};

    return (
      <GridStatus
        colorClassName={statusColorNames[type]}
        statusLabel={I18n.t(renderLabel(type, statusesLabels))}
        info={changedAt}
        infoLabel={date => I18n.t('COMMON.SINCE', { date: moment.utc(date).local().format('DD.MM.YYYY HH:mm') })}
      />
    )
  },
}];
