import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { Button } from 'components/UI';
import { withPermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import './ShowClientPhoneButton.scss';

class ShowClientPhoneButton extends PureComponent {
  static propTypes = {
    permission: PropTypes.permission.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  render() {
    const {
      permission: { allows },
      onClick,
    } = this.props;

    const isAvailable = allows(permissions.USER_PROFILE.FIELD_PHONE);

    return (
      <If condition={isAvailable}>
        <Button
          className="ShowClientPhone__button"
          onClick={onClick}
        >
          {I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.SHOW')}
        </Button>
      </If>
    );
  }
}

export default withPermission(ShowClientPhoneButton);
