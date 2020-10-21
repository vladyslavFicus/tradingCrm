import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import moment from 'moment';
import DistributionRuleStatus from './components/DistributionRuleStatus';
import './DistributionRuleInfo.scss';

class DistributionRuleInfo extends PureComponent {
  static propTypes = {
    status: PropTypes.string,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
    statusChangedAt: PropTypes.string,
    latestMigration: PropTypes.shape({
      startDate: PropTypes.string,
    }),
    updateRuleStatus: PropTypes.func.isRequired,
  };

  static defaultProps = {
    status: '',
    createdAt: '',
    updatedAt: '',
    statusChangedAt: '',
    latestMigration: {},
  };

  renderDateColumn = (label, date) => (
    <div className="DistributionRuleInfo__item">
      <div className="DistributionRuleInfo__item-label">
        {label}
      </div>
      <div className="DistributionRuleInfo__item-value">
        {moment.utc(date).local().format('DD.MM.YYYY')}
      </div>
      <div className="DistributionRuleInfo__item-small-text">
        {moment.utc(date).local().format('HH:mm')}
      </div>
    </div>
  );

  render() {
    const {
      status,
      createdAt,
      updatedAt,
      statusChangedAt,
      latestMigration,
      updateRuleStatus,
    } = this.props;

    const { startDate: latestMigrationDate } = latestMigration || {};

    return (
      <div className="DistributionRuleInfo">
        <If condition={status}>
          <DistributionRuleStatus
            status={status}
            statusChangedAt={statusChangedAt}
            updateRuleStatus={updateRuleStatus}
            rootClassName="DistributionRuleInfo__item"
            labelClassName="DistributionRuleInfo__item-label"
            valueClassName="DistributionRuleInfo__item-value text-uppercase"
            smallTextClassName="DistributionRuleInfo__item-small-text"
          />
        </If>
        <If condition={createdAt}>
          {this.renderDateColumn(I18n.t('CLIENTS_DISTRIBUTION.RULE.INFO.CREATED'), createdAt)}
        </If>
        <If condition={updatedAt}>
          {this.renderDateColumn(I18n.t('CLIENTS_DISTRIBUTION.RULE.INFO.UPDATED'), updatedAt)}
        </If>
        <If condition={latestMigrationDate}>
          {this.renderDateColumn(I18n.t('CLIENTS_DISTRIBUTION.RULE.INFO.LAST_EXECUTION'), latestMigrationDate)}
        </If>
      </div>
    );
  }
}

export default DistributionRuleInfo;
