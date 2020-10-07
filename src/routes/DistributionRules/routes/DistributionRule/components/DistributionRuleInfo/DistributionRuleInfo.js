import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
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
  }

  static defaultProps = {
    status: '',
    createdAt: '',
    updatedAt: '',
    statusChangedAt: '',
    latestMigration: {},
  }

  render() {
    const {
      status,
      createdAt,
      updatedAt,
      statusChangedAt,
      latestMigration,
    } = this.props;

    const { startDate: latestMigrationDate } = latestMigration || {};

    return (
      <div className="DistributionRuleInfo">
        <If condition={status}>
          <div className="DistributionRuleInfo__item">
            <div className="DistributionRuleInfo__item-label">status</div>
            <div className="DistributionRuleInfo__item-value">{status}</div>
            <If condition={statusChangedAt}>
              <div className="DistributionRuleInfo__item-small-text">{statusChangedAt}</div>
            </If>
          </div>
        </If>
        <If condition={createdAt}>
          <div className="DistributionRuleInfo__item">
            <div className="DistributionRuleInfo__item-label">created</div>
            <div className="DistributionRuleInfo__item-value">{createdAt}</div>
            <div className="DistributionRuleInfo__item-small-text">{createdAt}</div>
          </div>
        </If>
        <If condition={updatedAt}>
          <div className="DistributionRuleInfo__item">
            <div className="DistributionRuleInfo__item-label">updated</div>
            <div className="DistributionRuleInfo__item-value">{updatedAt}</div>
            <div className="DistributionRuleInfo__item-small-text">{updatedAt}</div>
          </div>
        </If>
        <If condition={latestMigrationDate}>
          <div className="DistributionRuleInfo__item">
            <div className="DistributionRuleInfo__item-label">last time executed</div>
            <div className="DistributionRuleInfo__item-value">{latestMigrationDate}</div>
            <div className="DistributionRuleInfo__item-small-text">{latestMigrationDate}</div>
          </div>
        </If>
      </div>
    );
  }
}

export default DistributionRuleInfo;
