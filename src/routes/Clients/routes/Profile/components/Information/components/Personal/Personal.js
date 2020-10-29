import React, { PureComponent } from 'react';
import { graphql, compose } from 'react-apollo';
import moment from 'moment';
import I18n from 'i18n-js';
import { getBrand } from 'config';
import { withNotifications, withModals } from 'hoc';
import Uuid from 'components/Uuid';
import Click2Call from 'components/Click2Call';
import { withPermission } from 'providers/PermissionsProvider';
import PermissionContent from 'components/PermissionContent';
import permissions from 'config/permissions';
import {
  updateConfigurationMutation,
} from 'graphql/mutations/profile';
import {
  PersonalInformationItem,
  // uncomment when email history will be rdy
  // PersonalInformationSentEmails
} from 'components/Information';
// uncomment when email history will be rdy
// import EmailPreviewModal from 'components/EmailPreviewModal';
import PropTypes from 'constants/propTypes';
import { statuses as kycStatuses } from 'constants/kyc';
import { statuses as userStatuses } from 'constants/user';
import Permissions from 'utils/permissions';
import EmailSelectModal from '../EmailSelectModal';
import RegulatedForm from '../RegulatedForm';
import './Personal.scss';

class Personal extends PureComponent {
  static propTypes = {
    profile: PropTypes.profile.isRequired,
    profileLoading: PropTypes.bool.isRequired,
    notify: PropTypes.func.isRequired,
    updateConfiguration: PropTypes.func.isRequired,
    modals: PropTypes.shape({
      emailSelectModal: PropTypes.modalType,
      emailPreviewModal: PropTypes.modalType,
    }).isRequired,
    permission: PropTypes.permission.isRequired,
  };

  handleRegulatedChanged = async (variables) => {
    const {
      profile: { uuid: playerUUID },
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

  triggerEmailSelectModal = () => {
    const {
      profile: { uuid, firstName, lastName },
      modals: { emailSelectModal } } = this.props;

    emailSelectModal.show({
      uuid,
      field: 'contacts.email',
      type: 'PROFILE',
      clientInfo: { firstName, lastName },
    });
  };

  handleReferrerClick = () => {
    const { profile } = this.props;
    const uuid = profile?.referrer?.uuid;

    if (!uuid) return;

    window.open(`/clients/${uuid}/profile`, '_blank');
  }

  // uncomment when email history will be rdy
  // triggerEmailPreviewModal = (email) => {
  //   const { modals: { emailPreviewModal } } = this.props;
  //
  //   emailPreviewModal.show({
  //     email,
  //   });
  // };

  render() {
    if (this.props.profileLoading) {
      return null;
    }

    const {
      profile: {
        uuid,
        birthDate,
        gender,
        convertedFromLeadUuid,
        migrationId,
        contacts: {
          email,
          phone,
          additionalEmail,
          additionalPhone,
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
        // uncomment when email history will be rdy
        // sentEmails,
      },
      profileLoading,
      permission,
    } = this.props;

    const isSendEmailAvailable = (new Permissions(permissions, permissions.EMAIL_TEMPLATES.SEND_EMAIL))
      .check(permission.permissions)
      && getBrand().email.templatedEmails;

    return (
      <div className="account-details__personal-info">
        <span className="account-details__label">
          {I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.TITLE')}
        </span>
        <div className="card">
          <div className="card-body">
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
              value={phone}
              verified={phoneVerified}
              additional={<Click2Call uuid={uuid} field="contacts.phone" type="PROFILE" />}
              className="Personal__contacts"
            />
            <PersonalInformationItem
              label={I18n.t('CLIENT_PROFILE.DETAILS.ALT_PHONE')}
              value={additionalPhone}
              additional={<Click2Call uuid={uuid} field="contacts.additionalPhone" type="PROFILE" />}
              className="Personal__contacts"
            />
            <PersonalInformationItem
              label={I18n.t('CLIENT_PROFILE.DETAILS.EMAIL')}
              value={email}
              verified={profileStatus === userStatuses.VERIFIED}
              onClickSelectEmail={this.triggerEmailSelectModal}
              withSendEmail={isSendEmailAvailable}
              className="Personal__contacts"
            />
            <PersonalInformationItem
              label={I18n.t('CLIENT_PROFILE.DETAILS.ALT_EMAIL')}
              value={additionalEmail}
              verified={profileStatus === userStatuses.VERIFIED}
              className="Personal__contacts"
            />
            {/* uncomment rows after email history will be rdy */}
            {/* <PermissionContent permissions={permissions.EMAIL_TEMPLATES.GET_EMAIL_TEMPLATES}> */}
            {/*   <PersonalInformationSentEmails */}
            {/*     label={I18n.t('CLIENT_PROFILE.DETAILS.SENT_EMAILS')} */}
            {/*     emails={sentEmails} */}
            {/*     onEmailClick={this.triggerEmailPreviewModal} */}
            {/*   /> */}
            {/* </PermissionContent> */}
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
              <strong>{I18n.t('CLIENT_PROFILE.DETAILS.AFFILIATE_ID')}</strong>: <Uuid uuid={affiliate.uuid} />
              <PersonalInformationItem
                label={I18n.t('CLIENT_PROFILE.DETAILS.SOURCE')}
                value={
                  affiliate.source
                  || <span className="color-default">{I18n.t('CLIENT_PROFILE.DETAILS.NO_SOURCE')}</span>
                }
              />
              <PersonalInformationItem
                label={I18n.t('CLIENT_PROFILE.DETAILS.REFERRAL')}
                value={affiliate.referral
                || <span className="color-default">{I18n.t('CLIENT_PROFILE.DETAILS.NO_REFERRAL')}</span>}
              />
              <PersonalInformationItem
                label={I18n.t('CLIENT_PROFILE.DETAILS.CAMPAIGN_ID')}
                value={affiliate.campaignId}
              />
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
            <If condition={!profileLoading}>
              <PermissionContent permissions={permissions.USER_PROFILE.CHANGE_CONFIGURATION}>
                <RegulatedForm
                  handleChange={this.handleRegulatedChanged}
                  initialValues={{
                    fatca,
                    crs,
                  }}
                />
              </PermissionContent>
              <PersonalInformationItem
                label="SMS"
                value={affiliate && affiliate.sms}
              />
              <If condition={referrer?.fullName}>
                <PersonalInformationItem
                  label={I18n.t('CLIENT_PROFILE.DETAILS.REFERRER')}
                  value={referrer.fullName}
                  onClickValue={this.handleReferrerClick}
                />
              </If>
            </If>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  withPermission,
  withNotifications,
  withModals({
    emailSelectModal: EmailSelectModal,
    // uncomment when email history will be rdy
    // emailPreviewModal: EmailPreviewModal,
  }),
  graphql(updateConfigurationMutation, {
    name: 'updateConfiguration',
  }),
)(Personal);
