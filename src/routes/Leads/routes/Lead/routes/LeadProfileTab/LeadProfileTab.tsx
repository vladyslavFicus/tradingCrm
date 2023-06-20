import React, { useState } from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import { Formik, Form, Field } from 'formik';
import Trackify from '@hrzn/trackify';
import { parseErrors } from 'apollo';
import { Lead } from '__generated__/types';
import permissions from 'config/permissions';
import { usePermission } from 'providers/PermissionsProvider';
import { notify, LevelType } from 'providers/NotificationProvider';
import { FormikInputField, FormikSelectField, FormikDatePicker } from 'components/Formik';
import TabHeader from 'components/TabHeader';
import { Button } from 'components/Buttons';
import { createValidator, translateLabels } from 'utils/validator';
import formatLabel from 'utils/formatLabel';
import countryList, { getCountryCode } from 'utils/countryList';
import { MIN_BIRTHDATE } from 'constants/user';
import { DATE_BASE_FORMAT } from 'components/DatePickers/constants';
import { useLeadEmailQueryLazyQuery } from './graphql/__generated__/LeadEmailQuery';
import { useLeadMobileQueryLazyQuery } from './graphql/__generated__/LeadMobileQuery';
import { useLeadPhoneQueryLazyQuery } from './graphql/__generated__/LeadPhoneQuery';
import { useUpdateLeadMutation } from './graphql/__generated__/UpdateLeadMutation';
import { attributeLabels, genders, AGE_YEARS_CONSTRAINT } from './constants';
import './LeadProfileTab.scss';

type FormValues = {
  name: string,
  surname: string,
  birthDate: string,
  gender: string,
  country: string,
  city: string,
  phone: string,
  mobile: string,
  email: string,
};

type State = {
  email?: string,
  phone?: string,
  mobile?: string,
  isPhoneShown: boolean,
  isMobileShown: boolean,
  isEmailShown: boolean,
};

type Props = {
  lead: Lead,
  onRefetch: () => void,
};

