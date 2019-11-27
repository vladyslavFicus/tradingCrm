import React, { Component } from 'react';
import I18n from 'i18n-js';
// import { get } from 'lodash';
import PropTypes from 'constants/propTypes';
import Permissions from 'utils/permissions';
import permissions from 'config/permissions';
import { withPermission } from 'providers/PermissionsProvider';
import PersonalForm from './PersonalForm';

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
    auth: PropTypes.shape({
      uuid: PropTypes.string,
    }).isRequired,
    permission: PropTypes.shape({
      permissions: PropTypes.arrayOf(PropTypes.string),
      set: PropTypes.func,
    }).isRequired,
  };

  static defaultProps = {
    showNotes: false,
    showSalesStatus: false,
    showFTDAmount: false,
    allowedIpAddresses: [],
    forbiddenCountries: [],
  };

  get readOnly() {
    const permittedRights = [permissions.PARTNERS.UPDATE_PROFILE];

    return !(new Permissions(permittedRights).check(this.props.permission.permissions));
  }

  handleSubmit = async ({
    forbiddenCountries,
    firstName,
    lastName,
    country,
    phone,
    email,
    ...submittedPermissions
  }) => {
    const {
      match: { params: { id: operatorUUID } },
      updateProfile,
      notify,
    } = this.props;

    const { data: { partner: { updatePartner: { error } } } } = await updateProfile({
      variables: {
        uuid: operatorUUID,
        firstName,
        lastName,
        country,
        phone,
        email,
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
  };

  render() {
    const {
      profile: { data: { firstName, lastName, country, email, phone } },
      allowedIpAddresses,
      forbiddenCountries,
      showNotes,
      showSalesStatus,
      showFTDAmount,
    } = this.props;

    return (
      <div className="card-body">
        <div className="card">
          <div className="card-body">
            <PersonalForm
              initialValues={{
                allowedIpAddresses,
                forbiddenCountries,
                showSalesStatus,
                showFTDAmount,
                firstName,
                showNotes,
                lastName,
                country,
                email,
                phone,
              }}
              disabled={this.readOnly}
              onSubmit={this.handleSubmit}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withPermission(View);
