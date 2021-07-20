import React, { PureComponent } from 'react';
import { compose, withApollo } from 'react-apollo';
import moment from 'moment';
import I18n from 'i18n-js';
import { getBrand } from 'config';
import { withRequests } from 'apollo';
import { withNotifications, withModals } from 'hoc';
import Uuid from 'components/Uuid';
import Click2Call from 'components/Click2Call';
import Sms from 'components/Sms';
import { withPermission } from 'providers/PermissionsProvider';
import PermissionContent from 'components/PermissionContent';
import permissions from 'config/permissions';
import { PersonalInformationItem } from 'components/Information';
import PropTypes from 'constants/propTypes';
import { statuses as kycStatuses } from 'constants/kyc';
import { statuses as userStatuses } from 'constants/user';
import Permissions from 'utils/permissions';
import UpdateConfigurationMutation from './graphql/UpdateConfigurationMutation';
import EmailSelectModal from './components/EmailSelectModal';
import RegulatedForm from './components/RegulatedForm';
import './ClientPersonalInfo.scss';
import profileContactsQuery from '../../graphql/ProfileContactsQuery';

class ClientPersonalInfo extends PureComponent {
  static propTypes = {
    clientInfo: PropTypes.profile.isRequired,
    client: PropTypes.shape({
      query: PropTypes.func.isRequired,
    }).isRequired,
    profileContactsQuery: PropTypes.shape({
      additionalPhone: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
    }).isRequired,
    notify: PropTypes.func.isRequired,
    updateConfiguration: PropTypes.func.isRequired,
    modals: PropTypes.shape({
      emailSelectModal: PropTypes.modalType,
      emailPreviewModal: PropTypes.modalType,
    }).isRequired,
    permission: PropTypes.permission.isRequired,
  };

  state = {
    additionalPhone: undefined,
    phone: undefined,
  }

