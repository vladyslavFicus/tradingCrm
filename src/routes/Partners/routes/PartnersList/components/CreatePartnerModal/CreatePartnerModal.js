import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import { get } from 'lodash';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { withRequests } from 'apollo';
import { getActiveBrandConfig } from 'config';
import { withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import { FormikInputField, FormikSelectField, FormikCheckbox } from 'components/Formik';
import Regulated from 'components/Regulated';
import { Button } from 'components/UI';
import { createValidator, translateLabels } from 'utils/validator';
import { generate } from 'utils/password';
import {
  affiliateTypeLabels,
  satelliteOptions,
  affiliateTypes,
} from '../../../../constants';
import CreatePartnerMutation from './graphql/CreatePartnerMutation';
import './CreatePartnerModal.scss';

const attributeLabels = {
  firstName: 'COMMON.FIRST_NAME',
  lastName: 'COMMON.LAST_NAME',
  email: 'COMMON.EMAIL',
  password: 'COMMON.PASSWORD',
  phone: 'COMMON.PHONE',
  affiliateType: 'COMMON.PARTNER_TYPE',
  externalAffiliateId: 'COMMON.EXTERNAL_AFILIATE_ID',
  public: 'PARTNERS.MODALS.NEW_PARTNER.PUBLIC_CHECKBOX',
  cellexpert: 'PARTNERS.MODALS.NEW_PARTNER.CELLEXPERT_CHECKBOX',
  satellite: 'COMMON.SATELLITE',
};

const validate = createValidator({
  firstName: ['required', 'string', 'min:3'],
  lastName: ['required', 'string', 'min:3'],
  email: ['required', 'email'],
  password: ['required', `regex:${getActiveBrandConfig().password.pattern}`],
  phone: ['required', 'min:3'],
  affiliateType: ['string'],
  externalAffiliateId: ['min:3'],
  public: ['boolean'],
  cellexpert: ['boolean'],
  satellite: ['string'],
}, translateLabels(attributeLabels), false);

class CreatePartnerModal extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    createPartner: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    notify: PropTypes.func.isRequired,
  };

  initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    affiliateType: getActiveBrandConfig().regulation.isActive ? '' : affiliateTypes.AFFILIATE,
    externalAffiliateId: '',
    public: false,
    cellexpert: false,
    satellite: null,
  };

  handleGeneratePassword = () => generate();

  handleGenerateExternalId = () => Math.random().toString(36).substr(2);

  handleSubmit = async (values, { setSubmitting, validateForm }) => {
    const {
      createPartner,
      onCloseModal,
      history,
      notify,
    } = this.props;

    const validationResult = await validateForm(values);
    const hasValidationErrors = Object.keys(validationResult).length > 0;

    if (!hasValidationErrors) {
      const {
        affiliateType,
        cellexpert,
        public: isPublic, // 'public' is reserved JS word and we cant use it for naming variable
        externalAffiliateId,
        satellite,
        ...restValues
      } = values;

      const newPartnerData = await createPartner({
        variables: {
          affiliateType,
          externalAffiliateId,
          public: isPublic,
          cellexpert,
          ...(satelliteOptions && { satellite }),
          ...restValues,
        },
      });

      const serverError = get(newPartnerData, 'data.partner.createPartner.error.error') || null;
      const partnerUuid = get(newPartnerData, 'data.partner.createPartner.data.uuid') || null;

      if (serverError) {
        switch (serverError) {
          case 'error.entity.already.exists': {
            notify({
              level: 'error',
              title: I18n.t('PARTNERS.NOTIFICATIONS.EXISTING_PARTNER_EMAIL.TITLE'),
              message: I18n.t('PARTNERS.NOTIFICATIONS.EXISTING_PARTNER_EMAIL.MESSAGE'),
            });

            return;
          }
          case 'error.affiliate.externalId.already.exists': {
            notify({
              level: 'error',
              title: I18n.t('PARTNERS.NOTIFICATIONS.EXISTING_PARTNER_EXTERNAL_ID.TITLE'),
              message: I18n.t('PARTNERS.NOTIFICATIONS.EXISTING_PARTNER_EXTERNAL_ID.MESSAGE'),
            });

            return;
          }
          default: {
            notify({
              level: 'error',
              title: I18n.t('PARTNERS.NOTIFICATIONS.EXISTING_PARTNER_EXTERNAL_ID.TITLE'),
              message: I18n.t('COMMON.SOMETHING_WRONG'),
            });

            return;
          }
        }
      }

      notify({
        level: 'success',
        title: I18n.t('PARTNERS.NOTIFICATIONS.CREATE_PARTNER_SUCCESS.TITLE'),
        message: I18n.t('PARTNERS.NOTIFICATIONS.CREATE_PARTNER_SUCCESS.MESSAGE'),
      });

      onCloseModal();

      if (partnerUuid) {
        history.push(`/partners/${partnerUuid}/profile`);
      }
    }

    setSubmitting(false);
  };

  render() {
    const {
      onCloseModal,
      isOpen,
    } = this.props;

    return (
      <Modal className="CreatePartnerModal" toggle={onCloseModal} isOpen={isOpen}>
        <Formik
          initialValues={this.initialValues}
          validate={validate}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={this.handleSubmit}
        >
          {({
            isSubmitting,
            setFieldValue,
          }) => (
            <Form>
              <ModalHeader toggle={onCloseModal}>{I18n.t('PARTNERS.NEW_PARTNER')}</ModalHeader>
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
                    onAdditionClick={() => setFieldValue('password', this.handleGeneratePassword())}
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
                  <If condition={satelliteOptions}>
                    <Field
                      name="satellite"
                      className="CreatePartnerModal__field"
                      component={FormikSelectField}
                      label={I18n.t(attributeLabels.satellite)}
                      placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                      disabled={isSubmitting}
                    >
                      {satelliteOptions.map((satellite, key) => (
                        <option key={key} value={satellite.value}>{satellite.label}</option>
                      ))}
                    </Field>
                  </If>
                  <Regulated>
                    <Field
                      name="affiliateType"
                      className="CreatePartnerModal__field"
                      component={FormikSelectField}
                      label={I18n.t(attributeLabels.affiliateType)}
                      placeholder={I18n.t('COMMON.SELECT_OPTION.SELECT_PARTNER_TYPE')}
                      disabled={isSubmitting}
                    >
                      {Object.keys(affiliateTypeLabels).map(value => (
                        <option key={value} value={value}>{I18n.t(affiliateTypeLabels[value])}</option>
                      ))}
                    </Field>
                  </Regulated>
                  <Field
                    name="externalAffiliateId"
                    className="CreatePartnerModal__field"
                    label={I18n.t(attributeLabels.externalAffiliateId)}
                    placeholder={I18n.t(attributeLabels.externalAffiliateId)}
                    addition={<span className="icon-generate-password" />}
                    onAdditionClick={() => setFieldValue('externalAffiliateId', this.handleGenerateExternalId())}
                    component={FormikInputField}
                    disabled={isSubmitting}
                  />
                </div>
                <Field
                  name="public"
                  component={FormikCheckbox}
                  label={I18n.t(attributeLabels.public)}
                />
                <Regulated>
                  <Field
                    name="cellexpert"
                    component={FormikCheckbox}
                    label={I18n.t(attributeLabels.cellexpert)}
                  />
                </Regulated>
              </ModalBody>
              <ModalFooter>
                <Button
                  onClick={onCloseModal}
                  className="CreatePartnerModal__button"
                  commonOutline
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
  }
}

export default compose(
  withRouter,
  withNotifications,
  withRequests({
    createPartner: CreatePartnerMutation,
  }),
)(CreatePartnerModal);
