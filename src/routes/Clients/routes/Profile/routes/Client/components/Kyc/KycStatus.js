import React, { Component, Fragment } from 'react';
import { graphql, compose } from 'react-apollo';
import classNames from 'classnames';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { Field, reduxForm } from 'redux-form';
import permissions from 'config/permissions';
import Permissions from 'utils/permissions';
import { createValidator } from 'utils/validator';
import { updateKYCStatusMutation } from 'graphql/mutations/profile';
import { withPermission } from 'providers/PermissionsProvider';
import { withNotifications } from 'components/HighOrder';
import { SelectField } from 'components/ReduxForm';
import { kycStatusesLabels } from 'constants/kycStatuses';

const FORM_NAME = 'kycStatus';

const updateKycStatusPermissions = new Permissions(permissions.USER_PROFILE.KYC_UPDATE);

class KycStatus extends Component {
  static propTypes = {
    initialValues: PropTypes.shape({
      kycStatus: PropTypes.string,
    }),
    permission: PropTypes.permission.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
  };

  static defaultProps = {
    initialValues: {},
  };

  handleChangeKycStatus = async ({ kycStatus }) => {
    const { playerUUID, updateKycStatus, notify } = this.props;
    const { error } = await updateKycStatus({
      variables: {
        playerUUID,
        kycStatus,
      },
    });

    notify({
      level: error ? 'error' : 'success',
      title: I18n.t('PLAYER_PROFILE.PROFILE.KYC_STATUS.TITLE'),
      message: error
        ? I18n.t('COMMON.SOMETHING_WRONG')
        : I18n.t('PLAYER_PROFILE.PROFILE.KYC_STATUS.SUCCESS_RESPONSE'),
    });
  };

  render() {
    const {
      handleSubmit,
      permission: {
        permissions: currentPermissions,
      },
    } = this.props;
    const isAvailableToChangeKysStatus = updateKycStatusPermissions.check(currentPermissions);

    return (
      <Fragment>
        <div className="col personal-form-heading row margin-bottom-20">
          {I18n.t('PLAYER_PROFILE.PROFILE.KYC_STATUS.TITLE')}
        </div>
        <form onSubmit={handleSubmit(this.handleChangeKycStatus)}>
          <div className="form-row">
            <Field
              name="kycStatus"
              label={I18n.t('PLAYER_PROFILE.PROFILE.KYC_STATUS.CURRENT_STATUS')}
              component={SelectField}
              disabled={!isAvailableToChangeKysStatus}
              className={classNames('', {
                'col-lg-6': isAvailableToChangeKysStatus,
                'col-lg-12': !isAvailableToChangeKysStatus,
              })}
            >
              {Object.entries(kycStatusesLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {I18n.t(label)}
                </option>
              ))}
            </Field>
            <If condition={isAvailableToChangeKysStatus}>
              <div className="col-4 mt-4-profile">
                <button type="submit" className="btn btn-primary width-full">
                  {I18n.t('COMMON.BUTTONS.SAVE')}
                </button>
              </div>
            </If>
          </div>
        </form>
      </Fragment>
    );
  }
}

export default compose(
  withPermission,
  withNotifications,
  reduxForm({
    form: FORM_NAME,
    validate: createValidator({
      kycStatus: 'string',
    }),
    enableReinitialize: true,
  }),
  graphql(updateKYCStatusMutation, {
    name: 'updateKycStatus',
  }),
)(KycStatus);
