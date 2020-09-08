import React, { Fragment, PureComponent } from 'react';
import { Field } from 'formik';
import I18n from 'i18n-js';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import { withPermission } from 'providers/PermissionsProvider';
import { FormikInputField } from 'components/Formik';
import { attributeLabels } from '../constants';

class ContactForm extends PureComponent {
  static propTypes = {
    permission: PropTypes.permission.isRequired,
  };

  render() {
    const { permission } = this.props;

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
            disabled={permission.denies(permissions.LEAD_PROFILE.FIELD_PHONE)}
            className="col-4"
          />
        </div>
        <div className="row">
          <Field
            name="mobile"
            component={FormikInputField}
            label={I18n.t(attributeLabels.mobile)}
            disabled={permission.denies(permissions.LEAD_PROFILE.FIELD_MOBILE)}
            className="col-4"
          />
        </div>
        <div className="row">
          <Field
            name="email"
            type="email"
            label={I18n.t(attributeLabels.email)}
            component={FormikInputField}
            disabled={permission.denies(permissions.LEAD_PROFILE.FIELD_EMAIL)}
            className="col-4"
          />
        </div>
      </Fragment>
    );
  }
}

export default withPermission(ContactForm);
