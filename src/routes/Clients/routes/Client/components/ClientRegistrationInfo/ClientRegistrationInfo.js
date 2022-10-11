import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import moment from 'moment';
import './ClientRegistrationInfo.scss';

class ClientRegistrationInfo extends PureComponent {
  static propTypes = {
    registrationDate: PropTypes.string,
  };

  static defaultProps = {
    registrationDate: null,
  };

  render() {
    const { registrationDate } = this.props;

    return (
      <div className="ClientRegistrationInfo">
        <div className="ClientRegistrationInfo__title">
          {I18n.t('CLIENT_PROFILE.CLIENT.REGISTERED.TITLE')}
        </div>

        <If condition={registrationDate}>
          <div className="ClientRegistrationInfo__general">
            {moment.utc(registrationDate).local().fromNow()}
          </div>
          <div className="ClientRegistrationInfo__additional">
            {I18n.t('COMMON.ON')} {moment.utc(registrationDate).local().format('DD.MM.YYYY HH:mm')}
          </div>
        </If>
      </div>
    );
  }
}

export default ClientRegistrationInfo;
