import React, { Component, Fragment } from 'react';
import { graphql, compose } from 'react-apollo';
import I18n from 'i18n-js';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { withNotifications } from 'components/HighOrder';
import { SelectField } from 'components/ReduxForm';
import { updateKYCStatusMutation } from 'graphql/mutations/profile';
import { createValidator } from 'utils/validator';

const FORM_NAME = 'kycStatus';

const statuses = () => ({
  APPROVED: I18n.t('KYC_REQUESTS.STATUS.APPROVED'),
  APPROVED_AWAITING_REVIEW: I18n.t('KYC_REQUESTS.STATUS.APPROVED_AWAITING_REVIEW'),
  AWAITING_REVIEW: I18n.t('KYC_REQUESTS.STATUS.AWAITING_REVIEW'),
  FLAGGED_NON_COMPLIANT: I18n.t('KYC_REQUESTS.STATUS.FLAGGED_NON_COMPLIANT'),
  NO_KYC: I18n.t('KYC_REQUESTS.STATUS.NO_KYC'),
  PARTIAL: I18n.t('KYC_REQUESTS.STATUS.PARTIAL'),
  PARTIAL_KYC_CAN_TRADE: I18n.t('KYC_REQUESTS.STATUS.PARTIAL_KYC_CAN_TRADE'),
  PENDING: I18n.t('KYC_REQUESTS.STATUS.PENDING'),
  PRIOR_TO_REFUND: I18n.t('KYC_REQUESTS.STATUS.PRIOR_TO_REFUND'),
  REFUNDED_NON_COMPLIANT: I18n.t('KYC_REQUESTS.STATUS.REFUNDED_NON_COMPLIANT'),
  REJECTED: I18n.t('KYC_REQUESTS.STATUS.REJECTED'),
  RISK: I18n.t('KYC_REQUESTS.STATUS.RISK'),
});

class KycStatus extends Component {
  static propTypes = {
    initialValues: PropTypes.shape({
      kycStatus: PropTypes.string,
    }),
    notify: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    disabled: false,
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
      disabled,
    } = this.props;

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
              disabled={disabled}
              className="col-lg-6"
            >
              {Object.entries(statuses()).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </Field>
            <div className="col-4 mt-4-profile">
              <button type="submit" className="btn btn-primary width-full">
                {I18n.t('COMMON.BUTTONS.SAVE')}
              </button>
            </div>
          </div>
        </form>
      </Fragment>
    );
  }
}

export default compose(
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
