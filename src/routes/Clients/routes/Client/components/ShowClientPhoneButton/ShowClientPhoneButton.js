import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { Button } from 'components/UI';
import permissions from 'config/permissions';
import './ShowClientPhoneButton.scss';
import PermissionContent from 'components/PermissionContent';
import { CONDITIONS } from 'utils/permissions';

class ShowClientPhoneButton extends PureComponent {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
  };

  render() {
    const {
      onClick,
    } = this.props;

    return (
      <PermissionContent
        permissions={[
          permissions.USER_PROFILE.FIELD_PHONE,
          permissions.USER_PROFILE.FIELD_ADDITIONAL_PHONE,
        ]}
        permissionsCondition={CONDITIONS.OR}
      >
        <Button
          className="ShowClientPhone__button"
          onClick={onClick}
        >
          {I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.SHOW')}
        </Button>
      </PermissionContent>
    );
  }
}

export default ShowClientPhoneButton;
