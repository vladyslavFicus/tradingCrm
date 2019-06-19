import React, { Component, Fragment } from 'react';
import { graphql, compose } from 'react-apollo';
import { I18n } from 'react-redux-i18n';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { withNotifications } from 'components/HighOrder';
import { SelectField } from 'components/ReduxForm';
import { updateMutation } from 'graphql/mutations/profile';
import { createValidator } from 'utils/validator';

const FORM_NAME = 'kycStatus';

const statuses = () => ({
  PENDING: I18n.t('PLAYER_PROFILE.PROFILE.KYC_STATUS.STATUS.PENDING'),
  NO_KYC: I18n.t('PLAYER_PROFILE.PROFILE.KYC_STATUS.STATUS.NO_KYC'),
  AWAITING_REVIEW: I18n.t('PLAYER_PROFILE.PROFILE.KYC_STATUS.STATUS.AWAITING_REVIEW'),
  PARTIAL_KYC_CAN_TRADE: I18n.t('PLAYER_PROFILE.PROFILE.KYC_STATUS.STATUS.PARTIAL_KYC_CAN_TRADE'),
  FLAGGED_NON_COMPLIANT: I18n.t('PLAYER_PROFILE.PROFILE.KYC_STATUS.STATUS.FLAGGED_NON_COMPLIANT'),
  REFUNDED_NON_COMPLIANT: I18n.t('PLAYER_PROFILE.PROFILE.KYC_STATUS.STATUS.REFUNDED_NON_COMPLIANT'),
  PRIOR_TO_REFUND: I18n.t('PLAYER_PROFILE.PROFILE.KYC_STATUS.STATUS.PRIOR_TO_REFUND'),
  PARTIAL: I18n.t('PLAYER_PROFILE.PROFILE.KYC_STATUS.STATUS.PARTIAL'),
  APPROVED: I18n.t('PLAYER_PROFILE.PROFILE.KYC_STATUS.STATUS.APPROVED'),
  REJECTED: I18n.t('PLAYER_PROFILE.PROFILE.KYC_STATUS.STATUS.REJECTED'),
  RISK: I18n.t('PLAYER_PROFILE.PROFILE.KYC_STATUS.STATUS.RISK'),
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
            <div className="col-4 mt-4">
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
  graphql(updateMutation, {
    name: 'updateKycStatus',
  }),
)(KycStatus);
