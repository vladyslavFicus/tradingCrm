import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import { get } from 'lodash';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { getActiveBrandConfig, getAvailableLanguages } from 'config';
import { createValidator, translateLabels } from 'utils/validator';
import countryList from 'utils/countryList';
import { generate } from 'utils/password';
import EventEmitter, { LEAD_PROMOTED } from 'utils/EventEmitter';
import ShortLoader from 'components/ShortLoader';
import { Button } from 'components/UI';
import { withNotifications } from 'hoc';
import { withRequests } from 'apollo';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import PromoteLeadMutation from './graphql/PromoteLeadMutation';
import PromoteLeadModalQuery from './graphql/PromoteLeadModalQuery';
import attributeLabels from './constants';

const validate = createValidator({
  firstName: ['required', 'string'],
  lastName: ['required', 'string'],
  'contacts.email': ['required', 'string'],
  password: ['required', `regex:${getActiveBrandConfig().password.pattern}`],
  languageCode: ['required', 'string'],
  'address.countryCode': ['required', 'string'],
}, translateLabels(attributeLabels), false);

class PromoteLeadModal extends PureComponent {
  static propTypes = {
    lead: PropTypes.query({
      leadProfile: PropTypes.response(PropTypes.lead),
    }).isRequired,
    formError: PropTypes.string,
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    size: PropTypes.string,
    notify: PropTypes.func.isRequired,
    promoteLead: PropTypes.func.isRequired,
  };

  static defaultProps = {
    size: null,
    formError: '',
  };

  handlePromoteLead = async (values, { setSubmitting, setErrors }) => {
    const {
      lead,
      notify,
      promoteLead,
      onCloseModal,
    } = this.props;

    const { data: { leads: { promote: { data, error } } } } = await promoteLead({
      variables: { args: values },
    });

    if (error) {
      if (error.error === 'error.entity.already.exist') {
        setErrors({ submit: I18n.t(`lead.${error.error}`, { email: values.contacts.email }) });
      } else {
        setErrors({ submit: I18n.t(`lead.${error.error}`) });
      }
    } else {
      EventEmitter.emit(LEAD_PROMOTED, lead.data.leadProfile.data);

      onCloseModal();
      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('LEADS.SUCCESS_PROMOTED', { id: data.uuid }),
      });
    }

    setSubmitting(false);
  };

  renderForm() {
    const {
      lead,
      onCloseModal,
      formError,
    } = this.props;

    const {
      email,
      phone,
      gender,
      birthDate,
      name: firstName,
      surname: lastName,
      country: countryCode,
      language: languageCode,
      mobile: additionalPhone,
    } = get(lead, 'data.leadProfile.data');

    return (
      <Formik
        initialValues={{
          address: {
            countryCode,
          },
          contacts: {
            email,
            phone,
            additionalPhone,
          },
          gender,
          lastName,
          firstName,
          birthDate,
          languageCode,
        }}
        validate={validate}
        onSubmit={this.handlePromoteLead}
      >
        {({ errors, isValid, isSubmitting, dirty, setFieldValue }) => (
          <Form>
            <div className="mb-3 font-weight-700 text-center">
              {I18n.t('LEAD_PROFILE.PROMOTE_MODAL.BODY_HEADER', { fullName: `${firstName} ${lastName}` })}
            </div>
            <If condition={formError || (errors && errors.submit)}>
              <div
                className="mb-2 text-center color-danger"
              >
                {formError || errors.submit}
              </div>
            </If>
            <div className="row">
              <div className="col-6">
                <Field
                  name="firstName"
                  label={I18n.t(attributeLabels.firstName)}
                  component={FormikInputField}
                />
                <Field
                  name="contacts.email"
                  label={I18n.t(attributeLabels.email)}
                  component={FormikInputField}
                  disabled
                />
                <Field
                  name="address.countryCode"
                  label={I18n.t(attributeLabels.country)}
                  component={FormikSelectField}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                >
                  {Object.entries(countryList).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </Field>
              </div>
              <div className="col-6">
                <Field
                  name="lastName"
                  label={I18n.t(attributeLabels.lastName)}
                  component={FormikInputField}
                />
                <Field
                  name="password"
                  onAdditionClick={() => setFieldValue('password', generate())}
                  addition={<span className="icon-generate-password" />}
                  label={I18n.t(attributeLabels.password)}
                  component={FormikInputField}
                />
                <Field
                  name="languageCode"
                  label={I18n.t(attributeLabels.language)}
                  component={FormikSelectField}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
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
            </div>
            <ModalFooter>
              <Button
                commonOutline
                onClick={onCloseModal}
              >
                {I18n.t('COMMON.BUTTONS.CANCEL')}
              </Button>
              <Button
                primary
                type="submit"
                disabled={!dirty || !isValid || isSubmitting}
              >
                {I18n.t('COMMON.BUTTONS.CONFIRM')}
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    );
  }

  render() {
    const {
      lead,
      onCloseModal,
      isOpen,
      size,
    } = this.props;

    return (
      <Modal
        toggle={onCloseModal}
        isOpen={isOpen}
        size={size}
        className="promote-lead-modal"
      >
        <ModalHeader toggle={onCloseModal}>
          {I18n.t('LEAD_PROFILE.PROMOTE_MODAL.HEADER')}
        </ModalHeader>
        <ModalBody>
          <Choose>
            <When condition={lead.loading}>
              <ShortLoader />
            </When>
            <Otherwise>
              {this.renderForm()}
            </Otherwise>
          </Choose>
        </ModalBody>
      </Modal>
    );
  }
}

export default compose(
  withNotifications,
  withRequests({
    lead: PromoteLeadModalQuery,
    promoteLead: PromoteLeadMutation,
  }),
)(PromoteLeadModal);
