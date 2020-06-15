import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { withRequests } from 'apollo';
import { withModals, withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import permissions from 'config/permissions';
import ChangePasswordModal from 'modals/ChangePasswordModal';
import PermissionContent from 'components/PermissionContent';
import { Button } from 'components/UI';
import Uuid from 'components/Uuid';
import getPartnerLockStatusQuery from './graphql/getPartnerLockStatusQuery';
import changePartnerPasswordMutation from './graphql/changePartnerPasswordMutation';
import unlockPartnerLoginMutation from './graphql/unlockPartnerLoginMutation';
import './PartnerHeader.scss';

class PartnerHeader extends PureComponent {
  static propTypes = {
    partner: PropTypes.partner.isRequired,
    partnerLockStatus: PropTypes.shape({
      data: PropTypes.shape({
        loginLock: PropTypes.shape({
          lock: PropTypes.bool,
        }),
      }),
    }).isRequired,
    modals: PropTypes.shape({
      changePasswordModal: PropTypes.modalType,
    }).isRequired,
    unlockPartnerLogin: PropTypes.func.isRequired,
    changePassword: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
  };

  handleUnlockPartnerLogin = async () => {
    const {
      unlockPartnerLogin,
      partner: { uuid },
      notify,
    } = this.props;

    const response = await unlockPartnerLogin({ variables: { uuid } });
    const success = get(response, 'data.auth.unlockLogin.data.success') || false;

    notify({
      level: success ? 'success' : 'error',
      title: success
        ? I18n.t('PARTNER_PROFILE.NOTIFICATIONS.SUCCESS_UNLOCK.TITLE')
        : I18n.t('PARTNER_PROFILE.NOTIFICATIONS.ERROR_UNLOCK.TITLE'),
      message: success
        ? I18n.t('PARTNER_PROFILE.NOTIFICATIONS.SUCCESS_UNLOCK.MESSAGE')
        : I18n.t('PARTNER_PROFILE.NOTIFICATIONS.ERROR_UNLOCK.MESSAGE'),
    });
  };

  handleChangePassword = async ({ newPassword }) => {
    const {
      modals: { changePasswordModal },
      partner: { uuid },
      changePassword,
      notify,
    } = this.props;

    const response = await changePassword({ variables: { newPassword, uuid } });
    const success = get(response, 'data.operator.changeOperatorPassword.success') || false;

    notify({
      level: success ? 'success' : 'error',
      title: success
        ? I18n.t('PARTNER_PROFILE.NOTIFICATIONS.SET_NEW_PASSWORD.SUCCESS.TITLE')
        : I18n.t('PARTNER_PROFILE.NOTIFICATIONS.SET_NEW_PASSWORD.ERROR.TITLE'),
      message: success
        ? I18n.t('PARTNER_PROFILE.NOTIFICATIONS.SET_NEW_PASSWORD.SUCCESS.MESSAGE')
        : I18n.t('PARTNER_PROFILE.NOTIFICATIONS.SET_NEW_PASSWORD.ERROR.MESSAGE'),
    });

    if (success) {
      changePasswordModal.hide();
    }
  };

  handleOpenChangePasswordModal = () => {
    const {
      modals: { changePasswordModal },
      partner: { uuid, fullName },
    } = this.props;

    changePasswordModal.show({
      uuid,
      fullName,
      onSubmit: this.handleChangePassword,
    });
  };

  render() {
    const {
      partner: {
        fullName,
        country,
        uuid,
      },
      partnerLockStatus,
    } = this.props;

    const partnerLoginLocked = get(partnerLockStatus, 'data.loginLock.lock') || false;

    return (
      <div className="PartnerHeader">
        <div className="PartnerHeader__topic">
          <div className="PartnerHeader__title">{fullName}</div>
          <div className="PartnerHeader__uuid">
            <If condition={uuid}>
              <Uuid uuid={uuid} />
            </If>

            <If condition={country}>
              <span>- {country}</span>
            </If>
          </div>
        </div>

        <div className="PartnerHeader__actions">
          <If condition={partnerLoginLocked}>
            <Button
              className="PartnerHeader__action"
              onClick={this.handleUnlockPartnerLogin}
              primary
              small
            >
              {I18n.t('PARTNER_PROFILE.PROFILE.HEADER.UNLOCK')}
            </Button>
          </If>

          <PermissionContent permissions={permissions.PARTNERS.CHANGE_PASSWORD}>
            <Button
              className="PartnerHeader__action"
              onClick={this.handleOpenChangePasswordModal}
              common
              small
            >
              {I18n.t('PARTNER_PROFILE.CHANGE_PASSWORD')}
            </Button>
          </PermissionContent>
        </div>
      </div>
    );
  }
}

export default compose(
  withRouter,
  withNotifications,
  withModals({
    changePasswordModal: ChangePasswordModal,
  }),
  withRequests({
    partnerLockStatus: getPartnerLockStatusQuery,
    changePassword: changePartnerPasswordMutation,
    unlockPartnerLogin: unlockPartnerLoginMutation,
  }),
)(PartnerHeader);
