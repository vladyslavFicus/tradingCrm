import React, { Component } from 'react';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import PropTypes from 'prop-types';
import { Field, reduxForm, getFormSyncErrors, getFormValues } from 'redux-form';
import { InputField } from '../../../../../../components/ReduxForm';
import PermissionContent from '../../../../../../components/PermissionContent/PermissionContent';
import permissions from '../../../../../../config/permissions';
import { createValidator } from '../../../../../../utils/validator';
import { statuses as playerStatuses } from '../../../../../../constants/user';

const FORM_NAME = 'updateProfileEmail';
const attributeLabels = {
  email: I18n.t('COMMON.EMAIL'),
};

class EmailForm extends Component {
  static propTypes = {
    currentValues: PropTypes.shape({
      email: PropTypes.string,
    }),
    dirty: PropTypes.bool,
    submitting: PropTypes.bool,
    valid: PropTypes.bool,
    disabled: PropTypes.bool,
    onVerifyEmailClick: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    profileStatus: PropTypes.string,
  };

  static defaultProps = {
    currentValues: {},
    dirty: false,
    submitting: false,
    valid: true,
    disabled: false,
    profileStatus: '',
  };

  handleVerifyEmailClick = () => {
    const { currentValues, onVerifyEmailClick } = this.props;

    return onVerifyEmailClick(currentValues.email);
  };

  render() {
    const {
      handleSubmit,
      dirty,
      submitting,
      valid,
      disabled,
      profileStatus,
      onSubmit,
    } = this.props;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-md-6">
            <Field
              name="email"
              className="form-group player-profile__contact-input"
              label={attributeLabels.email}
              labelAddon={(
                profileStatus !== playerStatuses.INACTIVE &&
                <div className="verification-label color-success font-size-12">
                  <i className="fa fa-check-circle-o" /> {I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.VERIFIED')}
                </div>
              )}
              type="text"
              component={InputField}
              position="vertical"
              disabled={profileStatus !== playerStatuses.INACTIVE}
              showErrorMessage
              inputButton={
                <PermissionContent permissions={permissions.USER_PROFILE.VERIFY_EMAIL}>
                  <button type="button" className="btn btn-success-outline" onClick={this.handleVerifyEmailClick}>
                    {I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.VERIFY_EMAIL')}
                  </button>
                </PermissionContent>
              }
              showInputButton={profileStatus === playerStatuses.INACTIVE}
            />
          </div>
          <div className="col-md-6 text-right">
            {
              dirty && !submitting && valid && !disabled &&
              <button className="btn btn-sm btn-primary" type="submit">
                {I18n.t('COMMON.SAVE_CHANGES')}
              </button>
            }
          </div>
        </div>
      </form>
    );
  }
}

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
  formSyncErrors: getFormSyncErrors(FORM_NAME)(state),
}))(
  reduxForm({
    form: FORM_NAME,
    validate: createValidator({
      email: 'required|email',
    }, attributeLabels, false),
    enableReinitialize: true,
  })(EmailForm),
);
