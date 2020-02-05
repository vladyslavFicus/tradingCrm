import React, { Component, Fragment } from 'react';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import Permissions from 'utils/permissions';
import permissions from 'config/permissions';
import { withPermission } from 'providers/PermissionsProvider';
import { roles, departments } from 'constants/brands';
import Regulated from 'components/Regulated';
import { hidePhone } from 'utils/hidePhone';
import { getBrandId } from 'config';
import PersonalForm from './PersonalForm';
import AddressForm from './AddressForm';
import ContactForm from './ContactForm';
import KycStatus from './Kyc/KycStatus';
import TransferAvailability from './TransferAvailability';
import BankDetailsForm from './BankDetailsForm';
import './View.scss';

const updatePersonalInformationPermissions = new Permissions(permissions.USER_PROFILE.UPDATE_PERSONAL_INFORMATION);
const updateAddressPermissions = new Permissions(permissions.USER_PROFILE.UPDATE_ADDRESS);
const updateContactsPermissions = new Permissions(permissions.USER_PROFILE.UPDATE_CONTACTS);

class View extends Component {
  static propTypes = {
    verifyPhone: PropTypes.func.isRequired,
    verifyEmail: PropTypes.func.isRequired,
    auth: PropTypes.auth.isRequired,
    updateAddress: PropTypes.func.isRequired,
    newProfile: PropTypes.newProfile.isRequired,
    permission: PropTypes.permission.isRequired,
  };

  static childContextTypes = {
    tradingOperatorAccessDisabled: PropTypes.bool.isRequired,
  };

  static contextTypes = {
    addNotification: PropTypes.func.isRequired,
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
        ...data,
      },
    });

    notify({
      level: error ? 'error' : 'success',
      title: I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.TITLE'),
      message: `${I18n.t('COMMON.ACTIONS.UPDATED')} 
      ${error ? I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY') : I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
    });
  };

  handleUpdateContacts = async (data) => {
    const {
      newProfile: {
        newProfile: {
          data: {
            contacts: { additionalPhone, phone },
          },
        },
      },
      updateContacts,
    } = this.props;

    const variables = this.phoneAccess()
      ? { ...data, additionalPhone, phone }
      : data;

    const {
      data: {
        profile: {
          updateContacts: { error },
        },
      },
    } = await updateContacts({
      variables,
    });

    this.context.addNotification({
      level: error ? 'error' : 'success',
      title: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE'),
      message: `${I18n.t('COMMON.ACTIONS.UPDATED')}
        ${error ? I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY') : I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
    });
  };

  handleVerifyPhone = async (currentPhone) => {
    const {
      newProfile: {
        newProfile: {
          data: {
            contacts: { phone: initialPhone },
          },
        },
      },
    } = this.props;

    const phone = this.phoneAccess()
      ? initialPhone
      : currentPhone;

    const {
      data: {
        profile: {
          verifyPhone: { error },
        },
      },
    } = await this.props.verifyPhone({ variables: { phone } });

    this.context.addNotification({
      level: error ? 'error' : 'success',
      title: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE'),
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

  phoneAccess = () => {
    const {
      auth: { department },
    } = this.props;

    return getBrandId() === 'topinvestus' && department === departments.SALES;
  };

  render() {
    const {
      newProfile: { loading },
      permission: { permissions: currentPermissions },
    } = this.props;

    const canUpdatePersonalInformation = updatePersonalInformationPermissions.check(currentPermissions);
    const canUpdateAddress = updateAddressPermissions.check(currentPermissions);
    const updateContacts = updateContactsPermissions.check(currentPermissions);

    if (loading) {
      return null;
    }

    const {
      newProfile: {
        newProfile: {
          data: {
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
            bankDetails,
            phoneVerified,
            emailVerified,
          },
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
                  <PersonalForm
                    initialValues={{
                      passport,
                      firstName,
                      lastName,
                      birthDate,
                      gender,
                      languageCode,
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
              <Regulated>
                <div className="card margin-right-20">
                  <div className="card-body">
                    <BankDetailsForm initialValues={bankDetails} disabled />
                  </div>
                </div>
              </Regulated>
            </div>
            <div className="client-small-col">
              <div className="card">
                <div className="card-body">
                  <KycStatus initialValues={{ kycStatus }} playerUUID={uuid} />
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <TransferAvailability
                    initialValues={{
                      internalTransfer: +internalTransfer,
                    }}
                    playerUUID={uuid}
                  />
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <ContactForm
                    verification={{ phoneVerified, emailVerified }}
                    onSubmit={this.handleUpdateContacts}
                    onVerifyPhoneClick={this.handleVerifyPhone}
                    onVerifyEmailClick={this.handleVerifyEmail}
                    initialValues={{
                      phone: this.phoneAccess() ? hidePhone(phone) : phone,
                      email,
                      additionalPhone: this.phoneAccess() ? hidePhone(additionalPhone) : additionalPhone,
                      additionalEmail,
                    }}
                    disabled={!updateContacts}
                    disabledAdditionalPhone={this.phoneAccess()}
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
