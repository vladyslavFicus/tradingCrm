import React, { PureComponent } from 'react';
import { graphql, compose } from 'react-apollo';
import moment from 'moment';
import { get } from 'lodash';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { getClickToCall, getActiveBrandConfig } from 'config';
import Uuid from 'components/Uuid';
import { withNotifications } from 'components/HighOrder';
import PermissionContent from 'components/PermissionContent';
import permissions from 'config/permissions';
import { clickToCall, updateRegulated as updateRegulatedMutation } from 'graphql/mutations/profile';
import PersonalInformationItem from 'components/Information/PersonalInformationItem';
import NotificationDetailsItem from 'components/Information/NotificationDetailsItem';
import PropTypes from 'constants/propTypes';
import { statuses as kycStatuses } from 'constants/kyc';
import { statuses as userStatuses } from 'constants/user';
import RegulatedForm from './RegulatedForm';

class Personal extends PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      address: PropTypes.string,
      affiliateId: PropTypes.string,
      birthDate: PropTypes.string,
      btag: PropTypes.string,
      city: PropTypes.string,
      completed: PropTypes.bool,
      country: PropTypes.string,
      email: PropTypes.string,
      gender: PropTypes.string,
      kycPersonalStatus: PropTypes.string,
      profileVerified: PropTypes.bool,
      languageCode: PropTypes.string,
      kycAddressStatus: PropTypes.string,
      phoneNumber: PropTypes.string,
      phoneNumberVerified: PropTypes.bool,
      postCode: PropTypes.string,
      login: PropTypes.string,
      username: PropTypes.string,
      playerUUID: PropTypes.string,
    }),
    updateRegulated: PropTypes.func.isRequired,
    operatorPhoneNumber: PropTypes.string,
    notify: PropTypes.func.isRequired,
    clickToCall: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    data: {},
    operatorPhoneNumber: null,
  };

  handleRegulatedChanged = async ({ provided, ...variables }) => {
    const {
      data: { playerUUID: profileId },
      updateRegulated,
      notify,
    } = this.props;

    const { data: { profile: { updateRegulated: { success } } } } = await updateRegulated({
      variables: {
        profileId,
        fatca: {
          provided,
        },
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

  render() {
    const {
      data: {
        birthDate,
        gender,
        email,
        country,
        address,
        kycAddressStatus,
        kycPersonalStatus,
        profileStatus,
        phoneNumberVerified,
        city,
      },
      operatorPhoneNumber,
      loading,
    } = this.props;

    const withCall = getClickToCall().isActive && !!operatorPhoneNumber;

    const tradingProfile = get(this.props.data, 'tradingProfile') || {};
    const affiliateProfile = get(tradingProfile, 'affiliateProfileDocument');
    const clientType = get(tradingProfile, 'clientType');

    const gdpr = get(tradingProfile, 'gdpr') || {};
    const spam = get(tradingProfile, 'spam') || {};
    const webCookies = get(tradingProfile, 'webCookies') || {};

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
              verified={kycPersonalStatus && kycPersonalStatus.status === kycStatuses.VERIFIED}
            />
            <PersonalInformationItem
              label={I18n.t('CLIENT_PROFILE.DETAILS.GENDER')}
              value={gender}
              verified={kycPersonalStatus && kycPersonalStatus.status === kycStatuses.VERIFIED}
            />
            <PersonalInformationItem
              label={I18n.t('CLIENT_PROFILE.DETAILS.PHONE')}
              value={tradingProfile.phone1}
              verified={phoneNumberVerified}
              withCall={withCall}
              onClickToCall={this.handleClickToCall(tradingProfile.phone1)}
            />
            <PersonalInformationItem
              label={I18n.t('CLIENT_PROFILE.DETAILS.ALT_PHONE')}
              value={tradingProfile.phone2}
              verified={phoneNumberVerified}
              withCall={withCall}
              onClickToCall={this.handleClickToCall(tradingProfile.phone2)}
            />
            <PersonalInformationItem
              label={I18n.t('CLIENT_PROFILE.DETAILS.EMAIL')}
              value={email}
              verified={profileStatus === userStatuses.ACTIVE}
            />
            <PersonalInformationItem
              label={I18n.t('CLIENT_PROFILE.DETAILS.ALT_EMAIL')}
              value={tradingProfile.email2}
              verified={profileStatus === userStatuses.ACTIVE}
            />
            <PersonalInformationItem
              label={I18n.t('CLIENT_PROFILE.DETAILS.FULL_ADDRESS')}
              value={address}
              verified={kycAddressStatus && kycAddressStatus.status === kycStatuses.VERIFIED}
            />
            <PersonalInformationItem
              label={I18n.t('CLIENT_PROFILE.DETAILS.COUNTRY')}
              value={country}
              verified={kycAddressStatus && kycAddressStatus.status === kycStatuses.VERIFIED}
            />
            <PersonalInformationItem
              label={I18n.t('CLIENT_PROFILE.DETAILS.CITY')}
              value={city}
              verified={kycAddressStatus && kycAddressStatus.status === kycStatuses.VERIFIED}
            />
            <If condition={affiliateProfile}>
              <If condition={affiliateProfile.affiliate}>
                <PersonalInformationItem
                  label={I18n.t('CLIENT_PROFILE.DETAILS.AFFILIATE')}
                  value={affiliateProfile.affiliate.fullName}
                />
              </If>
              <strong>{I18n.t('CLIENT_PROFILE.DETAILS.AFFILIATE_ID')}</strong>: <Uuid uuid={affiliateProfile._id} />
              <PersonalInformationItem
                label={I18n.t('CLIENT_PROFILE.DETAILS.SOURCE')}
                value={
                  affiliateProfile.source
                  || <span className="color-default">{I18n.t('CLIENT_PROFILE.DETAILS.NO_SOURCE')}</span>
                }
              />
              <PersonalInformationItem
                label={I18n.t('CLIENT_PROFILE.DETAILS.REFERRAL')}
                value={affiliateProfile.referral
                || <span className="color-default">{I18n.t('CLIENT_PROFILE.DETAILS.NO_REFERRAL')}</span>}
              />
            </If>
            <If condition={tradingProfile.convertedFromLeadUuid}>
              <div>
                <strong>{I18n.t('CLIENT_PROFILE.DETAILS.CONVERTED_FROM_LEAD')}</strong>
                {': '}
                <Uuid uuid={tradingProfile.convertedFromLeadUuid} />
              </div>
            </If>
            <If condition={tradingProfile.migrationId}>
              <div>
                <strong>{I18n.t('CLIENT_PROFILE.DETAILS.MIGRATION_ID')}</strong>
                {': '}
                <Uuid uuid={tradingProfile.migrationId} />
              </div>
            </If>
            <If condition={tradingProfile.fnsStatus}>
              <div>
                <strong>{I18n.t('CLIENT_PROFILE.DETAILS.FNS_STATUS')}</strong>
                {': '}
                <Uuid uuid={tradingProfile.fnsStatus} />
              </div>
            </If>
            <If condition={!loading}>
              <PermissionContent permissions={permissions.USER_PROFILE.CHANGE_FATCA_STATUS}>
                <RegulatedForm
                  handleChange={this.handleRegulatedChanged}
                  initialValues={{
                    fatca: get(tradingProfile, 'fatca'),
                    crs: get(tradingProfile, 'crs'),
                  }}
                />
              </PermissionContent>
              <If condition={getActiveBrandConfig().regulation.isActive}>
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
                  value={spam.marketNews}
                />
                <NotificationDetailsItem
                  label={I18n.t('CLIENT_PROFILE.DETAILS.SPAM.INFORMATION')}
                  value={spam.information}
                />
                <NotificationDetailsItem
                  label={I18n.t('CLIENT_PROFILE.DETAILS.SPAM.EDUCATIONAL')}
                  value={spam.educational}
                />
                <NotificationDetailsItem
                  label={I18n.t('CLIENT_PROFILE.DETAILS.SPAM.PROMOS_OFFERS')}
                  value={spam.promosAndOffers}
                />
                <NotificationDetailsItem
                  label={I18n.t('CLIENT_PROFILE.DETAILS.SPAM.STATISTICS_SUMMARY')}
                  value={spam.statisticsAndSummary}
                />
                <NotificationDetailsItem
                  className="margin-top-15"
                  label={I18n.t('CLIENT_PROFILE.DETAILS.WEB_COOKIES.TITLE')}
                  value={webCookies.enabled}
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
  withNotifications,
  connect(({ auth: { data: { phoneNumber: operatorPhoneNumber } } }) => ({ operatorPhoneNumber })),
  graphql(clickToCall, { name: 'clickToCall' }),
  graphql(updateRegulatedMutation, { name: 'updateRegulated' }),
)(Personal);
