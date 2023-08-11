import React from 'react';
import { useNavigate } from 'react-router-dom';
import I18n from 'i18n-js';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { Config, Utils, parseErrors, notify, Types } from '@crm/common';
import { FormikInputField, FormikCheckbox } from 'components/Formik';
import Modal from 'components/Modal';
import { useCreatePartnerMutation } from './graphql/__generated__/CreatePartnerMutation';
import './CreatePartnerModal.scss';

const attributeLabels = {
  firstName: 'COMMON.FIRST_NAME',
  lastName: 'COMMON.LAST_NAME',
  email: 'COMMON.EMAIL',
  password: 'COMMON.PASSWORD',
  phone: 'COMMON.PHONE',
  externalAffiliateId: 'COMMON.EXTERNAL_AFILIATE_ID',
  public: 'PARTNERS.MODALS.NEW_PARTNER.PUBLIC_CHECKBOX',
};

type FormValues = {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  phone: string,
  externalAffiliateId: string,
  public: boolean,
};

export type Props = {
  onCloseModal: () => void,
};

const CreatePartnerModal = (props: Props) => {
  const { onCloseModal } = props;

  const navigate = useNavigate();

  // ===== Requests ===== //
  const [createPartnerMutation] = useCreatePartnerMutation();

  // ===== Handlers ===== //
  const handleSubmit = async (values: FormValues, { validateForm }: FormikHelpers<FormValues>) => {
    const validationResult = await validateForm(values);
    const hasValidationErrors = Object.keys(validationResult).length > 0;

    if (!hasValidationErrors) {
      try {
        const { data } = await createPartnerMutation({ variables: values });

        notify({
          level: Types.LevelType.SUCCESS,
          title: I18n.t('PARTNERS.NOTIFICATIONS.CREATE_PARTNER_SUCCESS.TITLE'),
          message: I18n.t('PARTNERS.NOTIFICATIONS.CREATE_PARTNER_SUCCESS.MESSAGE'),
        });

        onCloseModal();

        const uuid = data?.partner.createPartner?.uuid;

        if (uuid) {
          navigate(`/partners/${uuid}`);
        }
      } catch (e) {
        const { error } = parseErrors(e);

        switch (error) {
          case 'error.entity.already.exist': {
            notify({
              level: Types.LevelType.ERROR,
              title: I18n.t('PARTNERS.NOTIFICATIONS.EXISTING_PARTNER_EMAIL.TITLE'),
              message: I18n.t('PARTNERS.NOTIFICATIONS.EXISTING_PARTNER_EMAIL.MESSAGE'),
            });

            return;
          }
          case 'error.affiliate.externalId.already.exists': {
            notify({
              level: Types.LevelType.ERROR,
              title: I18n.t('PARTNERS.NOTIFICATIONS.EXISTING_PARTNER_EXTERNAL_ID.TITLE'),
              message: I18n.t('PARTNERS.NOTIFICATIONS.EXISTING_PARTNER_EXTERNAL_ID.MESSAGE'),
            });

            return;
          }
          default: {
            notify({
              level: Types.LevelType.ERROR,
              title: I18n.t('PARTNERS.NOTIFICATIONS.EXISTING_PARTNER_EXTERNAL_ID.TITLE'),
              message: I18n.t('COMMON.SOMETHING_WRONG'),
            });
          }
        }
      }
    }
  };

  const handleGeneratePassword = () => Utils.generate();

  const handleGenerateExternalId = () => Math.random().toString(36).substr(2);

  return (
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        externalAffiliateId: '',
        public: false,
      }}
      validate={Utils.createValidator({
        firstName: ['required', 'string', 'min:3'],
        lastName: ['required', 'string', 'min:3'],
        email: ['required', 'email'],
        password: ['required', `regex:${Config.getBrand().password.pattern}`],
        phone: ['required', 'min:3'],
        externalAffiliateId: ['required', 'min:3'],
        public: ['boolean'],
      }, Utils.translateLabels(attributeLabels), false)}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, setFieldValue, submitForm }) => (
        <Modal
          onCloseModal={onCloseModal}
          title={I18n.t('PARTNERS.NEW_PARTNER')}
          disabled={isSubmitting}
          clickSubmit={submitForm}
          buttonTitle={I18n.t('COMMON.BUTTONS.CREATE_AND_OPEN')}
        >
          <Form>
            <div>
              <Field
                name="firstName"
                className="CreatePartnerModal__field"
                data-testid="CreatePartnerModal-firstNameInput"
                label={I18n.t(attributeLabels.firstName)}
                placeholder={I18n.t(attributeLabels.firstName)}
                component={FormikInputField}
                disabled={isSubmitting}
              />

              <Field
                name="lastName"
                className="CreatePartnerModal__field"
                data-testid="CreatePartnerModal-lastNameInput"
                label={I18n.t(attributeLabels.lastName)}
                placeholder={I18n.t(attributeLabels.lastName)}
                component={FormikInputField}
                disabled={isSubmitting}
              />

              <Field
                name="email"
                className="CreatePartnerModal__field"
                data-testid="CreatePartnerModal-emailInput"
                label={I18n.t(attributeLabels.email)}
                placeholder={I18n.t(attributeLabels.email)}
                component={FormikInputField}
                disabled={isSubmitting}
              />

              <Field
                name="password"
                className="CreatePartnerModal__field"
                data-testid="CreatePartnerModal-passwordInput"
                label={I18n.t(attributeLabels.password)}
                placeholder={I18n.t(attributeLabels.password)}
                addition={<span className="icon-generate-password" />}
                onAdditionClick={() => setFieldValue('password', handleGeneratePassword())}
                component={FormikInputField}
                disabled={isSubmitting}
              />

              <Field
                name="phone"
                className="CreatePartnerModal__field"
                data-testid="CreatePartnerModal-phoneInput"
                label={I18n.t(attributeLabels.phone)}
                placeholder={I18n.t(attributeLabels.phone)}
                component={FormikInputField}
                disabled={isSubmitting}
              />

              <Field
                name="externalAffiliateId"
                className="CreatePartnerModal__field"
                data-testid="CreatePartnerModal-externalAffiliateIdInput"
                label={I18n.t(attributeLabels.externalAffiliateId)}
                placeholder={I18n.t(attributeLabels.externalAffiliateId)}
                addition={<span className="icon-generate-password" />}
                onAdditionClick={() => setFieldValue('externalAffiliateId', handleGenerateExternalId())}
                component={FormikInputField}
                disabled={isSubmitting}
              />
            </div>

            <Field
              name="public"
              data-testid="CreatePartnerModal-publicCheckbox"
              component={FormikCheckbox}
              label={I18n.t(attributeLabels.public)}
            />
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default React.memo(CreatePartnerModal);
