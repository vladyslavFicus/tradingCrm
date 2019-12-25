import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { riskStatuses, riskStatusTranslations } from './constants';

class RiskStatus extends Component {
  static propTypes = {
    riskCategory: PropTypes.string,
  };

  static defaultProps = {
    riskCategory: null,
  };

  render() {
    const {
      riskCategory,
    } = this.props;

    const riskCategoryClassName = classNames('header-block-middle text-uppercase', {
      'color-default': !riskCategory,
      'color-danger': riskCategory === riskStatuses.HIGH_RISK,
      'color-warning': riskCategory === riskStatuses.MEDIUM_RISK,
      'color-success': riskCategory === riskStatuses.LOW_RISK,
    });

    return (
      <div className="header-block margin-top-10">
        <div className="header-block-title">{I18n.t('CLIENT_PROFILE.RISKS.STATUS.TITLE')}</div>
        <div className={riskCategoryClassName}>
          {
            riskCategory
              ? I18n.t(riskStatusTranslations[riskCategory])
              : I18n.t('CLIENT_PROFILE.RISKS.STATUS.STATUSES.DEFAULT')
          }
        </div>
      </div>
    );
  }
}

export default RiskStatus;
