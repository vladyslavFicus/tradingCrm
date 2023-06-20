import React, { useState } from 'react';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { omit } from 'lodash';
import Trackify from '@hrzn/trackify';
import { parseErrors } from 'apollo';
import { getBrand, getAvailableLanguages } from 'config';
import { Lead } from '__generated__/types';
import permissions from 'config/permissions';
import { usePermission } from 'providers/PermissionsProvider';
import { notify, LevelType } from 'providers/NotificationProvider';
import { createValidator, translateLabels } from 'utils/validator';
import countryList, { getCountryCode } from 'utils/countryList';
import { generate } from 'utils/password';
import EventEmitter, { LEAD_PROMOTED } from 'utils/EventEmitter';
import { Button } from 'components/Buttons';
import Input from 'components/Input';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import { useLeadEmailQueryLazyQuery } from './graphql/__generated__/LeadEmailQuery';
import { usePromoteLeadMutation } from './graphql/__generated__/PromoteLeadMutation';
import './PromoteLeadModal.scss';

const attributeLabels = {
  firstName: 'LEAD_PROFILE.PROMOTE_MODAL.LABELS.FIRST_NAME',
  lastName: 'LEAD_PROFILE.PROMOTE_MODAL.LABELS.LAST_NAME',
  email: 'LEAD_PROFILE.PROMOTE_MODAL.LABELS.EMAIL',
  country: 'LEAD_PROFILE.PROMOTE_MODAL.LABELS.COUNTRY',
  password: 'LEAD_PROFILE.PROMOTE_MODAL.LABELS.PASSWORD',
  language: 'LEAD_PROFILE.PROMOTE_MODAL.LABELS.LANGUAGE',
  salesRepresentative: 'LEAD_PROFILE.PROMOTE_MODAL.LABELS.SALES_REP',
  salesDesk: 'LEAD_PROFILE.PROMOTE_MODAL.LABELS.SALES_DESK',
};

type FormValues = {
  firstName: string,
  lastName: string,
  languageCode: string,
  password: string,
  contacts: {
    email: string,
  },
  address: {
    countryCode: string,
  },
};

export type Props = {
  lead: Lead,
  onCloseModal: () => void,
};

