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
import UpdateOfficeMutation from './graphql/UpdateOfficeMutation';
import './UpdateOfficeModal.scss';

const attributeLabels = {
  name: I18n.t('MODALS.UPDATE_OFFICE_MODAL.LABELS.OFFICE_NAME'),
  country: I18n.t('MODALS.UPDATE_OFFICE_MODAL.LABELS.COUNTRY'),
};

class UpdateOfficeModal extends PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    notify: PropTypes.func.isRequired,
    updateOffice: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    data: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired,
    }).isRequired,
  }

  handleUpdateOffice = async (values, { setSubmitting }) => {
    const {
      notify,
      updateOffice,
      onSuccess,
      onCloseModal,
    } = this.props;

    setSubmitting(true);

    try {
      await updateOffice({ variables: values });

      onSuccess();
      onCloseModal();

      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('MODALS.UPDATE_OFFICE_MODAL.NOTIFICATION.SUCCESS'),
      });
    } catch {
      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('MODALS.UPDATE_OFFICE_MODAL.NOTIFICATION.ERROR'),
      });
    }

    setSubmitting(false);
  };

  render() {
    const {
      isOpen,
      onCloseModal,
      data,
    } = this.props;

    return (
      <Modal
        isOpen={isOpen}
        toggle={onCloseModal}
      >
        <Formik
          initialValues={data}
          validate={createValidator({
            name: ['required', 'string'],
            country: ['required', 'string'],
          }, attributeLabels, false)}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={this.handleUpdateOffice}
        >
          {({ isSubmitting }) => (
            <Form>
              <ModalHeader toggle={onCloseModal}>
                {I18n.t('MODALS.UPDATE_OFFICE_MODAL.TITLE')}
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
                  className="UpdateOfficeModal__button"
                  onClick={onCloseModal}
                  commonOutline
                >
                  {I18n.t('COMMON.BUTTONS.CANCEL')}
                </Button>
                <Button
                  className="UpdateOfficeModal__button"
                  disabled={isSubmitting}
                  type="submit"
                  primary
                >
                  {I18n.t('MODALS.UPDATE_OFFICE_MODAL.CREATE_BUTTON')}
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
    updateOffice: UpdateOfficeMutation,
  }),
)(UpdateOfficeModal);
