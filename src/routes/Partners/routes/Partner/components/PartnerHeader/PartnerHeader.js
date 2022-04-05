import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { withRequests, parseErrors } from 'apollo';
import { withModals, withNotifications } from 'hoc';
import { isMaxLoginAttemptReached } from 'utils/profileLock';
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
      refetch: PropTypes.func.isRequired,
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
      partnerLockStatus,
      unlockPartnerLogin,
      partner: { uuid },
      notify,
    } = this.props;

    try {
      await unlockPartnerLogin({ variables: { uuid } });

      notify({
        level: 'success',
        title: I18n.t('PARTNER_PROFILE.NOTIFICATIONS.SUCCESS_UNLOCK.TITLE'),
        message: I18n.t('PARTNER_PROFILE.NOTIFICATIONS.SUCCESS_UNLOCK.MESSAGE'),
      });

      partnerLockStatus.refetch();
    } catch (e) {
      notify({
        level: 'error',
        title: I18n.t('PARTNER_PROFILE.NOTIFICATIONS.ERROR_UNLOCK.TITLE'),
        message: I18n.t('PARTNER_PROFILE.NOTIFICATIONS.ERROR_UNLOCK.MESSAGE'),
      });
    }
  };

  handleChangePassword = async ({ newPassword }) => {
    const {
      modals: { changePasswordModal },
      partner: { uuid },
      changePassword,
      notify,
    } = this.props;

    try {
      await changePassword({ variables: { uuid, newPassword } });

      notify({
        level: 'success',
        title: I18n.t('PARTNER_PROFILE.NOTIFICATIONS.SET_NEW_PASSWORD.SUCCESS.TITLE'),
        message: I18n.t('PARTNER_PROFILE.NOTIFICATIONS.SET_NEW_PASSWORD.SUCCESS.MESSAGE'),
      });

      changePasswordModal.hide();
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: 'error',
        title: I18n.t('PARTNER_PROFILE.NOTIFICATIONS.SET_NEW_PASSWORD.ERROR.TITLE'),
        message: error.error === 'error.validation.password.repeated'
          ? I18n.t(error.error)
          : I18n.t('PARTNER_PROFILE.NOTIFICATIONS.SET_NEW_PASSWORD.ERROR.MESSAGE'),
      });
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
        status,
      },
      partnerLockStatus,
    } = this.props;

    const locks = get(partnerLockStatus, 'data.loginLock') || false;

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
          <If condition={isMaxLoginAttemptReached(locks) && status !== 'CLOSED'}>
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