const PromoteLeadModal = (props: Props) => {
  const { lead, onCloseModal } = props;

  const {
    uuid,
    name: firstName,
    surname: lastName,
    gender,
    birthDate,
    language,
    country,
  } = lead;

  const languageCode = language || '';
  const countryCode = getCountryCode(country || '') || '';

  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const permission = usePermission();
  const allowEmailField = permission.allows(permissions.LEAD_PROFILE.FIELD_EMAIL);

  // ===== Requests ===== //
  const [leadEmailQuery] = useLeadEmailQueryLazyQuery({ fetchPolicy: 'network-only' });

  const [promoteLeadMutation] = usePromoteLeadMutation();

  // ===== Handlers ===== //
  const handleSubmit = async (values: FormValues) => {
    const args = omit(values, ['contacts']);

    try {
      await promoteLeadMutation({ variables: { args: { ...args, uuid } } });

      EventEmitter.emit(LEAD_PROMOTED);

      onCloseModal();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('LEADS.SUCCESS_PROMOTED'),
      });
    } catch (e) {
      const { error: parseError } = parseErrors(e);

      switch (parseError) {
        case 'error.entity.already.exist':
          setError(I18n.t(`lead.${parseError}`, { email: lead.email }));
          break;
        case 'error.phone.already.exist':
          setError(I18n.t('error.validation.phone.exists'));
          break;
        default:
          setError(I18n.t(`lead.${parseError}`));
          break;
      }
    }
  };

  const getLeadEmail = async () => {
    try {
      const { data } = await leadEmailQuery({ variables: { uuid } });

      Trackify.click('LEAD_EMAILS_VIEWED', { eventLabel: uuid });

      if (data?.leadContacts.email) {
        setEmail(data.leadContacts.email);
      }
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.ERROR'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  return (
    <Modal className="PromoteLeadModal" toggle={onCloseModal} isOpen>
      <Formik
        initialValues={{
          firstName,
          lastName,
          birthDate,
          gender,
          languageCode,
          address: { countryCode },
          contacts: { email: email || lead.email },
          password: '',
        }}
        validate={createValidator({
          firstName: ['required', 'string'],
          lastName: ['required', 'string'],
          password: ['required', `regex:${getBrand().password.pattern}`],
          languageCode: ['required', 'string'],
          'address.countryCode': ['required', 'string'],
        }, translateLabels(attributeLabels), false)}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            <ModalHeader toggle={onCloseModal}>
              {I18n.t('LEAD_PROFILE.PROMOTE_MODAL.HEADER')}
            </ModalHeader>

            <ModalBody>
              <div className="PromoteLeadModal__title">
                {I18n.t('LEAD_PROFILE.PROMOTE_MODAL.BODY_HEADER', { fullName: `${firstName} ${lastName}` })}
              </div>

              <div className="PromoteLeadModal__fields">
                <Field
                  name="firstName"
                  className="PromoteLeadModal__field"
                  data-testid="PromoteLeadModal-firstNameInput"
                  label={I18n.t(attributeLabels.firstName)}
                  component={FormikInputField}
                  disabled={isSubmitting}
                />

                <Field
                  name="lastName"
                  className="PromoteLeadModal__field"
                  data-testid="PromoteLeadModal-lastNameInput"
                  label={I18n.t(attributeLabels.lastName)}
                  component={FormikInputField}
                  disabled={isSubmitting}
                />

                <Input
                  disabled
                  name="contacts.email"
                  className="PromoteLeadModal__field"
                  data-testid="PromoteLeadModal-emailInput"
                  label={I18n.t(attributeLabels.email)}
                  value={email || lead.email}
                  addition={allowEmailField && (
                    <Button
                      className="PromoteLeadModal__show-email-button"
                      data-testid="PromoteLeadModal-showEmailButton"
                      onClick={getLeadEmail}
                    >
                      {I18n.t('COMMON.BUTTONS.SHOW')}
                    </Button>
                  )}
                  additionPosition="right"
                />

                <Field
                  name="password"
                  className="PromoteLeadModal__field"
                  data-testid="PromoteLeadModal-passwordInput"
                  label={I18n.t(attributeLabels.password)}
                  component={FormikInputField}
                  addition={<span className="icon-generate-password" />}
                  onAdditionClick={() => setFieldValue('password', generate())}
                  disabled={isSubmitting}
                />

                <Field
                  name="address.countryCode"
                  className="PromoteLeadModal__field"
                  data-testid="PromoteLeadModal-countryCodeSelect"
                  label={I18n.t(attributeLabels.country)}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                  component={FormikSelectField}
                  disabled={isSubmitting}
                  searchable
                >
                  {Object.entries(countryList).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </Field>

                <Field
                  name="languageCode"
                  className="PromoteLeadModal__field"
                  data-testid="PromoteLeadModal-languageCodeSelect"
                  label={I18n.t(attributeLabels.language)}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                  component={FormikSelectField}
                  disabled={isSubmitting}
                  searchable
                >
                  {getAvailableLanguages().map(locale => (
                    <option key={locale} value={locale}>
                      {I18n.t(`COMMON.LANGUAGE_NAME.${locale.toUpperCase()}`, {
                        defaultValue: locale.toUpperCase(),
                      })}
                    </option>
                  ))}
                </Field>
              </div>

              <If condition={!!error}>
                <div className="PromoteLeadModal__error">
                  {error}
                </div>
              </If>
            </ModalBody>

            <ModalFooter>
              <Button
                className="PromoteLeadModal__button"
                data-testid="PromoteLeadModal-cancelButton"
                tertiary
                onClick={onCloseModal}
              >
                {I18n.t('COMMON.BUTTONS.CANCEL')}
              </Button>

              <Button
                type="submit"
                className="PromoteLeadModal__button"
                data-testid="PromoteLeadModal-confirmButton"
                primary
                disabled={isSubmitting}
              >
                {I18n.t('COMMON.BUTTONS.CONFIRM')}
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default React.memo(PromoteLeadModal);