const LeadProfileTab = (props: Props) => {
  const { lead, onRefetch } = props;

  const { uuid, brandId, name, surname, country, birthDate, gender, city } = lead;

  const [state, setState] = useState<State>({ isPhoneShown: false, isMobileShown: false, isEmailShown: false });
  const { isPhoneShown, isMobileShown, isEmailShown } = state;

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowEmailField = permission.allows(permissions.LEAD_PROFILE.FIELD_EMAIL);
  const allowPhoneField = permission.allows(permissions.LEAD_PROFILE.FIELD_PHONE);
  const allowMobileField = permission.allows(permissions.LEAD_PROFILE.FIELD_MOBILE);

  // ===== Requests ===== //
  const [leadEmailQuery] = useLeadEmailQueryLazyQuery({ fetchPolicy: 'network-only' });
  const [leadMobileQuery] = useLeadMobileQueryLazyQuery({ fetchPolicy: 'network-only' });
  const [leadPhoneQuery] = useLeadPhoneQueryLazyQuery({ fetchPolicy: 'network-only' });
  const [updateLeadMutation] = useUpdateLeadMutation();

  // ===== Handlers ===== //
  const handleSubmit = async (values: FormValues) => {
    const phone = (isPhoneShown && values.phone) ? values.phone : null;
    const mobile = (isMobileShown && values.mobile) ? values.mobile : null;
    const email = (isEmailShown && values.email) ? values.email : null;

    try {
      await updateLeadMutation({
        variables: {
          uuid,
          ...values,
          phone,
          mobile,
          email,
        },
      });

      await onRefetch();

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

  const handleGetLeadEmail = async () => {
    try {
      const { data } = await leadEmailQuery({ variables: { uuid } });
      const email = data?.leadContacts.email;

      Trackify.click('LEAD_EMAILS_VIEWED', { eventLabel: uuid });

      setState({ ...state, email, isEmailShown: true });
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.ERROR'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  const handleGetLeadMobile = async () => {
    try {
      const { data } = await leadMobileQuery({ variables: { uuid } });
      const mobile = data?.leadContacts.mobile || undefined;

      Trackify.click('LEAD_PHONES_VIEWED', { eventLabel: uuid });

      setState({ ...state, mobile, isMobileShown: true });
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.ERROR'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  const handleGetLeadPhone = async () => {
    try {
      const { data } = await leadPhoneQuery({ variables: { uuid } });
      const phone = data?.leadContacts.phone;

      Trackify.click('LEAD_PHONES_VIEWED', { eventLabel: uuid });

      setState({ ...state, phone, isPhoneShown: true });
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.ERROR'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  return (
    <div className="LeadProfileTab">
      <TabHeader title={I18n.t('PLAYER_PROFILE.PROFILE.TITLE')} />

      <div className="LeadProfileTab__content">
        <div className="LeadProfileTab__form">
          <Formik
            initialValues={{
              brandId,
              name,
              surname,
              phone: state.phone || lead.phone || '',
              mobile: state.mobile || lead.mobile || '',
              email: state.email || lead.email || '',
              country: getCountryCode(country || '') || '',
              birthDate: birthDate || '',
              gender: gender || '',
              city: city || '',
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
              email: (allowEmailField && isEmailShown)
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
            onSubmit={handleSubmit}
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
                        data-testid="LeadProfileTab-saveChangesButton"
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
                    data-testid="LeadProfileTab-nameInput"
                    label={I18n.t(attributeLabels.name)}
                    component={FormikInputField}
                    disabled={isSubmitting}
                  />

                  <Field
                    name="surname"
                    className="LeadProfileTab__form-field"
                    data-testid="LeadProfileTab-surnameInput"
                    label={I18n.t(attributeLabels.surname)}
                    component={FormikInputField}
                    disabled={isSubmitting}
                  />

                  <Field
                    name="birthDate"
                    className="LeadProfileTab__form-field"
                    data-testid="LeadProfileTab-birthDatePicker"
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
                    data-testid="LeadProfileTab-genderSelect"
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
                    data-testid="LeadProfileTab-countrySelect"
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
                    data-testid="LeadProfileTab-cityInput"
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
                    data-testid="LeadProfileTab-phoneInput"
                    label={I18n.t(attributeLabels.phone)}
                    component={FormikInputField}
                    addition={allowPhoneField && (
                      <Button
                        tertiary
                        className="LeadProfileTab__show-contacts-button"
                        data-testid="LeadProfileTab-showPhoneInputButton"
                        onClick={handleGetLeadPhone}
                        disabled={isPhoneShown}
                      >
                        {I18n.t('COMMON.BUTTONS.SHOW')}
                      </Button>
                    )}
                    additionPosition="right"
                    disabled={isSubmitting || !allowPhoneField || !isPhoneShown}
                  />

                  <Field
                    name="mobile"
                    className="LeadProfileTab__form-field"
                    data-testid="LeadProfileTab-mobileInput"
                    label={I18n.t(attributeLabels.mobile)}
                    component={FormikInputField}
                    addition={allowMobileField && (
                      <Button
                        tertiary
                        className="LeadProfileTab__show-contacts-button"
                        data-testid="LeadProfileTab-showMobileInputButton"
                        onClick={handleGetLeadMobile}
                        disabled={isMobileShown}
                      >
                        {I18n.t('COMMON.BUTTONS.SHOW')}
                      </Button>
                    )}
                    additionPosition="right"
                    disabled={isSubmitting || !allowMobileField || !isMobileShown}
                  />

                  <Field
                    name="email"
                    type="email"
                    className="LeadProfileTab__form-field"
                    data-testid="LeadProfileTab-emailInput"
                    label={I18n.t(attributeLabels.email)}
                    component={FormikInputField}
                    addition={allowEmailField && (
                      <Button
                        tertiary
                        className="LeadProfileTab__show-contacts-button"
                        data-testid="LeadProfileTab-showEmailInputButton"
                        onClick={handleGetLeadEmail}
                        disabled={isEmailShown}
                      >
                        {I18n.t('COMMON.BUTTONS.SHOW')}
                      </Button>
                    )}
                    additionPosition="right"
                    disabled={isSubmitting || !allowEmailField || !isEmailShown}
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default React.memo(LeadProfileTab);
