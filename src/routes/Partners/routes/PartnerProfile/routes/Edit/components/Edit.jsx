import React, { Component } from 'react';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import Permissions from 'utils/permissions';
import permissions from 'config/permissions';
import { withPermission } from 'providers/PermissionsProvider';
import PersonalForm from './PersonalForm';
import Schedule from './Schedule';

class View extends Component {
  static propTypes = {
    updateProfile: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    profile: PropTypes.shape({
      data: PropTypes.operatorProfile,
      error: PropTypes.any,
    }).isRequired,
    allowedIpAddresses: PropTypes.arrayOf(PropTypes.string),
    forbiddenCountries: PropTypes.arrayOf(PropTypes.string),
    showNotes: PropTypes.bool,
    showSalesStatus: PropTypes.bool,
    showFTDAmount: PropTypes.bool,
    showKycStatus: PropTypes.bool,
    auth: PropTypes.shape({
      uuid: PropTypes.string,
    }).isRequired,
    permission: PropTypes.shape({
      permissions: PropTypes.arrayOf(PropTypes.string),
      set: PropTypes.func,
    }).isRequired,
    notify: PropTypes.func.isRequired,
  };

  static defaultProps = {
    showNotes: false,
    showSalesStatus: false,
    showFTDAmount: false,
    showKycStatus: false,
    allowedIpAddresses: [],
    forbiddenCountries: [],
  };

  state = {
    serverError: '',
  };

  get readOnly() {
    const permittedRights = [permissions.PARTNERS.UPDATE_PROFILE];

    return !(new Permissions(permittedRights).check(this.props.permission.permissions));
  }

  handleSubmit = async ({
    externalAffiliateId,
    forbiddenCountries,
    affiliateType,
    firstName,
    lastName,
    country,
    public: allowedPublicApi,
    phone,
    email,
    tradingAccountAutocreation,
    tradingAccountType,
    tradingAccountCurrency,
    ...submittedPermissions
  }) => {
    const {
      match: { params: { id: affiliateUuid } },
      updateProfile,
      notify,
    } = this.props;

    const { data: { partner: { updatePartner: { error } } } } = await updateProfile({
      variables: {
        uuid: affiliateUuid,
        externalAffiliateId,
        affiliateType,
        firstName,
        lastName,
        country,
        phone,
        email,
        public: allowedPublicApi,
        tradingAccountAutocreation,
        ...(tradingAccountAutocreation === 'ALLOW' && {
          tradingAccountType,
          tradingAccountCurrency,
        }),
        permission: {
          forbiddenCountries: forbiddenCountries || [],
          ...submittedPermissions,
        },
      },
    });

    notify({
      level: error ? 'error' : 'success',
      title: error
        ? I18n.t('PARTNERS.NOTIFICATIONS.UPDATE_PARTNER_ERROR.TITLE')
        : I18n.t('PARTNERS.NOTIFICATIONS.UPDATE_PARTNER_SUCCESS.TITLE'),
      message: error
        ? I18n.t('PARTNERS.NOTIFICATIONS.UPDATE_PARTNER_ERROR.MESSAGE')
        : I18n.t('PARTNERS.NOTIFICATIONS.UPDATE_PARTNER_SUCCESS.MESSAGE'),
    });

    this.setState({ serverError: error ? error.error : '' });
  };

  render() {
    const {
      profile: {
        data: {
          public: allowedPublicApi,
          tradingAccountAutocreation,
          tradingAccountCurrency,
          tradingAccountType,
          externalAffiliateId,
          affiliateType,
          firstName,
          lastName,
          country,
          email,
          phone,
        },
      },
      allowedIpAddresses,
      forbiddenCountries,
      showNotes,
      showSalesStatus,
      showFTDAmount,
      showKycStatus,
      match: { params: { id: affiliateUuid } },
    } = this.props;

    const { serverError } = this.state;

    return (
      <div className="card-body">
        <div className="card">
          <div className="card-body">
            <PersonalForm
              initialValues={{
                tradingAccountAutocreation,
                tradingAccountCurrency,
                tradingAccountType,
                externalAffiliateId,
                allowedIpAddresses,
                forbiddenCountries,
                showSalesStatus,
                showFTDAmount,
                showKycStatus,
                affiliateType,
                firstName,
                showNotes,
                lastName,
                country,
                public: allowedPublicApi,
                email,
                phone,
              }}
              serverError={serverError}
              disabled={this.readOnly}
              onSubmit={this.handleSubmit}
            />
          </div>
        </div>
        <Schedule affiliateUuid={affiliateUuid} />
      </div>
    );
  }
}

export default withPermission(View);
