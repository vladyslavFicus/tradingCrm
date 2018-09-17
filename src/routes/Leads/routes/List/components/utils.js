/* eslint-disable react/prop-types */
import React, { Fragment } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { salesStatuses, salesStatusesColor } from '../../../../../constants/salesStatuses';
import Uuid from '../../../../../components/Uuid';
import MiniProfile from '../../../../../components/MiniProfile';
import { types as miniProfileTypes } from '../../../../../constants/miniProfile';
import GridCountryFlag from '../../../../../components/GridCountryFlag';

export default I18n => [{
  name: 'lead',
  header: I18n.t('CLIENTS.LEADS.GRID_HEADER.LEAD'),
  render: data => (
    <div id={data.id}>
      <div className="font-weight-700">
        {data.name} {data.surname}
      </div>
      <div className="font-size-11">
        <MiniProfile
          target={data.id}
          dataSource={data}
          type={miniProfileTypes.LEAD}
        >
          <Uuid uuid={data.id} uuidPrefix="LE" />
        </MiniProfile>
      </div>
    </div>
  ),
}, {
  name: 'country',
  header: I18n.t('CLIENTS.LEADS.GRID_HEADER.COUNTRY'),
  render: ({ country, language }) => (
    <GridCountryFlag
      code={country}
      height="14"
      languageCode={language}
    />
  ),
}, {
  name: 'source/affiliate',
  header: I18n.t('CLIENTS.LEADS.GRID_HEADER.SOURCE/AFFILIATE'),
  render: ({ source, affiliate }) => (
    <Fragment>
      <div className="header-block-middle">{affiliate}</div>
      <div className="header-block-small">{source}</div>
    </Fragment>
  ),
}, {
  name: 'sales',
  header: I18n.t('CLIENTS.LEADS.GRID_HEADER.SALES'),
  render: ({ salesStatus, salesAgent }) => {
    const className = salesStatusesColor[salesStatus];

    return (
      <Fragment>
        <div className={classNames('font-weight-700 uppercase', { [className]: className })}>
          {I18n.t(salesStatuses[salesStatus])}
        </div>
        <div className="font-size-11">{salesAgent}</div>
      </Fragment>
    );
  },
}, {
  name: 'registrationDate',
  header: I18n.t('CLIENTS.LEADS.GRID_HEADER.REGISTRATION'),
  render: ({ registrationDate }) => (
    <Fragment>
      <div className="font-weight-700">{moment.utc(registrationDate).local().format('DD.MM.YYYY')}</div>
      <div className="font-size-11">
        {moment.utc(registrationDate).local().format('HH:mm:ss')}
      </div>
    </Fragment>
  ),
}];
