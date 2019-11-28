/* eslint-disable */

import React, { Component, Fragment } from 'react';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import Permissions from 'utils/permissions';
import permissions from 'config/permissions';
import { withPermission } from 'providers/PermissionsProvider';
import { roles, departments } from 'constants/brands';
import Regulated from 'components/Regulation';
import PersonalForm from './PersonalForm';
import AddressForm from './AddressForm';
import ContactForm from './ContactForm';
import KycStatus from './Kyc/KycStatus';
import TransferAvailability from './TransferAvailability';
import BankDetailsForm from './BankDetailsForm';
import './View.scss';
// import TabHeader from 'components/TabHeader';

const updatePersonalInformationPermissions = new Permissions(permissions.USER_PROFILE.UPDATE_PERSONAL_INFORMATION);
const updateAddressPermissions = new Permissions(permissions.USER_PROFILE.UPDATE_ADDRESS);
const updateContactsPermissions = new Permissions(permissions.USER_PROFILE.UPDATE_CONTACTS);

class View extends Component {
  static propTypes = {
    downloadFile: PropTypes.func.isRequired,
    verifyPhone: PropTypes.func.isRequired,
    verifyEmail: PropTypes.func.isRequired,
    canUpdateProfile: PropTypes.bool,
    profileUpdate: PropTypes.func.isRequired,
    auth: PropTypes.shape({
      department: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
    }).isRequired,
    refetchProfileDataOnSave: PropTypes.func.isRequired,
  };

  static childContextTypes = {
    tradingOperatorAccessDisabled: PropTypes.bool.isRequired,
  };

  static contextTypes = {
    addNotification: PropTypes.func.isRequired,
  };

  static defaultProps = {
    canUpdateProfile: false,
  };

  getChildContext = () => ({
    tradingOperatorAccessDisabled: this.tradingOperatorAccessDisabled,
  });

  get tradingOperatorAccessDisabled() {
    const { auth: { department, role } } = this.props;

    return role === roles.ROLE1 && ([departments.RETENTION, departments.SALES].includes(department));
  }

  handleUpdatePersonalInformation = async (data) => {
    const {
      match: {
        params: {
          id: playerUUID
        }
      },
      updatePersonalInformation,
      notify,
    } = this.props;

    const {
      data: {
        profile: {
          updatePersonalInformation: {
            success,
          }
        }
      }
    }  = await updatePersonalInformation({
      variables: {
        playerUUID,
        languageCode: data.language,
        ...data
      }
    });

    notify({
      level: success ? 'success' : 'error',
      title: I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.TITLE'),
      message: `${I18n.t('COMMON.ACTIONS.UPDATED')} ${success ? I18n.t('COMMON.ACTIONS.SUCCESSFULLY')
        : I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY')}`,
    });
  }

  handleUpdateContacts = async (data) => {
    const { updateContacts } = this.props;
    const {
      data: {
        profile: {
          updateContacts: {
            success,
          }
        }
      }
    } = await updateContacts({
      variables: {
        ...data,
      }
    });

    this.context.addNotification({
      level: success ? 'success' : 'error',
      title: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE'),
      message: `${I18n.t('COMMON.ACTIONS.UPDATED')}
        ${success
        ? I18n.t('COMMON.ACTIONS.SUCCESSFULLY')
        : I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY')}`,
    });
  };

  handleVerifyPhone = async (phone) => {
    const {
      data: {
        profile: {
          verifyPhone: {
            success,
          }
        }
      }
    } = await this.props.verifyPhone({ variables: { phone } });

    this.context.addNotification({
      level: success ? 'success' : 'error',
      title: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE'),
      message: `${I18n.t('COMMON.ACTIONS.UPDATED')}
        ${success
        ? I18n.t('COMMON.ACTIONS.SUCCESSFULLY')
        : I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY')}`,
    });
  };

  handleVerifyEmail = async () => {
    const {
      data: {
        profile: {
          verifyEmail: {
            success,
          }
        }
      }
    } = await this.props.verifyEmail();

    this.context.addNotification({
      level: success ? 'success' : 'error',
      title: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE'),
      message: `${I18n.t('COMMON.ACTIONS.UPDATED')}
        ${success
        ? I18n.t('COMMON.ACTIONS.SUCCESSFULLY')
        : I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY')}`,
    });
  };

  handleUpdateAddress = async (data) => {
    const {
      data: {
        profile: {
          updateAddress: {
            success,
          }
        }
      }
    } = await this.props.updateAddress({
      variables: {
        ...data,
      },
    });

    this.context.addNotification({
      level: success ? 'success' : 'error',
      title: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE'),
      message: `${I18n.t('COMMON.ACTIONS.UPDATED')}
        ${success
        ? I18n.t('COMMON.ACTIONS.SUCCESSFULLY')
        : I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY')}`,
    });
  };

  render() {
    const {
      newProfile: {
        loading,
      },
      permission: {
        permissions,
      }
    } = this.props;

    const canUpdatePersonalInformation = updatePersonalInformationPermissions.check(permissions);
    const canUpdateAddress = updateAddressPermissions.check(permissions);
    const updateContacts = updateContactsPermissions.check(permissions);

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
            contacts: {
              additionalEmail,
              additionalPhone,
              email,
              phone,
            },
            kyc: {
              status: kycStatus,
            },
            configuration: {
              internalTransfer,
            },
            bankDetails,
          }
        }
      },
    } = this.props;

    return (
      <Fragment>
        {/* <TabHeader title={I18n.t('CLIENT_PROFILE.PROFILE.TITLE')}>
          <PermissionContent permissions={permissions.USER_PROFILE.REQUEST_KYC}>
            <button
              id="request-kyc-button"
              type="button"
              className="btn btn-sm btn-primary-outline"
              onClick={this.handleOpenRequestKycVerificationModal}
            >
              {I18n.t('PLAYER_PROFILE.PROFILE.REQUEST_KYC_VERIFICATION')}
            </button>
          </PermissionContent>
        </TabHeader> */}
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
                    <BankDetailsForm
                      initialValues={bankDetails}
                      disabled
                    />
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
              {/*<Regulated>*/}
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
              {/*</Regulated>*/}
              <div className="card">
                <div className="card-body">
                  <ContactForm
                    profile={this.props.newProfile.newProfile.data}
                    contactData={{ phone, additionalPhone, email, additionalEmail }}
                    onSubmit={this.handleUpdateContacts}
                    onVerifyPhoneClick={this.handleVerifyPhone}
                    onVerifyEmailClick={this.handleVerifyEmail}
                    disabled={!updateContacts}
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
