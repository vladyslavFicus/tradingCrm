import React, { PureComponent } from 'react';
import compose from 'compose-function';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import countryList from 'utils/countryList';
import { createValidator } from 'utils/validator';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import { Button } from 'components/UI';
import CreateOfficeMutation from './graphql/CreateOfficeMutation';
import './CreateOfficeModal.scss';

const attributeLabels = {
  name: I18n.t('MODALS.ADD_OFFICE_MODAL.LABELS.OFFICE_NAME'),
  country: I18n.t('MODALS.ADD_OFFICE_MODAL.LABELS.COUNTRY'),
};

class CreateOfficeModal extends PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    notify: PropTypes.func.isRequired,
    createOffice: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
  }

  handleCreateOffice = async (values, { setSubmitting }) => {
    const {
      notify,
      createOffice,
      onSuccess,
      onCloseModal,
    } = this.props;

    setSubmitting(false);

    try {
      await createOffice({ variables: values });

      onSuccess();
      onCloseModal();

      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('MODALS.ADD_OFFICE_MODAL.NOTIFICATION.SUCCESS'),
      });
    } catch {
      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('MODALS.ADD_OFFICE_MODAL.NOTIFICATION.ERROR'),
      });
    }
  };

  render() {
    const {
      isOpen,
      onCloseModal,
    } = this.props;

    return (
      <Modal
        isOpen={isOpen}
        toggle={onCloseModal}
      >
        <Formik
          initialValues={{
            name: '',
            country: '',
          }}
          validate={createValidator({
            name: ['required', 'string'],
            country: ['required', 'string'],
          }, attributeLabels, false)}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={this.handleCreateOffice}
        >
          {({ isSubmitting }) => (
            <Form>
              <ModalHeader toggle={onCloseModal}>
                {I18n.t('MODALS.ADD_OFFICE_MODAL.TITLE')}
              </ModalHeader>
              <ModalBody>
                <Field
                  name="name"
                  label={attributeLabels.name}
                  placeholder={I18n.t('COMMON.NAME')}
                  component={FormikInputField}
                  disabled={isSubmitting}
                />
                <Field
                  name="country"
                  label={attributeLabels.country}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                  component={FormikSelectField}
                  disabled={isSubmitting}
                  searchable
                >
                  {Object.keys(countryList).map(country => (
                    <option key={country} value={country}>
                      {countryList[country]}
                    </option>
                  ))}
                </Field>
              </ModalBody>
              <ModalFooter>
                <Button
                  className="CreateOfficeModal__button"
                  onClick={onCloseModal}
                  commonOutline
                >
                  {I18n.t('COMMON.BUTTONS.CANCEL')}
                </Button>
                <Button
                  className="CreateOfficeModal__button"
                  disabled={isSubmitting}
                  type="submit"
                  primary
                >
                  {I18n.t('MODALS.ADD_OFFICE_MODAL.CREATE_BUTTON')}
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
  withNotifications,
  withRequests({
    createOffice: CreateOfficeMutation,
  }),
)(CreateOfficeModal);
