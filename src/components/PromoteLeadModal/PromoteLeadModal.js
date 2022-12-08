import React, { PureComponent } from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { withApollo } from '@apollo/client/react/hoc';
import Trackify from '@hrzn/trackify';
import { withRequests, parseErrors } from 'apollo';
import { getBrand, getAvailableLanguages } from 'config';
import permissions from 'config/permissions';
import { withPermission } from 'providers/PermissionsProvider';
import { notify, LevelType } from 'providers/NotificationProvider';
import PropTypes from 'constants/propTypes';
import { createValidator, translateLabels } from 'utils/validator';
import countryList from 'utils/countryList';
import { generate } from 'utils/password';
import EventEmitter, { LEAD_PROMOTED } from 'utils/EventEmitter';
import { Button } from 'components/UI';
import Input from 'components/Input';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import PromoteLeadMutation from './graphql/PromoteLeadMutation';
import LeadQuery from './graphql/LeadQuery';
import LeadEmailQuery from './graphql/LeadEmailQuery';
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

const validate = createValidator({
  firstName: ['required', 'string'],
  lastName: ['required', 'string'],
  password: ['required', `regex:${getBrand().password.pattern}`],
  languageCode: ['required', 'string'],
  'address.countryCode': ['required', 'string'],
}, translateLabels(attributeLabels), false);


class PromoteLeadModal extends PureComponent {
  static propTypes = {
    leadQuery: PropTypes.query({
      lead: PropTypes.lead,
    }).isRequired,
    client: PropTypes.shape({
      query: PropTypes.func.isRequired,
    }).isRequired,
    isOpen: PropTypes.bool.isRequired,
    promoteLead: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    permission: PropTypes.permission.isRequired,
  };

  state = {
    email: null,
  };

  handlePromoteLead = async (values, { setSubmitting, setErrors }) => {
    const {
      leadQuery,
      promoteLead,
      onCloseModal,
    } = this.props;

    try {
      await promoteLead({
        variables: {
          args: {
            uuid: leadQuery.data?.lead?.uuid,
            ...values,
          },
        },
      });

      EventEmitter.emit(LEAD_PROMOTED, leadQuery.data?.lead);

      onCloseModal();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('LEADS.SUCCESS_PROMOTED'),
      });
    } catch (e) {
      const { error } = parseErrors(e);

      switch (error) {
        case 'error.entity.already.exist':
          setErrors({ submit: I18n.t(`lead.${error}`, { email: leadQuery.data?.lead?.email }) });
          break;
        case 'error.phone.already.exist':
          setErrors({ submit: I18n.t('error.validation.phone.exists') });
          break;
        default:
          setErrors({ submit: I18n.t(`lead.${error}`) });
          break;
      }
    }

    setSubmitting(false);
  };

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

      this.setState({ email });
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  }

  render() {
    const {
      isOpen,
      leadQuery,
      onCloseModal,
      permission,
    } = this.props;

    const {
      email,
      gender,
      birthDate,
      name: firstName,
      surname: lastName,
      country: countryCode,
      language: languageCode,
    } = leadQuery.data?.lead || {};

    const isLoading = leadQuery.loading;

    return (
      <Modal
        isOpen={isOpen}
        toggle={onCloseModal}
        className="PromoteLeadModal"
      >
        <Formik
          initialValues={{
            address: {
              countryCode,
            },
            gender,
            lastName,
            firstName,
            birthDate,
            languageCode,
          }}
          validate={validate}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={this.handlePromoteLead}
        >
          {({ isSubmitting, errors, setFieldValue }) => (
            <Form>
              <ModalHeader toggle={onCloseModal}>{I18n.t('LEAD_PROFILE.PROMOTE_MODAL.HEADER')}</ModalHeader>
              <ModalBody>
                <div className="PromoteLeadModal__title">
                  {I18n.t('LEAD_PROFILE.PROMOTE_MODAL.BODY_HEADER', { fullName: `${firstName} ${lastName}` })}
                </div>

                <div className="PromoteLeadModal__fields">
                  <Field
                    name="firstName"
                    className="PromoteLeadModal__field"
                    label={I18n.t(attributeLabels.firstName)}
                    component={FormikInputField}
                    disabled={isLoading || isSubmitting}
                  />

                  <Field
                    name="lastName"
                    className="PromoteLeadModal__field"
                    label={I18n.t(attributeLabels.lastName)}
                    component={FormikInputField}
                    disabled={isLoading || isSubmitting}
                  />

                  <Input
                    disabled
                    name="contacts.email"
                    className="PromoteLeadModal__field"
                    label={I18n.t(attributeLabels.email)}
                    value={this.state.email || email}
                    addition={
                      permission.allows(permissions.LEAD_PROFILE.FIELD_EMAIL) && (
                        <Button
                          className="PromoteLeadModal__show-email-button"
                          onClick={this.getLeadEmail}
                        >
                          {I18n.t('COMMON.BUTTONS.SHOW')}
                        </Button>
                      )
                    }
                    additionPosition="right"
                  />

                  <Field
                    name="password"
                    className="PromoteLeadModal__field"
                    label={I18n.t(attributeLabels.password)}
                    component={FormikInputField}
                    addition={<span className="icon-generate-password" />}
                    onAdditionClick={() => setFieldValue('password', generate())}
                    disabled={isLoading || isSubmitting}
                  />

                  <Field
                    name="address.countryCode"
                    className="PromoteLeadModal__field"
                    label={I18n.t(attributeLabels.country)}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                    component={FormikSelectField}
                    disabled={isLoading || isSubmitting}
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
                    label={I18n.t(attributeLabels.language)}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                    component={FormikSelectField}
                    disabled={isLoading || isSubmitting}
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

                <If condition={errors && errors.submit}>
                  <div className="PromoteLeadModal__error">
                    {errors.submit}
                  </div>
                </If>
              </ModalBody>
              <ModalFooter>
                <Button
                  className="PromoteLeadModal__button"
                  tertiary
                  onClick={onCloseModal}
                >
                  {I18n.t('COMMON.BUTTONS.CANCEL')}
                </Button>
                <Button
                  type="submit"
                  className="PromoteLeadModal__button"
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
  }
}

export default compose(
  withApollo,
  withPermission,
  withRequests({
    leadQuery: LeadQuery,
    promoteLead: PromoteLeadMutation,
  }),
)(PromoteLeadModal);
