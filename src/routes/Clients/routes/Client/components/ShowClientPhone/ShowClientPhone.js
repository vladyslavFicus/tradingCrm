import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { Button } from 'components/UI';
import { withPermission } from '../../../../../../providers/PermissionsProvider';
import permissions from '../../../../../../config/permissions';
import './ShowClientPhone.scss';

class ShowClientPhone extends PureComponent {
  static propTypes = {
    permission: PropTypes.permission.isRequired,
    getProfileContacts: PropTypes.func.isRequired,
  };

  render() {
    const {
      permission: { allows },
      getProfileContacts,
    } = this.props;

    const isAvailable = allows(permissions.USER_PROFILE.FIELD_PHONE);

    return (
      <If condition={isAvailable}>
        <Button
          className="ShowClientPhone__button"
          onClick={getProfileContacts}
        >
          {I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.SHOW')}
        </Button>
      </If>
    );
  }
}

export default withPermission(ShowClientPhone);
