import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import { getAvailableLanguages } from 'config';
import PropTypes from 'constants/propTypes';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import { Button } from 'components/UI';
import { createValidator, translateLabels } from 'utils/validator';
import UpdateDeskMutation from './graphql/UpdateDeskMutation';
import { deskTypes } from '../../constants';
import './UpdateDeskModal.scss';

const attributeLabels = {
  name: 'DESKS.UPDATE_MODAL.LABELS.DESK_NAME',
  deskType: 'DESKS.UPDATE_MODAL.LABELS.DESK_TYPE',
  language: 'DESKS.UPDATE_MODAL.LABELS.LANGUAGE',
};

const validate = createValidator({
  name: ['required', 'string'],
  deskType: ['required', 'string'],
  language: ['required', `in:${getAvailableLanguages().join()}`],
}, translateLabels(attributeLabels), false);

class UpdateDeskModal extends PureComponent {
  static propTypes = {
    updateDesk: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    notify: PropTypes.func.isRequired,
    data: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      deskType: PropTypes.string.isRequired,
      language: PropTypes.string.isRequired,
    }).isRequired,
  };

  handleSubmit = async (values, { setSubmitting }) => {
    const {
      onCloseModal,
      updateDesk,
      onSuccess,
      notify,
    } = this.props;

    setSubmitting(true);

    try {
      await updateDesk({ variables: values });

      onSuccess();
      onCloseModal();

      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('DESKS.UPDATE_MODAL.NOTIFICATIONS.SUCCESS'),
      });
    } catch {
      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('DESKS.UPDATE_MODAL.NOTIFICATIONS.ERROR'),
      });
    }

    setSubmitting(false);
  };

  render() {
    const {
      onCloseModal,
      data,
      isOpen,
    } = this.props;

    return (
      <Modal className="UpdateDeskModal" toggle={onCloseModal} isOpen={isOpen}>
        <Formik
          initialValues={data}
          validate={validate}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={this.handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <ModalHeader toggle={onCloseModal}>{I18n.t('DESKS.UPDATE_MODAL.HEADER')}</ModalHeader>
              <ModalBody>
                <Field
                  name="name"
                  className="UpdateDeskModal__field UpdateDeskModal__name"
                  label={I18n.t(attributeLabels.name)}
                  placeholder={I18n.t(attributeLabels.name)}
                  component={FormikInputField}
                  disabled={isSubmitting}
                />

                <Field
                  name="deskType"
                  className="UpdateDeskModal__field UpdateDeskModal__desk-type"
                  component={FormikSelectField}
                  label={I18n.t(attributeLabels.deskType)}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                  disabled={isSubmitting}
                >
                  {deskTypes.map(({ label, value }) => (
                    <option key={value} value={value}>{I18n.t(label)}</option>
                  ))}
                </Field>

                <Field
                  name="language"
                  className="UpdateDeskModal__field"
                  component={FormikSelectField}
                  label={I18n.t(attributeLabels.language)}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                  disabled={isSubmitting}
                >
                  {getAvailableLanguages().map(locale => (
                    <option key={locale} value={locale}>
                      {I18n.t(`COMMON.LANGUAGE_NAME.${locale.toUpperCase()}`, { defaultValue: locale.toUpperCase() })}
                    </option>
                  ))}
                </Field>
              </ModalBody>
              <ModalFooter>
                <Button
                  onClick={onCloseModal}
                  className="UpdateDeskModal__button"
                  commonOutline
                >
                  {I18n.t('COMMON.BUTTONS.CANCEL')}
                </Button>

                <Button
                  className="UpdateDeskModal__button"
                  primary
                  disabled={isSubmitting}
                  type="submit"
                >
                  {I18n.t('DESKS.UPDATE_MODAL.UPDATE_BUTTON')}
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
    updateDesk: UpdateDeskMutation,
  }),
)(UpdateDeskModal);
