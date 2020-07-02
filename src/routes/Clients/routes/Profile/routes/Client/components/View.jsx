import React, { Component, Fragment } from 'react';
import I18n from 'i18n-js';
import { parseErrors } from 'apollo';
import PropTypes from 'constants/propTypes';
import Permissions from 'utils/permissions';
import permissions from 'config/permissions';
import { withPermission } from 'providers/PermissionsProvider';
import { roles, departments } from 'constants/brands';
import { decodeNullValues } from 'components/Formik/utils';
import PersonalInformationForm from './PersonalInformationForm';
import AddressForm from './AddressForm';
import ContactForm from './ContactForm';
import KycStatusForm from './KYCStatusForm';
import TransferAvailabilityForm from './TransferAvailabilityForm';
import EmailForm from './EmailForm';
import './View.scss';

const updatePersonalInformationPermissions = new Permissions(permissions.USER_PROFILE.UPDATE_PERSONAL_INFORMATION);
const updateAddressPermissions = new Permissions(permissions.USER_PROFILE.UPDATE_ADDRESS);
const updateContactsPermissions = new Permissions(permissions.USER_PROFILE.UPDATE_CONTACTS);

class View extends Component {
  static propTypes = {
    verifyEmail: PropTypes.func.isRequired,
    auth: PropTypes.auth.isRequired,
    updateAddress: PropTypes.func.isRequired,
    updateEmail: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    updatePersonalInformation: PropTypes.func.isRequired,
    profile: PropTypes.profile.isRequired,
    permission: PropTypes.permission.isRequired,
    modals: PropTypes.shape({
      confirmationModal: PropTypes.modalType,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }),
    }).isRequired,
  };

  static contextTypes = {
    addNotification: PropTypes.func.isRequired,
  };

  static childContextTypes = {
    tradingOperatorAccessDisabled: PropTypes.bool.isRequired,
  };

  getChildContext = () => ({
    tradingOperatorAccessDisabled: this.tradingOperatorAccessDisabled,
  });

  get tradingOperatorAccessDisabled() {
    const {
      auth: { department, role },
    } = this.props;

    return role === roles.ROLE1 && [departments.RETENTION, departments.SALES].includes(department);
  }

  handleUpdatePersonalInformation = async (data) => {
    const {
      match: {
        params: { id: playerUUID },
      },
      updatePersonalInformation,
      notify,
    } = this.props;

    const {
      data: {
        profile: {
          updatePersonalInformation: { error },
        },
      },
    } = await updatePersonalInformation({
      variables: {
        playerUUID,
        languageCode: data.language,
        ...decodeNullValues(data),
      },
    });

    notify({
      level: error ? 'error' : 'success',
      title: I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.TITLE'),
      message: `${I18n.t('COMMON.ACTIONS.UPDATED')}
      ${error ? I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY') : I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
    });
  };

  handleVerifyEmail = async () => {
    const {
      data: {
        profile: {
          verifyEmail: { error },
        },
      },
    } = await this.props.verifyEmail();

    this.context.addNotification({
      level: error ? 'error' : 'success',
      title: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE'),
      message: `${I18n.t('COMMON.ACTIONS.UPDATED')}
        ${error ? I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY') : I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
    });
  };

  handleUpdateAddress = async (data) => {
    const {
      data: {
        profile: {
          updateAddress: { error },
        },
      },
    } = await this.props.updateAddress({
      variables: {
        ...data,
      },
    });

    this.context.addNotification({
      level: error ? 'error' : 'success',
      title: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE'),
      message: `${I18n.t('COMMON.ACTIONS.UPDATED')}
        ${error ? I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY') : I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
    });
  };

  handleUpdateEmail = (data) => {
    this.props.modals.confirmationModal.show({
      onSubmit: this.updateEmail(data),
      modalTitle: I18n.t('PLAYER_PROFILE.PROFILE.EMAIL.EMAIL_CHANGE.TITLE'),
      actionText: I18n.t('PLAYER_PROFILE.PROFILE.EMAIL.EMAIL_CHANGE.TEXT'),
      submitButtonLabel: I18n.t('COMMON.OK'),
    });
  };

  updateEmail = variables => async () => {
    this.props.modals.confirmationModal.hide();

    try {
      await this.props.updateEmail({ variables });

      this.context.addNotification({
        level: 'success',
        title: I18n.t('COMMON.EMAIL'),
        message: I18n.t('COMMON.SAVE_CHANGES'),
      });
    } catch (e) {
      const { error } = parseErrors(e);

      if (error === 'error.entity.already.exist') {
        this.context.addNotification({
          level: 'error',
          title: I18n.t('COMMON.EMAIL'),
          message: I18n.t('error.validation.email.exists'),
        });
      }
    }
  };

  render() {
    const {
      profile: { loading },
      permission: { permissions: currentPermissions },
    } = this.props;

    const canUpdatePersonalInformation = updatePersonalInformationPermissions.check(currentPermissions);
    const canUpdateAddress = updateAddressPermissions.check(currentPermissions);
    const updateContacts = updateContactsPermissions.check(currentPermissions);

    if (loading) {
      return null;
    }

    const {
      profile: {
        profile: {
          passport,
          firstName,
          lastName,
          uuid,
          birthDate,
          gender,
          address,
          languageCode,
          contacts: { additionalEmail, additionalPhone, email, phone },
          kyc: { status: kycStatus },
          configuration: { internalTransfer },
          phoneVerified,
          emailVerified,
          identificationNumber,
          timeZone,
        },
      },
    } = this.props;

    return (
      <Fragment>
        <div className="tab-wrapper">
          <div className="client-flex-wrapper">
            <div className="client-big-col">
              <div className="card margin-right-20">
                <div className="card-body">
                  <PersonalInformationForm
                    initialValues={{
                      passport,
                      firstName,
                      lastName,
                      birthDate,
                      gender,
                      languageCode,
                      identificationNumber,
                      timeZone,
                    }}
                    onSubmit={this.handleUpdatePersonalInformation}
                    disabled={!canUpdatePersonalInformation}
                  />
                </div>
              </div>
              <div className="card margin-right-20">
                <div className="card-body">
                  <AddressForm
                    initialValues={address}
                    onSubmit={this.handleUpdateAddress}
                    disabled={!canUpdateAddress}
                  />
                </div>
              </div>
            </div>
            <div className="client-small-col">
              <div className="card">
                <div className="card-body">
                  <KycStatusForm kycStatus={kycStatus} playerUUID={uuid} />
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <TransferAvailabilityForm
                    internalTransfer={+internalTransfer}
                    playerUUID={uuid}
                  />
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <ContactForm
                    isPhoneVerified={phoneVerified}
                    phone={phone}
                    additionalPhone={additionalPhone}
                    additionalEmail={additionalEmail}
                    disabled={!updateContacts}
                    playerUUID={uuid}
                  />
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <EmailForm
                    verification={{ emailVerified }}
                    email={email}
                    onSubmit={this.handleUpdateEmail}
                    onVerifyEmailClick={this.handleVerifyEmail}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default withPermission(View);
