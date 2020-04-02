import React, { Fragment, PureComponent } from 'react';
import { Field } from 'formik';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { FormikInputField } from 'components/Formik';
import { attributeLabels } from '../constants';

class ContactForm extends PureComponent {
  static propTypes = {
    isPhoneDisabled: PropTypes.bool.isRequired,
    isEmailDisabled: PropTypes.bool,
  };

  static defaultProps = {
    isEmailDisabled: false,
  };

  render() {
    const { isEmailDisabled, isPhoneDisabled } = this.props;

    return (
      <Fragment>
        <div className="row margin-bottom-20">
          <div className="col personal-form-heading">
            {I18n.t('LEAD_PROFILE.PERSONAL.CONTACTS_TITLE')}
          </div>
        </div>
        <div className="row">
          <Field
            name="phone"
            component={FormikInputField}
            label={I18n.t(attributeLabels.phone)}
            disabled={isPhoneDisabled}
            className="col-4"
          />
        </div>
        <div className="row">
          <Field
            name="mobile"
            component={FormikInputField}
            label={I18n.t(attributeLabels.mobile)}
            disabled={isPhoneDisabled}
            className="col-4"
          />
        </div>
        <div className="row">
          <Field
            name="email"
            type="email"
            label={I18n.t(attributeLabels.email)}
            component={FormikInputField}
            disabled={isEmailDisabled}
            className="col-4"
          />
        </div>
      </Fragment>
    );
  }
}

export default ContactForm;
