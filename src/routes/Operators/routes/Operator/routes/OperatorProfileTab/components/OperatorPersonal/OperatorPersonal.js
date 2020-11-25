import React, { PureComponent } from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import { withPermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import Permissions from 'utils/permissions';
import { createValidator, translateLabels } from 'utils/validator';
import countries from 'utils/countryList';
import { FormikSelectField, FormikInputField } from 'components/Formik';
import { Button } from 'components/UI';
import UpdateOperatorMutation from './graphql/UpdateOperatorMutation';
import './OperatorPersonal.scss';

const attributeLabels = {
  firstName: 'OPERATORS.PROFILE.PERSONAL_FORM.LABELS.FIRST_NAME',
  lastName: 'OPERATORS.PROFILE.PERSONAL_FORM.LABELS.LAST_NAME',
  phoneNumber: 'OPERATORS.PROFILE.PERSONAL_FORM.LABELS.PHONE',
  country: 'OPERATORS.PROFILE.PERSONAL_FORM.LABELS.COUNTRY',
  sip: 'OPERATORS.PROFILE.PERSONAL_FORM.LABELS.SIP',
  email: 'COMMON.EMAIL',
};

const validate = createValidator({
  firstName: ['required', 'string'],
  lastName: ['required', 'string'],
  email: ['required', 'email'],
  country: [`in:,${Object.keys(countries).join()}`],
  phoneNumber: 'string',
  sip: 'string',
}, translateLabels(attributeLabels), false);

class OperatorPersonal extends PureComponent {
  static propTypes = {
    notify: PropTypes.func.isRequired,
    operatorQuery: PropTypes.query({
      operator: PropTypes.operator,
    }).isRequired,
    updateOperator: PropTypes.func.isRequired,
    permission: PropTypes.permission.isRequired,
  };

  onSubmit = async (values) => {
    const {
      operatorQuery,
      updateOperator,
      notify,
    } = this.props;

    const uuid = operatorQuery.data?.operator?.uuid;

    try {
      await updateOperator({ variables: { uuid, ...values } });

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
      operatorQuery,
      permission: {
        permissions: currentPermissions,
      },
    } = this.props;

    const {
      phoneNumber,
      firstName,
      lastName,
      country,
      email,
      sip,
    } = operatorQuery.data?.operator || {};

    const isReadOnly = !(new Permissions(permissions.OPERATORS.UPDATE_PROFILE).check(currentPermissions));

    return (
      <Formik
        initialValues={{
          phoneNumber,
          firstName,
          lastName,
          country,
          email,
          sip,
        }}
        validate={validate}
        onSubmit={this.onSubmit}
        enableReinitialize
      >
        {({ isSubmitting, dirty }) => (
          <Form className="OperatorPersonal">
            <div className="OperatorPersonal__header">
              <div className="OperatorPersonal__title">
                {I18n.t('OPERATOR_PROFILE.PERSONAL_INFORMATION.TITLE')}
              </div>

              <div className="OperatorPersonal__actions">
                <If condition={dirty && !isSubmitting && !isReadOnly}>
                  <Button
                    small
                    primary
                    type="submit"
                    className="OperatorPersonal__action"
                  >
                    {I18n.t('COMMON.SAVE_CHANGES')}
                  </Button>
                </If>
              </div>
            </div>

            <div className="OperatorPersonal__fields">
              <Field
                name="firstName"
                className="OperatorPersonal__field"
                label={I18n.t(attributeLabels.firstName)}
                placeholder={I18n.t(attributeLabels.firstName)}
                component={FormikInputField}
                disabled={isSubmitting || isReadOnly}
              />

              <Field
                name="lastName"
                className="OperatorPersonal__field"
                label={I18n.t(attributeLabels.lastName)}
                placeholder={I18n.t(attributeLabels.lastName)}
                component={FormikInputField}
                disabled={isSubmitting || isReadOnly}
              />

              <Field
                name="email"
                className="OperatorPersonal__field"
                label={I18n.t(attributeLabels.email)}
                placeholder={I18n.t(attributeLabels.email)}
                component={FormikInputField}
                disabled
              />
            </div>

            <hr />

            <div className="OperatorPersonal__title">
              {I18n.t('OPERATOR_PROFILE.DETAILS.LABEL.CONTACTS')}
            </div>

            <div className="OperatorPersonal__fields">
              <Field
                name="phoneNumber"
                className="OperatorPersonal__field"
                label={I18n.t(attributeLabels.phoneNumber)}
                placeholder={I18n.t(attributeLabels.phoneNumber)}
                component={FormikInputField}
                disabled={isSubmitting || isReadOnly}
              />

              <Field
                name="sip"
                className="OperatorPersonal__field"
                label={I18n.t(attributeLabels.sip)}
                placeholder={I18n.t(attributeLabels.sip)}
                component={FormikInputField}
                disabled={isSubmitting || isReadOnly}
              />

              <Field
                name="country"
                className="OperatorPersonal__field"
                label={I18n.t(attributeLabels.country)}
                placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                component={FormikSelectField}
                disabled={isSubmitting || isReadOnly}
                withAnyOption
                searchable
              >
                {Object.keys(countries).map(countryCode => (
                  <option key={countryCode} value={countryCode}>
                    {countries[countryCode]}
                  </option>
                ))}
              </Field>
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}

export default compose(
  withPermission,
  withNotifications,
  withRequests({
    updateOperator: UpdateOperatorMutation,
  }),
)(OperatorPersonal);
