import React, { PureComponent, Fragment } from 'react';
import { get } from 'lodash';
import I18n from 'i18n-js';
import moment from 'moment';
import classNames from 'classnames';
import { getActiveBrandConfig } from 'config';
import PropTypes from 'constants/propTypes';
import { salesStatuses, salesStatusesColor } from 'constants/salesStatuses';
import { retentionStatuses, retentionStatusesColor } from 'constants/retentionStatuses';
import renderLabel from 'utils/renderLabel';
import Grid, { GridColumn } from 'components/Grid';
import GridPlayerInfo from 'components/GridPlayerInfo';
import GridEmptyValue from 'components/GridEmptyValue';
import GridStatus from 'components/GridStatus';
import GridStatusDeskTeam from 'components/GridStatusDeskTeam';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import { bonusTypes, bonusTypesColors } from '../../constants';
import './ReferralsGrid.scss';

class ReferralsGrid extends PureComponent {
  static propTypes = {
    referralsQuery: PropTypes.query({
      referrals: PropTypes.arrayOf(PropTypes.referral),
    }).isRequired,
  };

  handleRowClick = ({ referralInfo: { profileUuid } }) => {
    window.open(`/clients/${profileUuid}/profile`, '_blank');
  };

  setActiveRowClass = ({ bonusType }) => bonusType === 'FTD' && 'ReferralsGrid__row--active';

  renderDate = date => (
    <Fragment>
      <div className="font-weight-700">{moment.utc(date).local().format('DD.MM.YYYY')}</div>
      <div className="font-size-11">
        {moment.utc(date).local().format('HH:mm:ss')}
      </div>
    </Fragment>
  );

  renderAmount = (amount, currency, normalizedAmount) => (
    <Fragment>
      <div className="header-block-middle">
        {currency} {Number(amount).toFixed(2)}
      </div>
      <div className="font-size-11">
        {`(${getActiveBrandConfig().currencies.base} ${Number(
          normalizedAmount,
        ).toFixed(2)})`}
      </div>
    </Fragment>
  );

  renderBonusType = bonusType => (
    <div className={classNames(
      bonusTypesColors[bonusType],
      'font-weight-700 text-uppercase',
    )}
    >
      {I18n.t(renderLabel(bonusType, bonusTypes))}
    </div>
  );

  renderAcquisitionStatus = ({
    statusLabel,
    operator,
    wrapperClassName,
    colorClassName,
  }) => (
    <Choose>
      <When condition={statusLabel}>
        <GridStatus
          wrapperClassName={wrapperClassName}
          colorClassName={colorClassName}
          statusLabel={statusLabel}
          info={(
            <If condition={operator}>
              <GridStatusDeskTeam
                fullName={operator.fullName}
                hierarchy={operator.hierarchy}
              />
            </If>
          )}
        />
      </When>
      <Otherwise>
        <GridEmptyValue />
      </Otherwise>
    </Choose>
  );

  render() {
    const {
      referralsQuery,
    } = this.props;

    const content = get(referralsQuery, 'data.referrals') || [];
    const isLoading = referralsQuery.loading;

    return (
      <div className="card card-body">
        <Grid
          data={content}
          rowsClassNames={this.setActiveRowClass}
          handleRowClick={this.handleRowClick}
          isLoading={isLoading}
          withLazyLoad={false}
        >
          <GridColumn
            header={I18n.t('REFERRALS.GRID.NAME')}
            render={({ referralInfo, referralInfo: { name: fullName } }) => (
              <GridPlayerInfo profile={{ ...referralInfo, fullName }} />
            )}
          />
          <GridColumn
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
          <GridColumn
            header={I18n.t('REFERRALS.GRID.BONUS_TYPE')}
            render={({ bonusType }) => this.renderBonusType(bonusType)}
          />
          <GridColumn
            header={I18n.t('REFERRALS.GRID.REGISTRATION')}
            render={({ referralInfo: { registrationDate } }) => this.renderDate(registrationDate)}
          />
          <GridColumn
            header={I18n.t('REFERRALS.GRID.FTD_AMOUNT')}
            render={({ ftdInfo: { currency, amount, normalizedAmount } }) => (
              this.renderAmount(currency, amount, normalizedAmount)
            )}
          />
          <GridColumn
            header={I18n.t('REFERRALS.GRID.FTD_DATE')}
            render={({ ftdInfo: { date } }) => this.renderDate(date)}
          />
          <GridColumn
            header={I18n.t('REFERRALS.GRID.REMUNERATION')}
            render={({ remuneration: { currency, amount, normalizedAmount } }) => (
              this.renderAmount(currency, amount, normalizedAmount)
            )}
          />
          <GridColumn
            header={I18n.t('REFERRALS.GRID.REMUNERATION_DATE')}
            render={({ remuneration: { date } }) => this.renderDate(date)}
          />
          <GridColumn
            header={I18n.t('REFERRALS.GRID.SALES')}
            render={(data) => {
              const {
                salesStatus,
                salesOperator,
                acquisitionStatus,
              } = get(data, 'acquisition') || {};
              const colorClassName = salesStatusesColor[salesStatus];

              return this.renderAcquisitionStatus({
                statusLabel: salesStatus ? I18n.t(renderLabel(salesStatus, salesStatuses)) : '',
                operator: salesOperator,
                wrapperClassName: acquisitionStatus === 'SALES' ? `border-${colorClassName}` : '',
                colorClassName,
              });
            }}
          />
          <GridColumn
            header={I18n.t('REFERRALS.GRID.RETENTION')}
            render={(data) => {
              const {
                retentionStatus,
                retentionOperator,
                acquisitionStatus,
              } = get(data, 'acquisition') || {};
              const colorClassName = retentionStatusesColor[retentionStatus];

              return this.renderAcquisitionStatus({
                statusLabel: retentionStatus ? I18n.t(renderLabel(retentionStatus, retentionStatuses)) : '',
                operator: retentionOperator,
                wrapperClassName: acquisitionStatus === 'RETENTION' ? `border-${colorClassName}` : '',
                colorClassName,
              });
            }}
          />
        </Grid>
      </div>
    );
  }
}

export default ReferralsGrid;
