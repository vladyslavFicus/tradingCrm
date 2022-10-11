import React, { PureComponent, Fragment } from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import classNames from 'classnames';
import compose from 'compose-function';
import { withRouter } from 'react-router-dom';
import { getBrand } from 'config';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import renderLabel from 'utils/renderLabel';
import { Table, Column } from 'components/Table';
import GridPlayerInfo from 'components/GridPlayerInfo';
import GridEmptyValue from 'components/GridEmptyValue';
import GridAcquisitionStatus from 'components/GridAcquisitionStatus';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import { bonusTypes, bonusTypesLabels } from './constants';
import ReferralsQuery from './graphql/ReferralsQuery';
import './ClientReferralsGrid.scss';

class ClientReferralsGrid extends PureComponent {
  static propTypes = {
    referralsQuery: PropTypes.query({
      referrals: PropTypes.arrayOf(PropTypes.referral),
    }).isRequired,
  };

  handleRowClick = ({ referralInfo: { profileUuid } }) => {
    window.open(`/clients/${profileUuid}/profile`, '_blank');
  };

  setActiveRowClass = ({ bonusType }) => bonusType === 'FTD' && 'ClientReferralsGrid__row--active';

  renderDate = date => (
    <Fragment>
      <div className="ClientReferralsGrid__col-text ClientReferralsGrid__col-text--bold">
        {moment.utc(date).local().format('DD.MM.YYYY')}
      </div>
      <div className="ClientReferralsGrid__col-text ClientReferralsGrid__col-text--small">
        {moment.utc(date).local().format('HH:mm:ss')}
      </div>
    </Fragment>
  );

  renderAmount = (amount, currency, normalizedAmount) => (
    <Fragment>
      <div className="ClientReferralsGrid__col-text ClientReferralsGrid__col-text--bold">
        {Number(currency).toFixed(2)} {amount}
      </div>
      <div className="ClientReferralsGrid__col-text ClientReferralsGrid__col-text--small">
        {`(${getBrand().currencies.base} ${Number(
          normalizedAmount,
        ).toFixed(2)})`}
      </div>
    </Fragment>
  );

  renderBonusType = bonusType => (
    <div className={classNames(
      'ClientReferralsGrid__col-text',
      'ClientReferralsGrid__col-text--bold',
      'ClientReferralsGrid__col-text--upper',
      'ClientReferralsGrid__type', {
        'ClientReferralsGrid__type--ftd': bonusType === bonusTypes.FTD,
        'ClientReferralsGrid__type--registration': bonusType === bonusTypes.REGISTRATION,
      },
    )}
    >
      {I18n.t(renderLabel(bonusType, bonusTypesLabels))}
    </div>
  );

  render() {
    const {
      referralsQuery,
    } = this.props;

    const content = referralsQuery.data?.referrals || [];
    const isLoading = referralsQuery.loading;

    return (
      <div className="ClientReferralsGrid">
        <Table
          stickyFromTop={123}
          items={content}
          loading={isLoading}
          customClassNameRow={this.setActiveRowClass}
        >
          <Column
            header={I18n.t('REFERRALS.GRID.NAME')}
            render={({ referralInfo, referralInfo: { name: fullName, profileUuid: uuid } }) => (
              <GridPlayerInfo profile={{ ...referralInfo, fullName, uuid }} />
            )}
          />
          <Column
            header={I18n.t('REFERRALS.GRID.COUNTRY')}
            render={({ referralInfo: { languageCode, countryCode } }) => (
              <Choose>
                <When condition={countryCode}>
                  <CountryLabelWithFlag
                    code={countryCode}
                    height="14"
                    languageCode={languageCode}
                  />
                </When>
                <Otherwise>
                  <GridEmptyValue />
                </Otherwise>
              </Choose>
            )}
          />
          <Column
            header={I18n.t('REFERRALS.GRID.BONUS_TYPE')}
            render={({ bonusType }) => this.renderBonusType(bonusType)}
          />
          <Column
            header={I18n.t('REFERRALS.GRID.REGISTRATION')}
            render={({ referralInfo: { registrationDate } }) => this.renderDate(registrationDate)}
          />
          <Column
            header={I18n.t('REFERRALS.GRID.FTD_AMOUNT')}
            render={({ ftdInfo }) => {
              const { currency, amount, normalizedAmount } = ftdInfo || {};

              if (!ftdInfo) return <Fragment>&mdash;</Fragment>;

              return this.renderAmount(currency, amount, normalizedAmount);
            }}
          />
          <Column
            header={I18n.t('REFERRALS.GRID.FTD_DATE')}
            render={({ ftdInfo }) => {
              const { date } = ftdInfo || {};

              if (!ftdInfo) return <Fragment>&mdash;</Fragment>;

              return this.renderDate(date);
            }}
          />
          <Column
            header={I18n.t('REFERRALS.GRID.REMUNERATION')}
            render={({ remuneration }) => {
              const { currency, amount, normalizedAmount } = remuneration || {};

              if (!remuneration) return <Fragment>&mdash;</Fragment>;

              return this.renderAmount(currency, amount, normalizedAmount);
            }}
          />
          <Column
            header={I18n.t('REFERRALS.GRID.REMUNERATION_DATE')}
            render={({ remuneration }) => {
              const { date } = remuneration || {};

              if (!remuneration) return <Fragment>&mdash;</Fragment>;

              return this.renderDate(date);
            }}
          />
          <Column
            header={I18n.t('REFERRALS.GRID.SALES')}
            render={({ acquisition }) => (
              <GridAcquisitionStatus
                active={acquisition?.acquisitionStatus === 'SALES'}
                acquisition="SALES"
                status={acquisition?.salesStatus}
                fullName={acquisition?.salesOperator?.fullName}
                hierarchy={acquisition?.salesOperator?.hierarchy}
              />
            )}
          />
          <Column
            header={I18n.t('REFERRALS.GRID.RETENTION')}
            render={({ acquisition }) => (
              <GridAcquisitionStatus
                active={acquisition?.acquisitionStatus === 'RETENTION'}
                acquisition="RETENTION"
                status={acquisition?.retentionStatus}
                fullName={acquisition?.retentionOperator?.fullName}
                hierarchy={acquisition?.retentionOperator?.hierarchy}
              />
            )}
          />
        </Table>
      </div>
    );
  }
}

export default compose(
  withRouter,
  withRequests({
    referralsQuery: ReferralsQuery,
  }),
)(ClientReferralsGrid);
