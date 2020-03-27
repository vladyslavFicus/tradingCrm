import React, { PureComponent } from 'react';
import { graphql, compose } from 'react-apollo';
import moment from 'moment';
import I18n from 'i18n-js';
import { getClickToCall, getBrand } from 'config';
import { withNotifications, withModals } from 'hoc';
import Regulated from 'components/Regulated';
import Uuid from 'components/Uuid';
import { withStorage } from 'providers/StorageProvider';
import { withPermission } from 'providers/PermissionsProvider';
import PermissionContent from 'components/PermissionContent';
import permissions from 'config/permissions';
import { hideText } from 'utils/hideText';
import {
  clickToCall,
  updateConfigurationMutation,
} from 'graphql/mutations/profile';
import {
  PersonalInformationItem,
  // uncomment when email history will be rdy
  // PersonalInformationSentEmails
} from 'components/Information';
import NotificationDetailsItem from 'components/Information/NotificationDetailsItem';
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
    newProfile: PropTypes.newProfile,
    operatorPhoneNumber: PropTypes.string,
    notify: PropTypes.func.isRequired,
    clickToCall: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    modals: PropTypes.shape({
      emailTemplateSelectModal: PropTypes.modalType,
      emailPreviewModal: PropTypes.modalType,
    }).isRequired,
    auth: PropTypes.auth.isRequired,
    permission: PropTypes.permission.isRequired,
  };

  static defaultProps = {
    newProfile: {},
    operatorPhoneNumber: null,
  };

  handleRegulatedChanged = async (variables) => {
    const {
      newProfile: { uuid: playerUUID },
      updateConfiguration,
      notify,
    } = this.props;

    const { data: { profile: { updateConfiguration: { success } } } } = await updateConfiguration({
      variables: {
        playerUUID,
        ...variables,
      },
    });

    notify({
      level: success ? 'success' : 'error',
      title: I18n.t('COMMON.ACTIONS.UPDATED'),
      message: success
        ? I18n.t('COMMON.ACTIONS.SUCCESSFULLY')
        : I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY'),
    });
  };

  handleClickToCall = number => async () => {
    const { notify, operatorPhoneNumber } = this.props;

    const { data: { profile: { clickToCall: { success } } } } = await this.props.clickToCall(
      {
        variables: {
          number,
          agent: operatorPhoneNumber,
        },
      },
    );

    if (!success) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('PLAYER_PROFILE.PROFILE.CLICK_TO_CALL_FAILED'),
      });
    }
  };

  triggerEmailSelectModal = () => {
    const {
      newProfile: { contacts: { email }, firstName, lastName },
      modals: { emailSelectModal } } = this.props;

    emailSelectModal.show({
      clientInfo: { firstName, lastName, email },
    });
  };

  // uncomment when email history will be rdy
  // triggerEmailPreviewModal = (email) => {
  //   const { modals: { emailPreviewModal } } = this.props;
  //
  //   emailPreviewModal.show({
  //     email,
  //   });
  // };

  render() {
    if (this.props.loading) {
      return null;
    }

    const {
      newProfile: {
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
          gdpr,
          webCookies,
          subscription,
        },
        kyc: {
          status,
        },
        affiliate,
        clientType,
        // uncomment when email history will be rdy
        // sentEmails,
      },
      loading,
      auth: {
        department,
      },
      permission,
    } = this.props;

    const withCall = getClickToCall().isActive;
    const isPhoneHidden = getBrand().privatePhoneByDepartment.includes(department);
    const isEmailHidden = getBrand().privateEmailByDepartment.includes(department);
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
              value={isPhoneHidden ? hideText(phone) : phone}
              verified={phoneVerified}
              withCall={withCall}
              onClickToCall={this.handleClickToCall(phone)}
              className="Personal__contacts"
            />
            <PersonalInformationItem
              label={I18n.t('CLIENT_PROFILE.DETAILS.ALT_PHONE')}
              value={isPhoneHidden ? hideText(additionalPhone) : additionalPhone}
              withCall={withCall}
              onClickToCall={this.handleClickToCall(additionalPhone)}
              className="Personal__contacts"
            />
            <PersonalInformationItem
              label={I18n.t('CLIENT_PROFILE.DETAILS.EMAIL')}
              value={isEmailHidden ? hideText(email) : email}
              verified={profileStatus === userStatuses.VERIFIED}
              onClickSelectEmail={this.triggerEmailSelectModal}
              withSendEmail={isSendEmailAvailable}
              className="Personal__contacts"
            />
            <PersonalInformationItem
              label={I18n.t('CLIENT_PROFILE.DETAILS.ALT_EMAIL')}
              value={isEmailHidden ? hideText(additionalEmail) : additionalEmail}
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
            <If condition={!loading}>
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
              <Regulated>
                <div className="account-details__label margin-top-15">
                  {I18n.t('CLIENT_PROFILE.DETAILS.GDPR.TITLE')}
                </div>
                <NotificationDetailsItem
                  label={I18n.t('CLIENT_PROFILE.DETAILS.GDPR.SMS')}
                  value={gdpr.sms}
                />
                <NotificationDetailsItem
                  label={I18n.t('CLIENT_PROFILE.DETAILS.GDPR.EMAIL')}
                  value={gdpr.email}
                />
                <NotificationDetailsItem
                  label={I18n.t('CLIENT_PROFILE.DETAILS.GDPR.PHONE')}
                  value={gdpr.phone}
                />
                <NotificationDetailsItem
                  label={I18n.t('CLIENT_PROFILE.DETAILS.GDPR.SOCIAL_MEDIA')}
                  value={gdpr.socialMedia}
                />
                <div className="account-details__label margin-top-15">
                  {I18n.t('CLIENT_PROFILE.DETAILS.SPAM.TITLE')}
                </div>
                <NotificationDetailsItem
                  label={I18n.t('CLIENT_PROFILE.DETAILS.SPAM.MARKET_NEWS')}
                  value={subscription.marketNews}
                />
                <NotificationDetailsItem
                  label={I18n.t('CLIENT_PROFILE.DETAILS.SPAM.INFORMATION')}
                  value={subscription.information}
                />
                <NotificationDetailsItem
                  label={I18n.t('CLIENT_PROFILE.DETAILS.SPAM.EDUCATIONAL')}
                  value={subscription.educational}
                />
                <NotificationDetailsItem
                  label={I18n.t('CLIENT_PROFILE.DETAILS.SPAM.PROMOS_OFFERS')}
                  value={subscription.promosAndOffers}
                />
                <NotificationDetailsItem
                  label={I18n.t('CLIENT_PROFILE.DETAILS.SPAM.STATISTICS_SUMMARY')}
                  value={subscription.statisticsAndSummary}
                />
                <NotificationDetailsItem
                  className="margin-top-15"
                  label={I18n.t('CLIENT_PROFILE.DETAILS.WEB_COOKIES.TITLE')}
                  value={webCookies.enabled}
                />
              </Regulated>
            </If>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  withModals({
    emailSelectModal: EmailSelectModal,
    // uncomment when email history will be rdy
    // emailPreviewModal: EmailPreviewModal,
  }),
  withNotifications,
  graphql(clickToCall, {
    name: 'clickToCall',
  }),
  graphql(updateConfigurationMutation, {
    name: 'updateConfiguration',
  }),
  withStorage(['auth']),
  withPermission,
)(Personal);
