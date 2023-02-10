import React, { PureComponent } from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import moment from 'moment';
import { Formik, Form, Field } from 'formik';
import { withApollo } from '@apollo/client/react/hoc';
import Trackify from '@hrzn/trackify';
import { withRequests, parseErrors } from 'apollo';
import { notify, LevelType } from 'providers/NotificationProvider';
import permissions from 'config/permissions';
import { withPermission } from 'providers/PermissionsProvider';
import PropTypes from 'constants/propTypes';
import { FormikInputField, FormikSelectField, FormikDatePicker } from 'components/Formik';
import TabHeader from 'components/TabHeader';
import { Button } from 'components/Buttons';
import { createValidator, translateLabels } from 'utils/validator';
import formatLabel from 'utils/formatLabel';
import countryList, { getCountryCode } from 'utils/countryList';
import { MIN_BIRTHDATE } from 'constants/user';
import { DATE_BASE_FORMAT } from 'components/DatePickers/constants';
import LeadQuery from './graphql/LeadQuery';
import UpdateLeadMutation from './graphql/UpdateLeadMutation';
import LeadPhoneQuery from './graphql/LeadPhoneQuery';
import LeadMobileQuery from './graphql/LeadMobileQuery';
import LeadEmailQuery from './graphql/LeadEmailQuery';
import { attributeLabels, genders, AGE_YEARS_CONSTRAINT } from './constants';
import './LeadProfileTab.scss';

class LeadProfileTab extends PureComponent {
  static propTypes = {
    client: PropTypes.shape({
      query: PropTypes.func.isRequired,
    }).isRequired,
    leadQuery: PropTypes.query({
      lead: PropTypes.lead,
    }).isRequired,
    permission: PropTypes.permission.isRequired,
    updateLead: PropTypes.func.isRequired,
  };

  state = {
    email: undefined,
    phone: undefined,
    mobile: undefined,
    isPhoneShown: false,
    isMobileShown: false,
    isEmailShown: false,
  };

