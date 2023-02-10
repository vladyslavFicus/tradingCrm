import React, { PureComponent } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import compose from 'compose-function';
import { withRequests, parseErrors } from 'apollo';
import { notify, LevelType } from 'providers/NotificationProvider';
import PropTypes from 'constants/propTypes';
import { aquisitionStatuses } from 'constants/aquisitionStatuses';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components/Buttons';
import { createValidator } from 'utils/validator';
import UpdateAcquisitionStatusMutation from './graphql/UpdateAcquisitionStatusMutation';
import { checkMovePermission } from './utils';
import './UpdateAcquisitionStatusModal.scss';

class UpdateAcquisitionStatusModal extends PureComponent {
  static propTypes = {
    configs: PropTypes.shape({
      allRowsSelected: PropTypes.bool,
      totalElements: PropTypes.number,
      touchedRowsIds: PropTypes.arrayOf(PropTypes.number),
      searchParams: PropTypes.object,
      sorts: PropTypes.array,
      selectedRowsLength: PropTypes.number,
    }).isRequired,
    isOpen: PropTypes.bool.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    content: PropTypes.arrayOf(PropTypes.object).isRequired,
    updateAcquisitionStatus: PropTypes.func.isRequired,
  };

  handleMoveSubmit = async ({ acquisitionStatus }, { setSubmitting, setErrors }) => {
    const {
      configs,
      configs: {
        allRowsSelected,
        touchedRowsIds,
        searchParams,
        selectedRowsLength,
        sorts,
      },
      content,
      onSuccess,
      onCloseModal,
      updateAcquisitionStatus,
    } = this.props;

    const actionForbidden = checkMovePermission({ ...configs, content, acquisitionStatus });

    if (actionForbidden) {
      const typeLowercased = acquisitionStatus.toLowerCase();

      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.BULK_UPDATE_FAILED'),
        message: I18n.t('clients.bulkUpdate.moveForbidden', { type: typeLowercased }),
      });

      setErrors({
        submit: I18n.t('clients.bulkUpdate.detailedTypeError', { type: typeLowercased }),
      });

      setSubmitting(false);

      return;
    }

    let selectedClients = touchedRowsIds.map(index => content[index]);

    if (!allRowsSelected) {
      selectedClients = selectedClients.filter(({ acquisition }) => (
        acquisition.acquisitionStatus !== acquisitionStatus
      ));

      if (!selectedClients.length) {
        notify({
          level: LevelType.SUCCESS,
          title: I18n.t('COMMON.SUCCESS'),
          message: I18n.t('CLIENTS.ACQUISITION_STATUS_UPDATED'),
        });

        onCloseModal();
        onSuccess();

        return;
      }
    }

    try {
      await updateAcquisitionStatus({
        variables: {
          uuids: selectedClients.map(({ uuid }) => uuid),
          acquisitionStatus,
          ...allRowsSelected && {
            searchParams,
            sorts,
            bulkSize: selectedRowsLength,
          },
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('CLIENTS.ACQUISITION_STATUS_UPDATED'),
      });

      onCloseModal();
      onSuccess();
    } catch (e) {
      const error = parseErrors(e);

      // when we try to move clients and they don't have assigned {{type}} representative
      // GQL will return the error and we catch it to show custom message
      const condition = error.error && error.error === 'clients.bulkUpdate.moveForbidden';

      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.BULK_UPDATE_FAILED'),
        message: condition
          ? I18n.t(error.error, { type: acquisitionStatus })
          : I18n.t('COMMON.SOMETHING_WRONG'),
      });

      if (condition) {
        setErrors({
          submit: I18n.t('clients.bulkUpdate.detailedTypeError', { type: acquisitionStatus }),
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
        className="UpdateAcquisitionStatusModal"
        toggle={onCloseModal}
        isOpen={isOpen}
      >
        <Formik
          initialValues={{}}
          onSubmit={this.handleMoveSubmit}
          validate={createValidator({
            acquisitionStatus: ['required'],
          })}
        >
          {({ errors, isValid, isSubmitting, dirty }) => (
            <Form>
              <ModalHeader toggle={onCloseModal}>
                <div>{I18n.t('CLIENTS.MODALS.MOVE_MODAL.MOVE_HEADER')}</div>

                <div className="UpdateAcquisitionStatusModal__selected-clients">
                  {selectedRowsLength}{' '}{I18n.t('COMMON.CLIENTS_SELECTED')}
                </div>
              </ModalHeader>
              <ModalBody>
                <If condition={errors && errors.submit}>
                  <div className="UpdateAcquisitionStatusModal__error">
                    {errors.submit}
                  </div>
                </If>

                <Field
                  name="acquisitionStatus"
                  label={I18n.t('CLIENTS.MODALS.MOVE_MODAL.MOVE_LABEL')}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                  component={FormikSelectField}
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
                  tertiary
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

export default compose(
  withRequests({
    updateAcquisitionStatus: UpdateAcquisitionStatusMutation,
  }),
)(UpdateAcquisitionStatusModal);
