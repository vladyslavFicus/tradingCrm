import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { parseErrors } from 'apollo';
import { Sorts } from 'types';
import {
  AcquisitionStatusTypes__Enum as AcquisitionStatusTypes,
  HierarchyUserAcquisition,
  Profile,
} from '__generated__/types';
import { notify, LevelType } from 'providers/NotificationProvider';
import { aquisitionStatuses } from 'constants/aquisitionStatuses';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components/Buttons';
import { createValidator } from 'utils/validator';
import { useUpdateAcquisitionStatusMutation } from './graphql/__generated__/UpdateAcquisitionStatusMutation';
import './UpdateAcquisitionStatusModal.scss';

type FormValues = {
  acquisitionStatus: string,
};

type Configs = {
  allRowsSelected: boolean,
  totalElements: number,
  touchedRowsIds: Array<number>,
  searchParams: Object,
  sorts: Sorts,
  selectedRowsLength: number,
};

export type Props = {
  content: Array<Profile>,
  configs: Configs,
  onSuccess: () => void,
  onCloseModal: () => void,
};

const UpdateAcquisitionStatusModal = (props: Props) => {
  const { configs, content, onSuccess, onCloseModal } = props;

  const { allRowsSelected, totalElements, touchedRowsIds, searchParams, selectedRowsLength, sorts } = configs;

  const [error, setError] = useState<string | null>(null);

  // ===== Requests ===== //
  const [updateAcquisitionStatusMutation] = useUpdateAcquisitionStatusMutation();

  const checkMovePermission = (type: string) => {
    const representativeType = `${type}Representative` as keyof HierarchyUserAcquisition;

    if (allRowsSelected) {
      // check whether number of selected clients on the screen is equal all possible clients on that page
      // and if there is no unselected client
      if (!touchedRowsIds.length && content.length === totalElements) {
        return content.some(({ acquisition }) => !(acquisition && acquisition[representativeType]));
      }

      // if allRowsSelected and clients are not visible on page
      // we return false and this will be checked on GQL side
      return false;
    }

    return touchedRowsIds.some((index) => {
      const acquisition = content[index]?.acquisition;

      return !(acquisition && acquisition[representativeType]);
    });
  };

  // ===== Handlers ===== //
  const handleSubmit = async ({ acquisitionStatus }: FormValues) => {
    const typeLowercased = acquisitionStatus.toLowerCase();

    const actionForbidden = checkMovePermission(typeLowercased);

    if (actionForbidden) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.BULK_UPDATE_FAILED'),
        message: I18n.t('clients.bulkUpdate.moveForbidden', { type: typeLowercased }),
      });

      setError(I18n.t('clients.bulkUpdate.detailedTypeError', { type: typeLowercased }));

      return;
    }

    let selectedClients = touchedRowsIds.map(index => content[index]);

    if (!allRowsSelected) {
      selectedClients = selectedClients.filter(({ acquisition }) => (
        acquisition?.acquisitionStatus?.toLowerCase() !== typeLowercased
      ));

      if (!selectedClients.length) {
        onSuccess();
        onCloseModal();

        notify({
          level: LevelType.SUCCESS,
          title: I18n.t('COMMON.SUCCESS'),
          message: I18n.t('CLIENTS.ACQUISITION_STATUS_UPDATED'),
        });

        return;
      }
    }

    try {
      await updateAcquisitionStatusMutation({
        variables: {
          uuids: selectedClients.map(({ uuid }) => uuid),
          acquisitionStatus: acquisitionStatus as AcquisitionStatusTypes,
          searchParams: allRowsSelected ? searchParams : {},
          sorts: allRowsSelected ? sorts : [],
          bulkSize: allRowsSelected ? selectedRowsLength : null,
        },
      });

      onSuccess();
      onCloseModal();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('CLIENTS.ACQUISITION_STATUS_UPDATED'),
      });
    } catch (e) {
      const { error: parseError } = parseErrors(e);

      // when we try to move clients and they don't have assigned {{type}} representative
      // GQL will return the error and we catch it to show custom message
      const isForbidden = parseError === 'clients.bulkUpdate.moveForbidden';

      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.BULK_UPDATE_FAILED'),
        message: isForbidden ? I18n.t(parseError, { type: acquisitionStatus }) : I18n.t('COMMON.SOMETHING_WRONG'),
      });

      if (isForbidden) {
        setError(I18n.t('clients.bulkUpdate.detailedTypeError', { type: acquisitionStatus }));
      }
    }
  };

  return (
    <Modal className="UpdateAcquisitionStatusModal" toggle={onCloseModal} isOpen>
      <Formik
        initialValues={{ acquisitionStatus: '' }}
        onSubmit={handleSubmit}
        validate={createValidator({
          acquisitionStatus: ['required'],
        })}
      >
        {({ isValid, isSubmitting, dirty }) => (
          <Form>
            <ModalHeader toggle={onCloseModal}>
              {I18n.t('CLIENTS.MODALS.MOVE_MODAL.MOVE_HEADER')}

              <div className="UpdateAcquisitionStatusModal__selected-clients">
                {selectedRowsLength}{' '}{I18n.t('COMMON.CLIENTS_SELECTED')}
              </div>
            </ModalHeader>

            <ModalBody>
              <If condition={!!error}>
                <div className="UpdateAcquisitionStatusModal__error">
                  {error}
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
};

export default React.memo(UpdateAcquisitionStatusModal);
