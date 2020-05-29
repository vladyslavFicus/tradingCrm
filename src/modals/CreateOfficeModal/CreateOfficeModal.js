import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
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

    const { data: { hierarchy: { createOffice: { error } } } } = await createOffice({ variables: values });
    const hasError = error.length;

    if (!hasError) {
      onSuccess();
      onCloseModal();
    }

    notify({
      level: hasError ? 'error' : 'success',
      title: hasError ? I18n.t('COMMON.FAIL') : I18n.t('COMMON.SUCCESS'),
      message: hasError
        ? I18n.t('MODALS.ADD_OFFICE_MODAL.NOTIFICATION.ERROR')
        : I18n.t('MODALS.ADD_OFFICE_MODAL.NOTIFICATION.SUCCESS'),
    });
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
          initialValues={{}}
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
