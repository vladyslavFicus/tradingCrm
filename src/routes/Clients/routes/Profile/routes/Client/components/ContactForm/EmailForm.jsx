import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import I18n from 'i18n-js';
import PropTypes from 'prop-types';
import { Field, reduxForm, getFormSyncErrors, getFormValues } from 'redux-form';
import { InputField } from 'components/ReduxForm';
import PermissionContent from 'components/PermissionContent/PermissionContent';
import permissions from 'config/permissions';
import { createValidator } from 'utils/validator';

const FORM_NAME = 'updateProfileEmail';
const attributeLabels = {
  email: I18n.t('COMMON.EMAIL'),
  additionalEmail: I18n.t('COMMON.EMAIL_ALT'),
};

class EmailForm extends Component {
  static propTypes = {
    currentValues: PropTypes.shape({
      email: PropTypes.string,
    }),
    dirty: PropTypes.bool,
    valid: PropTypes.bool,
    disabled: PropTypes.bool,
    onVerifyEmailClick: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    emailVerified: PropTypes.bool,
  };

  static defaultProps = {
    currentValues: {},
    dirty: false,
    valid: true,
    disabled: false,
    emailVerified: false,
  };

  handleVerifyEmailClick = () => {
    const { currentValues, onVerifyEmailClick } = this.props;

    return onVerifyEmailClick(currentValues.email);
  };

  render() {
    const {
      handleSubmit,
      dirty,
      valid,
      disabled,
      emailVerified,
      onSubmit,
    } = this.props;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <PermissionContent permissions={permissions.USER_PROFILE.UPDATE_CONTACTS}>
          <div className="text-right">
            <If condition={dirty && valid && !disabled}>
              <button className="btn btn-sm btn-primary" type="submit">
                {I18n.t('COMMON.SAVE_CHANGES')}
              </button>
            </If>
          </div>
        </PermissionContent>
        <div className="form-row">
          <Field
            disabled
            name="email"
            label={attributeLabels.email}
            type="text"
            component={InputField}
            className="col-8"
          />
          <If condition={!emailVerified}>
            <PermissionContent permissions={permissions.USER_PROFILE.VERIFY_EMAIL}>
              <div className="col-4 mt-4">
                <button type="button" className="btn btn-primary" onClick={this.handleVerifyEmailClick}>
                  {I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.VERIFY_EMAIL')}
                </button>
              </div>
            </PermissionContent>
          </If>
          <Field
            name="additionalEmail"
            label={attributeLabels.additionalEmail}
            type="text"
            component={InputField}
            className="col-8"
          />
          <If condition={emailVerified}>
            <div className="col-4 mt-4">
              <button type="button" className="btn btn-verified">
                <i className="fa fa-check-circle-o" /> {I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.VERIFIED')}
              </button>
            </div>
          </If>
        </div>
      </form>
    );
  }
}

export default compose(
  connect(state => ({
    currentValues: getFormValues(FORM_NAME)(state),
    formSyncErrors: getFormSyncErrors(FORM_NAME)(state),
  })),
  reduxForm({
    form: FORM_NAME,
    validate: createValidator({
      email: 'required|email',
      additionalEmail: 'email',
    }, attributeLabels, false),
    enableReinitialize: true,
  }),
)(EmailForm);
