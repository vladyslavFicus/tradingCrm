import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import I18n from 'i18n-js';
import moment from 'moment';
import { Formik, Form, Field } from 'formik';
import { withNotifications } from 'hoc';
import { withRequests, parseErrors } from 'apollo';
import permissions from 'config/permissions';
import { withPermission } from 'providers/PermissionsProvider';
import PropTypes from 'constants/propTypes';
import { FormikInputField, FormikSelectField, FormikDatePicker } from 'components/Formik';
import TabHeader from 'components/TabHeader';
import { Button } from 'components/UI';
import { createValidator, translateLabels } from 'utils/validator';
import formatLabel from 'utils/formatLabel';
import countryList, { getCountryCode } from 'utils/countryList';
import LeadQuery from './graphql/LeadQuery';
import UpdateLeadMutation from './graphql/UpdateLeadMutation';
import { attributeLabels, genders, AGE_YEARS_CONSTRAINT } from './constants';
import './LeadProfileTab.scss';

class LeadProfileTab extends PureComponent {
  static propTypes = {
    leadQuery: PropTypes.query({
      lead: PropTypes.lead,
    }).isRequired,
    permission: PropTypes.permission.isRequired,
    updateLead: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
  };

  // # Remove after DatePicker will be switched to new one
  ageValidator = (current) => {
    const requireAge = moment().subtract(AGE_YEARS_CONSTRAINT, 'year');

    return current.isBefore(requireAge);
  };

  handleSubmit = async (values, { setSubmitting }) => {
    const { leadQuery, updateLead, notify } = this.props;

    setSubmitting(false);

    try {
      await updateLead({ variables: values });

      leadQuery.refetch();

      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('LEAD_PROFILE.UPDATED'),
      });
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: 'error',
        title: I18n.t('LEAD_PROFILE.NOTIFICATION_FAILURE'),
        message: error.error === 'error.entity.already.exist'
          ? I18n.t('lead.error.entity.already.exist', { email: values.email })
          : I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  render() {
    const { leadQuery, permission } = this.props;

    const {
      uuid,
      brandId,
      name,
      surname,
      phone,
      mobile,
      email,
      country,
      birthDate,
      gender,
      city,
    } = leadQuery.data?.lead || {};

    return (
      <div className="LeadProfileTab">
        <TabHeader title={I18n.t('PLAYER_PROFILE.PROFILE.TITLE')} />

        <div className="LeadProfileTab__content">
          <div className="LeadProfileTab__form">
            <Formik
              initialValues={{
                uuid,
                brandId,
                name,
                surname,
                phone,
                mobile,
                email,
                country: getCountryCode(country),
                birthDate,
                gender,
                city,
              }}
              validate={createValidator({
                firstName: 'string',
                lastName: 'string',
                birthDate: 'regex:/^\\d{4}-\\d{2}-\\d{2}$/',
                identifier: 'string',
                country: `in:${Object.keys(countryList).join()}`,
                city: ['string', 'min:3'],
                postCode: ['string', 'min:3'],
                address: 'string',
                phone: 'string',
                mobile: 'string',
                email: permission.allows(permissions.LEAD_PROFILE.FIELD_EMAIL) ? 'email' : 'string',
              }, translateLabels(attributeLabels), false)}
              onSubmit={this.handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting, dirty }) => (
                <Form>
                  {/* Personal info */}
                  <div className="LeadProfileTab__form-header">
                    <div className="LeadProfileTab__form-title">
                      {I18n.t('LEAD_PROFILE.PERSONAL.INFO_TITLE')}
                    </div>

                    <If condition={dirty && !isSubmitting}>
                      <div className="LeadPtofileTab__form-actions">
                        <Button
                          small
                          primary
                          type="submit"
                        >
                          {I18n.t('COMMON.SAVE_CHANGES')}
                        </Button>
                      </div>
                    </If>
                  </div>

                  <div className="LeadProfileTab__form-fields">
                    <Field
                      name="name"
                      className="LeadProfileTab__form-field"
                      label={I18n.t(attributeLabels.name)}
                      component={FormikInputField}
                      disabled={isSubmitting}
                    />

                    <Field
                      name="surname"
                      className="LeadProfileTab__form-field"
                      label={I18n.t(attributeLabels.surname)}
                      component={FormikInputField}
                      disabled={isSubmitting}
                    />

                    {/* Change to new DatePicker in future */}
                    <FormikDatePicker
                      name="birthDate"
                      className="LeadProfileTab__form-field"
                      label={I18n.t(attributeLabels.birthDate)}
                      disabled={isSubmitting}
                      timeFormat={null}
                      isValidDate={this.ageValidator}
                    />

                    <Field
                      name="gender"
                      className="LeadProfileTab__form-field"
                      label={I18n.t(attributeLabels.gender)}
                      placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                      component={FormikSelectField}
                      disabled={isSubmitting}
                    >
                      {genders.map(item => (
                        <option key={item} value={item}>
                          {formatLabel(item)}
                        </option>
                      ))}
                    </Field>
                  </div>

                  <hr />

                  {/* Address form */}
                  <div className="LeadProfileTab__form-header">
                    <div className="LeadProfileTab__form-title">
                      {I18n.t('LEAD_PROFILE.PERSONAL.ADDRESS_TITLE')}
                    </div>
                  </div>

                  <div className="LeadProfileTab__form-fields">
                    <Field
                      name="country"
                      className="LeadProfileTab__form-field"
                      label={I18n.t(attributeLabels.country)}
                      placeholder={I18n.t('COMMON.SELECT_OPTION.COUNTRY')}
                      component={FormikSelectField}
                      disabled={isSubmitting}
                    >
                      {Object.entries(countryList).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value}
                        </option>
                      ))}
                    </Field>

                    <Field
                      name="city"
                      className="LeadProfileTab__form-field"
                      label={I18n.t(attributeLabels.city)}
                      component={FormikInputField}
                      disabled={isSubmitting}
                    />
                  </div>

                  <hr />

                  {/* Contact form */}
                  <div className="LeadProfileTab__form-header">
                    <div className="LeadProfileTab__form-title">
                      {I18n.t('LEAD_PROFILE.PERSONAL.CONTACTS_TITLE')}
                    </div>
                  </div>

                  <div className="LeadProfileTab__form-fields">
                    <Field
                      name="phone"
                      className="LeadProfileTab__form-field"
                      label={I18n.t(attributeLabels.phone)}
                      component={FormikInputField}
                      disabled={isSubmitting || permission.denies(permissions.LEAD_PROFILE.FIELD_PHONE)}
                    />

                    <Field
                      name="mobile"
                      className="LeadProfileTab__form-field"
                      label={I18n.t(attributeLabels.mobile)}
                      component={FormikInputField}
                      disabled={isSubmitting || permission.denies(permissions.LEAD_PROFILE.FIELD_MOBILE)}
                    />

                    <Field
                      name="email"
                      type="email"
                      className="LeadProfileTab__form-field"
                      label={I18n.t(attributeLabels.email)}
                      component={FormikInputField}
                      disabled={isSubmitting || permission.denies(permissions.LEAD_PROFILE.FIELD_EMAIL)}
                    />
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  withPermission,
  withNotifications,
  withRequests({
    leadQuery: LeadQuery,
    updateLead: UpdateLeadMutation,
  }),
)(LeadProfileTab);
