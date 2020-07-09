import React, { PureComponent } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { parseErrors } from 'apollo';
import PropTypes from 'constants/propTypes';
import { aquisitionStatuses } from 'constants/aquisitionStatuses';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components/UI';
import { createValidator } from 'utils/validator';
import { checkMovePermission } from './utils';
import { getClientsData } from '../utils';

const validate = createValidator({
  acquisitionStatus: ['required', 'string'],
});

class MoveModal extends PureComponent {
  static propTypes = {
    configs: PropTypes.shape({
      allRowsSelected: PropTypes.bool,
      totalElements: PropTypes.number,
      touchedRowsIds: PropTypes.arrayOf(PropTypes.number),
      searchParams: PropTypes.object,
      selectedRowsLength: PropTypes.number,
    }).isRequired,
    notify: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    content: PropTypes.arrayOf(PropTypes.object).isRequired,
    bulkClientUpdate: PropTypes.func.isRequired,
  };

  handleMoveSubmit = async ({ acquisitionStatus }, { setSubmitting, setErrors }) => {
    const {
      notify,
      configs,
      configs: {
        totalElements,
      },
      content,
      onSuccess,
      onCloseModal,
      bulkClientUpdate,
    } = this.props;

    const actionForbidden = checkMovePermission({ ...configs, content, acquisitionStatus });

    const type = acquisitionStatus;

    if (actionForbidden) {
      const typeLowercased = acquisitionStatus.toLowerCase();
      notify({
        level: 'error',
        title: I18n.t('COMMON.BULK_UPDATE_FAILED'),
        message: I18n.t('clients.bulkUpdate.moveForbidden', { type: typeLowercased }),
      });
      setErrors({
        submit: I18n.t('clients.bulkUpdate.detailedTypeError', { type: typeLowercased }),
      });
      setSubmitting(false);
      return;
    }

    const isMoveAction = true;
    const clients = getClientsData(configs, totalElements, { type, isMoveAction }, content);

    try {
      await bulkClientUpdate({
        variables: {
          type,
          clients,
          isMoveAction,
          totalElements,
          ...configs,
        },
      });

      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('CLIENTS.ACQUISITION_STATUS_UPDATED'),
      });

      onCloseModal();
      onSuccess();
    } catch (e) {
      const error = parseErrors(e);

      // when we try to move clients, when they don't have assigned {{type}} representative
      // GQL will return exact this error and we catch it to show custom message
      const condition = error.error && error.error === 'clients.bulkUpdate.moveForbidden';

      notify({
        level: 'error',
        title: I18n.t('COMMON.BULK_UPDATE_FAILED'),
        message: condition
          ? I18n.t(error.error, { type })
          : I18n.t('COMMON.SOMETHING_WRONG'),
      });

      if (condition) {
        setErrors({
          submit: I18n.t('clients.bulkUpdate.detailedTypeError', { type }),
        });
        setSubmitting(false);
      }
    }
  }

  render() {
    const {
      isOpen,
      onCloseModal,
      configs: { selectedRowsLength },
    } = this.props;

    return (
      <Modal
        toggle={onCloseModal}
        isOpen={isOpen}
      >
        <Formik
          initialValues={{ acquisitionStatus: '' }}
          onSubmit={this.handleMoveSubmit}
          validate={validate}
        >
          {({ errors, isValid, isSubmitting, dirty }) => (
            <Form>
              <ModalHeader toggle={onCloseModal}>
                <div>{I18n.t('CLIENTS.MODALS.MOVE_MODAL.MOVE_HEADER')}</div>
                <div className="font-size-11 color-yellow">
                  {selectedRowsLength}{' '}{I18n.t('COMMON.CLIENTS_SELECTED')}
                </div>
              </ModalHeader>
              <ModalBody>
                <If condition={errors && errors.submit}>
                  <div className="mb-2 text-center color-danger">
                    {errors.submit}
                  </div>
                </If>
                <Field
                  name="acquisitionStatus"
                  label={I18n.t('CLIENTS.MODALS.MOVE_MODAL.MOVE_LABEL')}
                  component={FormikSelectField}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                  disabled={isSubmitting}
                >
                  {aquisitionStatuses.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {I18n.t(label)}
                    </option>
                  ))}
                </Field>
              </ModalBody>
              <ModalFooter>
                <Button
                  default
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
                  {I18n.t('CLIENTS.MODALS.SUBMIT')}
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </Modal>
    );
  }
}

export default MoveModal;
