import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import moment from 'moment';
import './PartnerRegistrationInfo.scss';

class PartnerRegistrationInfo extends PureComponent {
  static propTypes = {
    createdAt: PropTypes.string,
  };

  static defaultProps = {
    createdAt: '',
  };

  render() {
    const { createdAt } = this.props;

    return (
      <div className="PartnerRegistrationInfo">
        <div className="PartnerRegistrationInfo__title">
          {I18n.t('COMMON.REGISTERED')}
        </div>

        <If condition={createdAt}>
          <>
            <div className="PartnerRegistrationInfo__primary">
              {moment.utc(createdAt).local().fromNow()}
            </div>
            <div className="PartnerRegistrationInfo__secondary">
              {I18n.t('COMMON.ON')} {moment.utc(createdAt).local().format('DD.MM.YYYY HH:mm')}
            </div>
          </>
        </If>
      </div>
    );
  }
}

export default PartnerRegistrationInfo;
