import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import withNotifications from 'hoc/withNotifications';
import { FormikSelectField, FormikInputField } from 'components/Formik';
import { Button } from 'components/UI';
import { createValidator, translateLabels } from 'utils/validator';
import countries from 'utils/countryList';
import { attributeLabels } from '../constants';
import UpdateOperatorPersonalFormMutation from './graphql/UpdateOperatorPersonalFormMutation';

const validate = createValidator({
  firstName: ['required', 'string'],
  lastName: ['required', 'string'],
  email: ['required', 'email'],
  country: [`in:,${Object.keys(countries).join()}`],
  phoneNumber: 'string',
  sip: 'string',
}, translateLabels(attributeLabels), false);

class OperatorPersonalForm extends PureComponent {
  static propTypes = {
    updateOperator: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    operatorProfile: PropTypes.operator.isRequired,
    disabled: PropTypes.bool.isRequired,
  };

  onSubmit = async (data) => {
    const { updateOperator, notify, operatorProfile: { uuid } } = this.props;
    try {
      await updateOperator({ variables: { uuid, ...data } });

      notify({
        level: 'success',
        title: I18n.t('OPERATORS.NOTIFICATIONS.UPDATE_OPERATOR_SUCCESS.TITLE'),
        message: I18n.t('OPERATORS.NOTIFICATIONS.UPDATE_OPERATOR_SUCCESS.MESSAGE'),
      });
    } catch (e) {
      notify({
        level: 'error',
        title: I18n.t('OPERATORS.NOTIFICATIONS.UPDATE_OPERATOR_ERROR.TITLE'),
        message: I18n.t('OPERATORS.NOTIFICATIONS.UPDATE_OPERATOR_ERROR.MESSAGE'),
      });
    }
  };

  render() {
    const {
      disabled,
      operatorProfile: { firstName, lastName, country, email, phoneNumber, sip },
    } = this.props;

    return (
      <Formik
        initialValues={{
          firstName,
          lastName,
          country,
          email,
          phoneNumber,
          sip: sip || '',
        }}
        validate={validate}
        onSubmit={this.onSubmit}
      >
        {({ isSubmitting, dirty }) => (
          <Form>
            <div className="row margin-bottom-20">
              <div className="col-xl-6 personal-form-heading">
                {I18n.t('OPERATOR_PROFILE.PERSONAL_INFORMATION.TITLE')}
              </div>
              <If condition={dirty && !disabled && !isSubmitting}>
                <div className="col-xl-6 text-right">
                  <Button
                    type="submit"
                    primary
                    small
                  >
                    {I18n.t('COMMON.SAVE_CHANGES')}
                  </Button>
                </div>
              </If>
            </div>
            <div className="row">
              <div className="col-xl-4">
                <Field
                  name="firstName"
                  label={I18n.t(attributeLabels.firstName)}
                  placeholder={I18n.t(attributeLabels.firstName)}
                  component={FormikInputField}
                  disabled={disabled}
                />
              </div>
              <div className="col-xl-4">
                <Field
                  name="lastName"
                  label={I18n.t(attributeLabels.lastName)}
                  placeholder={I18n.t(attributeLabels.lastName)}
                  component={FormikInputField}
                  disabled={disabled}
                />
              </div>
              <div className="col-xl-4">
                <Field
                  name="email"
                  label={I18n.t(attributeLabels.email)}
                  placeholder={I18n.t(attributeLabels.email)}
                  component={FormikInputField}
                  disabled
                />
              </div>
            </div>
            <hr />
            <div className="personal-form-heading margin-bottom-20">
              {I18n.t('OPERATOR_PROFILE.DETAILS.LABEL.CONTACTS')}
            </div>
            <div className="row">
              <div className="col-xl-4">
                <Field
                  name="phoneNumber"
                  label={I18n.t(attributeLabels.phoneNumber)}
                  placeholder={I18n.t(attributeLabels.phoneNumber)}
                  component={FormikInputField}
                  disabled={disabled}
                />
              </div>
              <div className="col-xl-4">
                <Field
                  name="sip"
                  label={I18n.t(attributeLabels.sip)}
                  placeholder={I18n.t(attributeLabels.sip)}
                  component={FormikInputField}
                  disabled={disabled}
                />
              </div>
              <div className="col-xl-4">
                <Field
                  name="country"
                  label={I18n.t(attributeLabels.country)}
                  component={FormikSelectField}
                  disabled={isSubmitting || disabled}
                  searchable
                >
                  {[
                    <option value="" key="any">{I18n.t('COMMON.SELECT_OPTION.COUNTRY')}</option>,
                    ...Object.keys(countries).map(countryName => (
                      <option key={countryName} value={countryName}>
                        {countries[countryName]}
                      </option>
                    )),
                  ]}
                </Field>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}

export default compose(
  withNotifications,
  withRequests({
    updateOperator: UpdateOperatorPersonalFormMutation,
  }),
)(OperatorPersonalForm);
