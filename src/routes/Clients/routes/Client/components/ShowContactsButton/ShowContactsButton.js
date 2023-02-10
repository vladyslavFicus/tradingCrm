import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { Button } from 'components/Buttons';
import './ShowContactsButton.scss';
import PermissionContent from 'components/PermissionContent';
import { CONDITIONS } from 'utils/permissions';

class ShowContactsButton extends PureComponent {
  static propTypes = {
    permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
    onClick: PropTypes.func.isRequired,
  };

  render() {
    const {
      permissions,
      onClick,
    } = this.props;

    return (
      <PermissionContent
        permissions={permissions}
        permissionsCondition={CONDITIONS.OR}
      >
        <Button
          tertiary
          className="ShowClientPhone__button"
          onClick={onClick}
        >
          {I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.SHOW')}
        </Button>
      </PermissionContent>
    );
  }
}

export default ShowContactsButton;