  getLeadPhone = async () => {
    const { leadQuery } = this.props;

    const { uuid } = leadQuery.data?.lead || {};

    try {
      const { data: { leadContacts: { phone } } } = await this.props.client.query({
        query: LeadPhoneQuery,
        variables: { uuid },
        fetchPolicy: 'network-only',
      });

      Trackify.click('LEAD_PHONES_VIEWED', { eventLabel: uuid });

      this.setState({ phone, isPhoneShown: true });
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  }

  getLeadMobile = async () => {
    const { leadQuery } = this.props;

    const { uuid } = leadQuery.data?.lead || {};

    try {
      const { data: { leadContacts: { mobile } } } = await this.props.client.query({
        query: LeadMobileQuery,
        variables: { uuid },
        fetchPolicy: 'network-only',
      });

      Trackify.click('LEAD_PHONES_VIEWED', { eventLabel: uuid });

      this.setState({ mobile, isMobileShown: true });
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  }

  getLeadEmail = async () => {
    const { leadQuery } = this.props;

    const { uuid } = leadQuery.data?.lead || {};

    try {
      const { data: { leadContacts: { email } } } = await this.props.client.query({
        query: LeadEmailQuery,
        variables: { uuid },
        fetchPolicy: 'network-only',
      });

      Trackify.click('LEAD_EMAILS_VIEWED', { eventLabel: uuid });

      this.setState({ email, isEmailShown: true });
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  }

  handleSubmit = async (values, { setSubmitting }) => {
    const { leadQuery, updateLead } = this.props;
    const { isPhoneShown, isMobileShown, isEmailShown } = this.state;

    setSubmitting(false);

    const phone = isPhoneShown ? values.phone : undefined;
    const mobile = isMobileShown ? values.mobile : undefined;
    const email = isEmailShown ? values.email : undefined;

    try {
      await updateLead({
        variables: {
          ...values,
          phone,
          mobile,
          email,
        },
      });

      this.setState({ phone, mobile, email });

      leadQuery.refetch();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('LEAD_PROFILE.UPDATED'),
      });
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: LevelType.ERROR,
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
                phone: this.state.phone || phone,
                mobile: this.state.mobile || mobile,
                email: this.state.email || email,
                country: getCountryCode(country),
                birthDate,
                gender,
                city,
              }}
              validate={createValidator({
                firstName: 'string',
                lastName: 'string',
                birthDate: [
                  'date',
                  `minDate:${MIN_BIRTHDATE}`,
                  `maxDate:${moment().subtract(AGE_YEARS_CONSTRAINT, 'year').format(DATE_BASE_FORMAT)}`,
                ],
                identifier: 'string',
                country: `in:${Object.keys(countryList).join()}`,
                city: ['string', 'min:3'],
                postCode: ['string', 'min:3'],
                address: 'string',
                phone: 'string',
                mobile: 'string',
                email: (permission.allows(permissions.LEAD_PROFILE.FIELD_EMAIL) && this.state.isEmailShown)
                  ? 'email'
                  : 'string',
              }, translateLabels(attributeLabels), false,
              {
                'minDate.birthDate': I18n.t(
                  'ERRORS.DATE.INVALID_DATE',
                  { attributeName: I18n.t(attributeLabels.birthDate) },
                ),
                'maxDate.birthDate': I18n.t(
                  'ERRORS.DATE.INVALID_DATE',
                  { attributeName: I18n.t(attributeLabels.birthDate) },
                ),
              })}
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
                      <div className="LeadProfileTab__form-actions">
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

                    <Field
                      name="birthDate"
                      className="LeadProfileTab__form-field"
                      label={I18n.t(attributeLabels.birthDate)}
                      component={FormikDatePicker}
                      minDate={moment(MIN_BIRTHDATE)}
                      maxDate={moment().subtract(AGE_YEARS_CONSTRAINT, 'year')}
                      disabled={isSubmitting}
                      closeOnSelect
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
                      addition={
                        permission.allows(permissions.LEAD_PROFILE.FIELD_PHONE) && (
                          <Button
                            tertiary
                            className="LeadProfileTab__show-contacts-button"
                            onClick={this.getLeadPhone}
                          >
                            {I18n.t('COMMON.BUTTONS.SHOW')}
                          </Button>
                        )
                      }
                      additionPosition="right"
                      disabled={
                        isSubmitting
                        || permission.denies(permissions.LEAD_PROFILE.FIELD_PHONE)
                        || !this.state.isPhoneShown
                      }
                    />

                    <Field
                      name="mobile"
                      className="LeadProfileTab__form-field"
                      label={I18n.t(attributeLabels.mobile)}
                      component={FormikInputField}
                      addition={
                        permission.allows(permissions.LEAD_PROFILE.FIELD_MOBILE) && (
                          <Button
                            tertiary
                            className="LeadProfileTab__show-contacts-button"
                            onClick={this.getLeadMobile}
                          >
                            {I18n.t('COMMON.BUTTONS.SHOW')}
                          </Button>
                        )
                      }
                      additionPosition="right"
                      disabled={
                        isSubmitting
                        || permission.denies(permissions.LEAD_PROFILE.FIELD_MOBILE)
                        || !this.state.isMobileShown
                      }
                    />

                    <Field
                      name="email"
                      type="email"
                      className="LeadProfileTab__form-field"
                      label={I18n.t(attributeLabels.email)}
                      component={FormikInputField}
                      addition={
                        permission.allows(permissions.LEAD_PROFILE.FIELD_EMAIL) && (
                          <Button
                            tertiary
                            className="LeadProfileTab__show-contacts-button"
                            onClick={this.getLeadEmail}
                          >
                            {I18n.t('COMMON.BUTTONS.SHOW')}
                          </Button>
                        )
                      }
                      additionPosition="right"
                      disabled={
                        isSubmitting
                        || permission.denies(permissions.LEAD_PROFILE.FIELD_EMAIL)
                        || !this.state.isEmailShown
                      }
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
  withApollo,
  withPermission,
  withRequests({
    leadQuery: LeadQuery,
    updateLead: UpdateLeadMutation,
  }),
)(LeadProfileTab);
