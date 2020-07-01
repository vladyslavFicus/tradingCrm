import React, { Component, Suspense } from 'react';
import I18n from 'i18n-js';
import { Switch, Redirect } from 'react-router-dom';
import { get } from 'lodash';
import Tabs from 'components/Tabs';
import NotFound from 'routes/NotFound';
import * as menu from 'config/menu';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import { isSales } from 'constants/hierarchyTypes';
import ChangePasswordModal from 'modals/ChangePasswordModal';
import HideDetails from 'components/HideDetails';
import Route from 'components/Route';
import SalesRules from 'components/SalesRules';
import Permissions from 'utils/permissions';
import OperatorEdit from '../routes/Edit';
import Feed from '../routes/Feed';
import Information from './Information';
import Header from './Header';

const MODAL_CHANGE_PASSWORD = 'change-password-modal';
const modalInitialState = {
  name: null,
  params: {},
};

class OperatorProfile extends Component {
  static propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
    }).isRequired,
    location: PropTypes.object.isRequired,
    data: PropTypes.operatorProfile.isRequired,
    availableStatuses: PropTypes.array.isRequired,
    changeStatus: PropTypes.func.isRequired,
    changePassword: PropTypes.func.isRequired,
    refetchOperator: PropTypes.func.isRequired,
    resetPassword: PropTypes.func.isRequired,
    authorities: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
    error: PropTypes.any,
    modals: PropTypes.shape({
      confirmActionModal: PropTypes.modalType,
    }).isRequired,
    getLoginLock: PropTypes.object.isRequired,
    unlockLoginMutation: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
  };

  static defaultProps = {
    error: null,
    authorities: {},
  };

  state = {
    modal: { ...modalInitialState },
  };

  handleResetPasswordClick = () => {
    const {
      data,
      modals: { confirmActionModal },
    } = this.props;

    confirmActionModal.show({
      onSubmit: this.handleResetPasswordSubmit,
      modalTitle: I18n.t('OPERATOR_PROFILE.MODALS.RESET_PASSWORD.TITLE'),
      actionText: I18n.t('OPERATOR_PROFILE.MODALS.RESET_PASSWORD.ACTION_TEXT'),
      fullName: [data.firstName, data.lastName].join(' '),
      uuid: data.uuid,
      additionalText: I18n.t('OPERATOR_PROFILE.MODALS.RESET_PASSWORD.ACTION_TARGET'),
      submitButtonLabel: I18n.t('OPERATOR_PROFILE.MODALS.RESET_PASSWORD.CONFIRM_ACTION'),
    });
  };

  handleResetPasswordSubmit = async () => {
    const {
      resetPassword,
      match: { params: { id } },
      modals: { confirmActionModal },
    } = this.props;

    await resetPassword({
      variables: {
        uuid: id,
      },
    });

    confirmActionModal.hide();
  };

  handleChangePasswordClick = () => {
    const { data: { firstName, lastName, uuid } } = this.props;

    this.handleOpenModal(MODAL_CHANGE_PASSWORD, {
      fullName: `${firstName} ${lastName}`,
      uuid,
    });
  };

  handleSubmitNewPassword = async ({ newPassword }) => {
    const { changePassword, notify, match: { params: { id: operatorUuid } } } = this.props;

    const response = await changePassword({ variables: { newPassword, operatorUuid } });
    const success = get(response, 'data.auth.changeOperatorPassword.success');

    notify({
      level: !success ? 'error' : 'success',
      title: !success
        ? I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.ERROR_SET_NEW_PASSWORD.TITLE')
        : I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.SUCCESS_SET_NEW_PASSWORD.TITLE'),
      message: !success
        ? I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.ERROR_SET_NEW_PASSWORD.MESSAGE')
        : I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.SUCCESS_SET_NEW_PASSWORD.MESSAGE'),
    });

    if (success) {
      this.handleCloseModal();
    }
  };

  handleOpenModal = (name, params) => {
    this.setState(({ modal }) => ({
      modal: {
        ...modal,
        name,
        params,
      },
    }));
  };

  handleCloseModal = () => {
    this.setState({ modal: { ...modalInitialState } });
  };

  unlockLogin = async () => {
    const { unlockLoginMutation, match: { params: { id: uuid } }, notify } = this.props;
    const response = await unlockLoginMutation({ variables: { uuid } });
    const success = get(response, 'data.auth.unlockLogin.success');

    if (success) {
      notify({
        level: 'success',
        title: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.SUCCESS_UNLOCK.TITLE'),
        message: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.SUCCESS_UNLOCK.MESSAGE'),
      });
    } else {
      notify({
        level: 'error',
        title: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.ERROR_UNLOCK.TITLE'),
        message: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.ERROR_UNLOCK.MESSAGE'),
      });
    }
  };

  render() {
    const { modal } = this.state;

    const {
      location,
      match: { params, path, url },
      data,
      isLoading,
      error,
      availableStatuses,
      changeStatus,
      refetchOperator,
      authorities,
      getLoginLock,
    } = this.props;

    if (error) {
      return <NotFound />;
    }

    if (isLoading) {
      return null;
    }

    const authoritiesData = get(authorities, 'data') || [];
    const loginLock = get(getLoginLock, 'loginLock') || {};
    const userType = get(data, 'hierarchy.userType');
    const tabs = [...menu.operatorProfileTabs];

    // Check if operator is SALES to show sales rules tab
    if (isSales(userType)) {
      tabs.splice(1, 0, {
        label: 'OPERATOR_PROFILE.TABS.SALES_RULES',
        url: '/operators/:id/sales-rules',
        permissions: new Permissions(permissions.SALES_RULES.GET_RULES),
      });
    }

    return (
      <div className="profile">
        <div className="profile__info">
          <Header
            data={data}
            availableStatuses={availableStatuses}
            onResetPasswordClick={this.handleResetPasswordClick}
            onChangePasswordClick={this.handleChangePasswordClick}
            onStatusChange={changeStatus}
            refetchOperator={refetchOperator}
            refetchLoginLock={getLoginLock.refetch}
            unlockLogin={this.unlockLogin}
            loginLock={loginLock}
          />
          <HideDetails>
            <Information
              data={data}
              authorities={authoritiesData}
            />
          </HideDetails>
        </div>
        <Tabs
          items={tabs}
          location={location}
          params={params}
        />
        <div className="card no-borders">
          <Suspense fallback={null}>
            <Switch>
              <Route path={`${path}/profile`} component={OperatorEdit} />
              <If condition={isSales(userType)}>
                <Route path={`${path}/sales-rules`} render={props => <SalesRules {...props} type="OPERATOR" />} />
              </If>
              <Route path={`${path}/feed`} component={Feed} />
              <Redirect to={`${url}/profile`} />
            </Switch>
          </Suspense>
        </div>
        {
          modal.name === MODAL_CHANGE_PASSWORD
          && (
            <ChangePasswordModal
              {...modal.params}
              onCloseModal={this.handleCloseModal}
              onSubmit={this.handleSubmitNewPassword}
            />
          )
        }
      </div>
    );
  }
}

export default OperatorProfile;
