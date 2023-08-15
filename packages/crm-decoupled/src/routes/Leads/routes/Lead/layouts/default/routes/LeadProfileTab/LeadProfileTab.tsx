import React from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import { Formik, Form, Field } from 'formik';
import { Utils, Constants } from '@crm/common';
import { Button, FormikSingleSelectField, FormikInputField, FormikDatePicker } from 'components';
import { Lead } from '__generated__/types';
import TabHeader from 'components/TabHeader';
import { attributeLabels, genders, AGE_YEARS_CONSTRAINT } from 'routes/Leads/routes/Lead/constants/leadProfileTab';
import useLeadProfileTab from 'routes/Leads/routes/Lead/hooks/useLeadProfileTab';
import './LeadProfileTab.scss';

type Props = {
  lead: Lead,
  onRefetch: () => void,
};

const LeadProfileTab = (props: Props) => {
  const { lead, onRefetch } = props;

  const { uuid, brandId, name, surname, country, birthDate, gender, city } = lead;

  const {
    state,
    isEmailShown,
    isPhoneShown,
    isMobileShown,
    allowEmailField,
    allowPhoneField,
    allowMobileField,
    handleSubmit,
    handleGetLeadEmail,
    handleGetLeadMobile,
    handleGetLeadPhone,
  } = useLeadProfileTab({ uuid, onRefetch });

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
              country: Utils.getCountryCode(country || '') || '',
              birthDate: birthDate || '',
              gender: gender || '',
              city: city || '',
            }}
            validate={Utils.createValidator({
              firstName: 'string',
              lastName: 'string',
              birthDate: [
                'date',
                `minDate:${Constants.User.MIN_BIRTHDATE}`,
                `maxDate:${moment().subtract(AGE_YEARS_CONSTRAINT, 'year').format(Constants.DATE_BASE_FORMAT)}`,
              ],
              identifier: 'string',
              country: `in:${Object.keys(Utils.countryList).join()}`,
              city: ['string', 'min:3'],
              postCode: ['string', 'min:3'],
              address: 'string',
              phone: 'string',
              mobile: 'string',
              email: (allowEmailField && isEmailShown)
                ? 'email'
                : 'string',
            }, Utils.translateLabels(attributeLabels), false,
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
                    minDate={moment(Constants.User.MIN_BIRTHDATE)}
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
                    component={FormikSingleSelectField}
                    disabled={isSubmitting}
                    options={genders.map(item => ({
                      label: Utils.formatLabel(item),
                      value: item,
                    }))}
                  />
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
                    component={FormikSingleSelectField}
                    disabled={isSubmitting}
                    options={Object.entries(Utils.countryList).map(([key, value]) => ({
                      label: value,
                      value: key,
                    }))}
                  />

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
