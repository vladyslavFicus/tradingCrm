import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import { get } from 'lodash';
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
import { deskTypes } from '../../constants';
import CreateDeskMutation from './graphql/CreateDeskMutation';
import './CreateDeskModal.scss';

const attributeLabels = {
  name: 'DESKS.MODAL.LABELS.DESK_NAME',
  deskType: 'DESKS.MODAL.LABELS.DESK_TYPE',
  officeUuid: 'DESKS.MODAL.LABELS.OFFICE_NAME',
  language: 'DESKS.MODAL.LABELS.LANGUAGE',
};

const validate = createValidator({
  name: ['required', 'string'],
  deskType: ['required', 'string'],
  officeUuid: ['required', 'string'],
  language: ['required', `in:${getAvailableLanguages().join()}`],
}, translateLabels(attributeLabels), false);

class CreateDeskModal extends PureComponent {
  static propTypes = {
    officesData: PropTypes.userBranchHierarchyResponse.isRequired,
    createDesk: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    notify: PropTypes.func.isRequired,
  };

  handleSubmit = async (values, { setSubmitting }) => {
    const {
      onCloseModal,
      createDesk,
      onSuccess,
      notify,
    } = this.props;

    const {
      data: {
        hierarchy: {
          createDesk: {
            data,
          },
        },
      },
    } = await createDesk({ variables: values });

    notify({
      level: data ? 'success' : 'error',
      title: data
        ? I18n.t('DESKS.MODAL.NOTIFICATIONS.ERROR')
        : I18n.t('COMMON.FAIL'),
      message: data
        ? I18n.t('DESKS.MODAL.NOTIFICATIONS.SUCCESS')
        : I18n.t('COMMON.SUCCESS'),
    });

    if (data) {
      onSuccess();
      onCloseModal();
    }

    setSubmitting(false);
  };

  render() {
    const {
      onCloseModal,
      officesData,
      isOpen,
    } = this.props;

    const offices = get(officesData, 'data.hierarchy.userBranchHierarchy.data.OFFICE') || [];

    return (
      <Modal className="CreateDeskModal" toggle={onCloseModal} isOpen={isOpen}>
        <Formik
          initialValues={{}}
          validate={validate}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={this.handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <ModalHeader toggle={onCloseModal}>{I18n.t('DESKS.MODAL.HEADER')}</ModalHeader>
              <ModalBody>
                <Field
                  name="name"
                  className="CreateDeskModal__field CreateDeskModal__name"
                  label={I18n.t(attributeLabels.name)}
                  placeholder={I18n.t(attributeLabels.name)}
                  component={FormikInputField}
                  disabled={isSubmitting}
                />

                <Field
                  name="deskType"
                  className="CreateDeskModal__field CreateDeskModal__desk-type"
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
                  name="officeUuid"
                  className="CreateDeskModal__field"
                  component={FormikSelectField}
                  label={I18n.t(attributeLabels.officeUuid)}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                  disabled={isSubmitting || offices.length === 0}
                >
                  {offices.map(({ name, uuid }) => (
                    <option key={uuid} value={uuid}>{name}</option>
                  ))}
                </Field>

                <Field
                  name="language"
                  className="CreateDeskModal__field"
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
                  className="CreateDeskModal__button"
                  commonOutline
                >
                  {I18n.t('COMMON.BUTTONS.CANCEL')}
                </Button>

                <Button
                  className="CreateDeskModal__button"
                  primary
                  disabled={isSubmitting}
                  type="submit"
                >
                  {I18n.t('DESKS.MODAL.CREATE_BUTTON')}
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
    createDesk: CreateDeskMutation,
  }),
)(CreateDeskModal);