  handleRegulatedChanged = async (variables) => {
    const {
      clientInfo: { uuid: playerUUID },
      updateConfiguration,
      notify,
    } = this.props;

    try {
      await updateConfiguration({
        variables: {
          playerUUID,
          ...variables,
        },
      });

      notify({
        level: 'success',
        title: I18n.t('COMMON.ACTIONS.UPDATED'),
        message: I18n.t('COMMON.ACTIONS.SUCCESSFULLY'),
      });
    } catch (e) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.ACTIONS.UPDATED'),
        message: I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY'),
      });
    }
  };

  getProfileContacts = async () => {
    const { clientInfo: { uuid }, notify } = this.props.clientInfo;

    try {
      const { data: { profileContacts: { additionalPhone, phone } } } = await this.props.client.query({
        query: profileContactsQuery,
        variables: { profileUUID: uuid },
      });

      console.log('additionalPhone', additionalPhone);
      console.log('phone', phone);
    } catch {
      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('FILTER_SET.LOADING_FAILED'),
      });
    }
  }

  triggerEmailSelectModal = () => {
    const {
      clientInfo: { uuid, firstName, lastName },
      modals: { emailSelectModal } } = this.props;

    emailSelectModal.show({
      uuid,
      field: 'contacts.email',
      type: 'PROFILE',
      clientInfo: { firstName, lastName },
    });
  };

  handleReferrerClick = () => {
    const { clientInfo } = this.props;
    const uuid = clientInfo?.referrer?.uuid;

    if (!uuid) return;

    window.open(`/clients/${uuid}/profile`, '_blank');
  }

  render() {
    const {
      clientInfo: {
        uuid,
        birthDate,
        gender,
        convertedFromLeadUuid,
        migrationId,
        contacts: {
          email,
          additionalEmail,
        },
        address: {
          countryCode,
          city,
          address: fullAddress,
        },
        profileStatus,
        phoneVerified,
        configuration: {
          crs,
          fatca,
        },
        kyc: {
          status,
        },
        affiliate,
        clientType,
        referrer,
      },
      permission,
    } = this.props;

    const isSendEmailAvailable = (new Permissions(permissions, permissions.EMAIL_TEMPLATES.SEND_EMAIL))
      .check(permission.permissions)
      && getBrand().email.templatedEmails;

    return (
      <div className="ClientPersonalInfo">
        <div className="ClientPersonalInfo__title">
          {I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.TITLE')}
        </div>
        <div className="ClientPersonalInfo__content">
          <If condition={!!clientType}>
            <PersonalInformationItem
              label={I18n.t('CLIENT_PROFILE.DETAILS.CLIENT_TYPE')}
              value={I18n.t(`CLIENT_PROFILE.DETAILS.${clientType}`)}
            />
          </If>
          <PersonalInformationItem
            label={I18n.t('CLIENT_PROFILE.DETAILS.DATE_OF_BIRTH')}
            value={birthDate ? moment(birthDate).format('DD.MM.YYYY') : null}
            verified={status === kycStatuses.VERIFIED}
          />
          <PersonalInformationItem
            label={I18n.t('CLIENT_PROFILE.DETAILS.GENDER')}
            value={gender}
            verified={status === kycStatuses.VERIFIED}
          />
          <PersonalInformationItem
            label={I18n.t('CLIENT_PROFILE.DETAILS.PHONE')}
            value={this.state.phone || '**********'}
            verified={phoneVerified}
            additional={(
              <>
                <Sms uuid={uuid} field="contacts.phone" type="PROFILE" />
                <Click2Call uuid={uuid} field="contacts.phone" type="PROFILE" />
              </>
            )}
            className="ClientPersonalInfo__contacts"
          />
          <PersonalInformationItem
            label={I18n.t('CLIENT_PROFILE.DETAILS.ALT_PHONE')}
            value={this.state.additionalPhone || '**********'}
            additional={(
              <>
                <Sms uuid={uuid} field="contacts.additionalPhone" type="PROFILE" />
                <Click2Call uuid={uuid} field="contacts.additionalPhone" type="PROFILE" />
              </>
            )}
            className="ClientPersonalInfo__contacts"
          />
          <PersonalInformationItem
            label={I18n.t('CLIENT_PROFILE.DETAILS.EMAIL')}
            value={email}
            verified={profileStatus === userStatuses.VERIFIED}
            onClickSelectEmail={this.triggerEmailSelectModal}
            withSendEmail={isSendEmailAvailable}
            className="ClientPersonalInfo__contacts"
          />
          <PersonalInformationItem
            label={I18n.t('CLIENT_PROFILE.DETAILS.ALT_EMAIL')}
            value={additionalEmail}
            verified={profileStatus === userStatuses.VERIFIED}
            className="ClientPersonalInfo__contacts"
          />
          <PersonalInformationItem
            label={I18n.t('CLIENT_PROFILE.DETAILS.FULL_ADDRESS')}
            value={fullAddress}
            verified={status === kycStatuses.VERIFIED}
          />
          <PersonalInformationItem
            label={I18n.t('CLIENT_PROFILE.DETAILS.COUNTRY')}
            value={countryCode}
            verified={status === kycStatuses.VERIFIED}
          />
          <PersonalInformationItem
            label={I18n.t('CLIENT_PROFILE.DETAILS.CITY')}
            value={city}
            verified={status === kycStatuses.VERIFIED}
          />
          <If condition={affiliate}>
            <If condition={affiliate.partner}>
              <PersonalInformationItem
                label={I18n.t('CLIENT_PROFILE.DETAILS.AFFILIATE')}
                value={affiliate.partner.fullName}
              />
            </If>
            <PermissionContent permissions={permissions.USER_PROFILE.AFFILIATE_FIELD_UUID}>
              <strong>{I18n.t('CLIENT_PROFILE.DETAILS.AFFILIATE_ID')}</strong>: <Uuid uuid={affiliate.uuid} />
            </PermissionContent>
            <PermissionContent permissions={permissions.USER_PROFILE.AFFILIATE_FIELD_SOURCE}>
              <PersonalInformationItem
                label={I18n.t('CLIENT_PROFILE.DETAILS.SOURCE')}
                value={affiliate.source || (
                  <span className="ClientPersonalInfo__value ClientPersonalInfo__value--inactive">
                    {I18n.t('CLIENT_PROFILE.DETAILS.NO_SOURCE')}
                  </span>
                )}
              />
            </PermissionContent>
            <PermissionContent permissions={permissions.USER_PROFILE.AFFILIATE_FIELD_REFERRAL}>
              <PersonalInformationItem
                label={I18n.t('CLIENT_PROFILE.DETAILS.REFERRAL')}
                value={affiliate.referral || (
                  <span className="ClientPersonalInfo__value ClientPersonalInfo__value--inactive">
                    {I18n.t('CLIENT_PROFILE.DETAILS.NO_REFERRAL')}
                  </span>
                )}
              />
            </PermissionContent>
            <PermissionContent permissions={permissions.USER_PROFILE.AFFILIATE_FIELD_CAMPAIGN_ID}>
              <PersonalInformationItem
                label={I18n.t('CLIENT_PROFILE.DETAILS.CAMPAIGN_ID')}
                value={affiliate.campaignId}
              />
            </PermissionContent>
            <PermissionContent permissions={permissions.USER_PROFILE.AFFILIATE_FIELD_SMS}>
              <PersonalInformationItem
                label="SMS"
                value={affiliate.sms}
              />
            </PermissionContent>
          </If>
          <If condition={convertedFromLeadUuid}>
            <div>
              <strong>{I18n.t('CLIENT_PROFILE.DETAILS.CONVERTED_FROM_LEAD')}</strong>
              {': '}
              <Uuid uuid={convertedFromLeadUuid} />
            </div>
          </If>
          <If condition={migrationId}>
            <div>
              <strong>{I18n.t('CLIENT_PROFILE.DETAILS.MIGRATION_ID')}</strong>
              {': '}
              <Uuid uuid={migrationId} />
            </div>
          </If>
          <PermissionContent permissions={permissions.USER_PROFILE.CHANGE_CONFIGURATION}>
            <RegulatedForm
              handleChange={this.handleRegulatedChanged}
              initialValues={{
                fatca,
                crs,
              }}
            />
          </PermissionContent>
          <If condition={referrer?.fullName}>
            <PersonalInformationItem
              label={I18n.t('CLIENT_PROFILE.DETAILS.REFERRER')}
              value={referrer.fullName}
              onClickValue={this.handleReferrerClick}
            />
          </If>
        </div>
      </div>
    );
  }
}

export default compose(
  withApollo,
  withPermission,
  withNotifications,
  withModals({
    emailSelectModal: EmailSelectModal,
  }),
  withRequests({
    updateConfiguration: UpdateConfigurationMutation,
  }),
)(ClientPersonalInfo);
