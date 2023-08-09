import React, { useState } from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Utils } from '@crm/common';
import { parseErrors } from 'apollo';
import { Sorts } from 'types';
import {
  AcquisitionStatusTypes__Enum as AcquisitionStatusTypes,
  HierarchyUserAcquisition,
  ProfileView,
} from '__generated__/types';
import { notify, LevelType } from 'providers/NotificationProvider';
import { aquisitionStatuses } from 'constants/aquisitionStatuses';
import { FormikSelectField } from 'components/Formik';
import Modal from 'components/Modal';
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
  content: Array<ProfileView>,
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
    <Formik
      initialValues={{ acquisitionStatus: '' }}
      onSubmit={handleSubmit}
      validate={Utils.createValidator({
        acquisitionStatus: ['required'],
      })}
    >
      {({ isValid, isSubmitting, dirty, submitForm }) => (
        <Modal
          onCloseModal={onCloseModal}
          title={(
            <>
              {I18n.t('CLIENTS.MODALS.MOVE_MODAL.MOVE_HEADER')}

              <div className="UpdateAcquisitionStatusModal__selected-clients">
                {selectedRowsLength}{' '}{I18n.t('COMMON.CLIENTS_SELECTED')}
              </div>
            </>
            )}
          disabled={!dirty || !isValid || isSubmitting}
          buttonTitle={I18n.t('CLIENTS.MODALS.SUBMIT')}
          clickSubmit={submitForm}
        >
          <Form>
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
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default React.memo(UpdateAcquisitionStatusModal);
