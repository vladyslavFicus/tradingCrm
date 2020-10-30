import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import moment from 'moment';
import './OperatorRegistrationInfo.scss';

class OperatorRegistrationInfo extends PureComponent {
  static propTypes = {
    registrationDate: PropTypes.string,
  };

  static defaultProps = {
    registrationDate: '',
  };

  render() {
    const { registrationDate } = this.props;

    return (
      <div className="OperatorRegistrationInfo">
        <div className="OperatorRegistrationInfo__title">
          {I18n.t('COMMON.REGISTERED')}
        </div>

        <If condition={registrationDate}>
          <>
            <div className="OperatorRegistrationInfo__primary">
              {moment.utc(registrationDate).local().fromNow()}
            </div>
            <div className="OperatorRegistrationInfo__secondary">
              {I18n.t('COMMON.ON')} {moment.utc(registrationDate).local().format('DD.MM.YYYY HH:mm')}
            </div>
          </>
        </If>
      </div>
    );
  }
}

export default OperatorRegistrationInfo;
