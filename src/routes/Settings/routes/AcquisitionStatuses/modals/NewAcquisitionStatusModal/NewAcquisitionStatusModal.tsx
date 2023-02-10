import React from 'react';
import I18n from 'i18n-js';
import { differenceWith } from 'lodash';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field, FormikProps } from 'formik';
import { getBrand } from 'config';
import { AcquisitionStatusTypes__Enum as AcquisitionStatusTypes } from '__generated__/types';
import { notify, LevelType } from 'providers/NotificationProvider';
import { SetFieldValue } from 'types/formik';
import { createValidator } from 'utils/validator';
import { salesStatuses } from 'constants/salesStatuses';
import { retentionStatuses } from 'constants/retentionStatuses';
import { Button } from 'components/Buttons';
import ShortLoader from 'components/ShortLoader';
import { FormikSelectField } from 'components/Formik';
import { useAcquisitionStatusesQuery } from './graphql/__generated__/AcquisitionStatusesQuery';
import { useCreateAcquisitionStatusMutation } from './graphql/__generated__/CreateAcquisitionStatusMutation';
import './NewAcquisitionStatusModal.scss';

const validate = createValidator(
  {
    type: 'required',
    status: 'required',
  },
  {
    status: I18n.t('SETTINGS.ACQUISITION_STATUSES.MODALS.NEW_ACQUISITION_STATUS.FORM.STATUS'),
  },
  false,
);

type FormValues = {
  type: AcquisitionStatusTypes,
  status: string,
};

type Props = {
  isOpen: boolean,
  onSuccess: () => void,
  onCloseModal: () => void,
};

const NewAcquisitionStatusModal = (props: Props) => {
  const { isOpen, onSuccess, onCloseModal } = props;

  // ===== Requests ===== //
  const acquisitionStatusesQuery = useAcquisitionStatusesQuery({
    variables: {
      brandId: getBrand().id,
      args: {},
    },
  });

  const acquisitionStatuses = acquisitionStatusesQuery.data?.settings.acquisitionStatuses || [];

  const [createAcquisitionStatus] = useCreateAcquisitionStatusMutation();

  // Get only not used SALES statuses
  const differenceSalesStatuses = differenceWith(
    Object.keys(salesStatuses),
    acquisitionStatuses,
    (salesStatus, { type, status }) => type === AcquisitionStatusTypes.SALES && salesStatus === status,
  ).sort();

  // Get only not used RETENTION statuses
  const differenceRetentionStatuses = differenceWith(
    Object.keys(retentionStatuses),
    acquisitionStatuses,
    (salesStatus, { type, status }) => type === AcquisitionStatusTypes.RETENTION && salesStatus === status,
  ).sort();

  // ===== Handlers ===== //
  const handleSubmit = async (values: FormValues) => {
    try {
      await createAcquisitionStatus({ variables: values });

      onSuccess();
      onCloseModal();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('SETTINGS.ACQUISITION_STATUSES.MODALS.NEW_ACQUISITION_STATUS.NOTIFICATION.SUCCESS'),
      });
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('SETTINGS.ACQUISITION_STATUSES.MODALS.NEW_ACQUISITION_STATUS.NOTIFICATION.FAILED'),
      });
    }
  };

  const handleTypeChange = (type: AcquisitionStatusTypes, setFieldValue: SetFieldValue<FormValues>) => {
    setFieldValue('type', type);

    // Clear status field while new type chosen
    setFieldValue('status', '');
  };

  return (
    <Modal
      className="NewAcquisitionStatusModal"
      toggle={onCloseModal}
      isOpen={isOpen}
    >
      <Formik
        initialValues={{
          type: AcquisitionStatusTypes.SALES,
          status: '',
        }}
        validate={validate}
        validateOnChange={false}
        validateOnBlur={false}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ dirty, isSubmitting, setFieldValue, values }: FormikProps<FormValues>) => (
          <Form>
            <ModalHeader toggle={onCloseModal}>
              <Choose>
                <When condition={acquisitionStatusesQuery.loading}>
                  {I18n.t('COMMON.LOADING')}
                </When>

                <Otherwise>
                  {I18n.t('SETTINGS.ACQUISITION_STATUSES.MODALS.NEW_ACQUISITION_STATUS.TITLE')}
                </Otherwise>
              </Choose>
            </ModalHeader>

            <Choose>
              <When condition={acquisitionStatusesQuery.loading}>
                <ShortLoader className="NewAcquisitionStatusModal__loader" />
              </When>

              <Otherwise>
                <ModalBody>
                  <div className="NewAcquisitionStatusModal__fields">
                    <Field
                      name="type"
                      label={I18n.t('SETTINGS.ACQUISITION_STATUSES.MODALS.NEW_ACQUISITION_STATUS.FORM.ACQUISITION')}
                      placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                      className="NewAcquisitionStatusModal__field--large"
                      component={FormikSelectField}
                      customOnChange={(type: AcquisitionStatusTypes) => handleTypeChange(type, setFieldValue)}
                    >
                      <option key={AcquisitionStatusTypes.SALES} value={AcquisitionStatusTypes.SALES}>
                        {I18n.t('SETTINGS.ACQUISITION_STATUSES.TYPES.SALES')}
                      </option>
                      <option key={AcquisitionStatusTypes.RETENTION} value={AcquisitionStatusTypes.RETENTION}>
                        {I18n.t('SETTINGS.ACQUISITION_STATUSES.TYPES.RETENTION')}
                      </option>
                    </Field>

                    <Field
                      name="status"
                      label={I18n.t('SETTINGS.ACQUISITION_STATUSES.MODALS.NEW_ACQUISITION_STATUS.FORM.STATUS')}
                      placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                      className="NewAcquisitionStatusModal__field--large"
                      component={FormikSelectField}
                      disabled={
                        values.type === AcquisitionStatusTypes.SALES
                          ? differenceSalesStatuses.length === 0
                          : differenceRetentionStatuses.length === 0
                      }
                      searchable
                    >
                      <Choose>
                        <When condition={values.type === AcquisitionStatusTypes.SALES}>
                          {differenceSalesStatuses.map(status => (
                            <option key={status} value={status}>
                              {I18n.t(salesStatuses[status])}
                            </option>
                          ))}
                        </When>

                        <When condition={values.type === AcquisitionStatusTypes.RETENTION}>
                          {differenceRetentionStatuses.map(status => (
                            <option key={status} value={status}>
                              {I18n.t(retentionStatuses[status])}
                            </option>
                          ))}
                        </When>
                      </Choose>
                    </Field>
                  </div>
                </ModalBody>

                <ModalFooter>
                  <Button
                    tertiary
                    onClick={onCloseModal}
                  >
                    {I18n.t('COMMON.CANCEL')}
                  </Button>

                  <Button
                    type="submit"
                    disabled={!dirty || isSubmitting}
                    primary
                  >
                    {I18n.t('COMMON.SAVE')}
                  </Button>
                </ModalFooter>
              </Otherwise>
            </Choose>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default React.memo(NewAcquisitionStatusModal);
