import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import classNames from 'classnames';
import moment from 'moment';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { clientDistributionStatuses } from 'constants/clientsDistribution';
import './DistributionRuleStatus.scss';

class DistributionRuleStatus extends PureComponent {
  static propTypes = {
    status: PropTypes.string.isRequired,
    statusChangedAt: PropTypes.string.isRequired,
    updateRuleStatus: PropTypes.func.isRequired,
    rootClassName: PropTypes.string.isRequired,
    labelClassName: PropTypes.string.isRequired,
    valueClassName: PropTypes.string.isRequired,
    smallTextClassName: PropTypes.string.isRequired,
  };

  render() {
    const {
      status,
      statusChangedAt,
      updateRuleStatus,
      rootClassName,
      labelClassName,
      valueClassName,
      smallTextClassName,
    } = this.props;

    return (
      <UncontrolledDropdown className="DistributionRuleStatus">
        <DropdownToggle className={rootClassName} tag="div">
          <div className={labelClassName}>
            {I18n.t('CLIENTS_DISTRIBUTION.RULE.INFO.STATUS')}
          </div>
          <div
            className={classNames(
              'DistributionRuleStatus__toggle-item',
              valueClassName,
              clientDistributionStatuses[status].color,
            )}
          >
            {I18n.t(clientDistributionStatuses[status].label)}
            <i className="DistributionRuleStatus__arrow fa fa-angle-down" />
          </div>
          <If condition={statusChangedAt}>
            <div className={smallTextClassName}>
              {I18n.t('CLIENTS_DISTRIBUTION.RULE.INFO.STATUS_SINCE')}&nbsp;
              {moment.utc(statusChangedAt).local().format('DD.MM.YYYY HH:mm')}
            </div>
          </If>
        </DropdownToggle>
        <DropdownMenu className="DistributionRuleStatus__dropdown-menu">
          {Object.keys(clientDistributionStatuses)
            .filter(key => key !== status)
            .map(key => (
              <DropdownItem
                key={key}
                className={classNames(
                  'DistributionRuleStatus__dropdown-item',
                  valueClassName,
                  clientDistributionStatuses[key].color,
                )}
                onClick={() => updateRuleStatus(key)}
              >
                {I18n.t(clientDistributionStatuses[key].label)}
              </DropdownItem>
            ))
          }
        </DropdownMenu>
      </UncontrolledDropdown>
    );
  }
}

export default DistributionRuleStatus;
