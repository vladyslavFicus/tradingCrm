import React from 'react';
import { useHistory } from 'react-router-dom';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { parseErrors } from 'apollo';
import { getBrand } from 'config';
import { notify, LevelType } from 'providers/NotificationProvider';
import { FormikInputField, FormikCheckbox } from 'components/Formik';
import { Button } from 'components/Buttons';
import { createValidator, translateLabels } from 'utils/validator';
import { generate } from 'utils/password';
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

  const history = useHistory();

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
          level: LevelType.SUCCESS,
          title: I18n.t('PARTNERS.NOTIFICATIONS.CREATE_PARTNER_SUCCESS.TITLE'),
          message: I18n.t('PARTNERS.NOTIFICATIONS.CREATE_PARTNER_SUCCESS.MESSAGE'),
        });

        onCloseModal();

        const uuid = data?.partner.createPartner?.uuid;

        if (uuid) {
          history.push(`/partners/${uuid}/profile`);
        }
      } catch (e) {
        const { error } = parseErrors(e);

        switch (error) {
          case 'error.entity.already.exist': {
            notify({
              level: LevelType.ERROR,
              title: I18n.t('PARTNERS.NOTIFICATIONS.EXISTING_PARTNER_EMAIL.TITLE'),
              message: I18n.t('PARTNERS.NOTIFICATIONS.EXISTING_PARTNER_EMAIL.MESSAGE'),
            });

            return;
          }
          case 'error.affiliate.externalId.already.exists': {
            notify({
              level: LevelType.ERROR,
              title: I18n.t('PARTNERS.NOTIFICATIONS.EXISTING_PARTNER_EXTERNAL_ID.TITLE'),
              message: I18n.t('PARTNERS.NOTIFICATIONS.EXISTING_PARTNER_EXTERNAL_ID.MESSAGE'),
            });

            return;
          }
          default: {
            notify({
              level: LevelType.ERROR,
              title: I18n.t('PARTNERS.NOTIFICATIONS.EXISTING_PARTNER_EXTERNAL_ID.TITLE'),
              message: I18n.t('COMMON.SOMETHING_WRONG'),
            });
          }
        }
      }
    }
  };

  const handleGeneratePassword = () => generate();

  const handleGenerateExternalId = () => Math.random().toString(36).substr(2);

  return (
    <Modal className="CreatePartnerModal" toggle={onCloseModal} isOpen>
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
        validate={createValidator({
          firstName: ['required', 'string', 'min:3'],
          lastName: ['required', 'string', 'min:3'],
          email: ['required', 'email'],
          password: ['required', `regex:${getBrand().password.pattern}`],
          phone: ['required', 'min:3'],
          externalAffiliateId: ['required', 'min:3'],
          public: ['boolean'],
        }, translateLabels(attributeLabels), false)}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            <ModalHeader toggle={onCloseModal}>
              {I18n.t('PARTNERS.NEW_PARTNER')}
            </ModalHeader>

            <ModalBody>
              <div>
                <Field
                  name="firstName"
                  className="CreatePartnerModal__field"
                  label={I18n.t(attributeLabels.firstName)}
                  placeholder={I18n.t(attributeLabels.firstName)}
                  component={FormikInputField}
                  disabled={isSubmitting}
                />

                <Field
                  name="lastName"
                  className="CreatePartnerModal__field"
                  label={I18n.t(attributeLabels.lastName)}
                  placeholder={I18n.t(attributeLabels.lastName)}
                  component={FormikInputField}
                  disabled={isSubmitting}
                />

                <Field
                  name="email"
                  className="CreatePartnerModal__field"
                  label={I18n.t(attributeLabels.email)}
                  placeholder={I18n.t(attributeLabels.email)}
                  component={FormikInputField}
                  disabled={isSubmitting}
                />

                <Field
                  name="password"
                  className="CreatePartnerModal__field"
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
                  label={I18n.t(attributeLabels.phone)}
                  placeholder={I18n.t(attributeLabels.phone)}
                  component={FormikInputField}
                  disabled={isSubmitting}
                />

                <Field
                  name="externalAffiliateId"
                  className="CreatePartnerModal__field"
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
                component={FormikCheckbox}
                label={I18n.t(attributeLabels.public)}
              />
            </ModalBody>

            <ModalFooter>
              <Button
                onClick={onCloseModal}
                className="CreatePartnerModal__button"
                tertiary
              >
                {I18n.t('COMMON.BUTTONS.CANCEL')}
              </Button>

              <Button
                className="CreatePartnerModal__button"
                primary
                disabled={isSubmitting}
                type="submit"
              >
                {I18n.t('COMMON.BUTTONS.CREATE_AND_OPEN')}
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default React.memo(CreatePartnerModal);