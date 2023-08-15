import React from 'react';
import I18n from 'i18n-js';
import { differenceWith } from 'lodash';
import { Formik, Form, Field, FormikProps } from 'formik';
import { Config, Utils, Constants, notify, Types } from '@crm/common';
import { ShortLoader, FormikSingleSelectField } from 'components';
import { AcquisitionStatusTypes__Enum as AcquisitionStatusTypes } from '__generated__/types';
import Modal from 'components/Modal';
import { useAcquisitionStatusesQuery } from './graphql/__generated__/AcquisitionStatusesQuery';
import { useCreateAcquisitionStatusMutation } from './graphql/__generated__/CreateAcquisitionStatusMutation';
import './CreateAcquisitionStatusModal.scss';

const validate = Utils.createValidator(
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

export type Props = {
  onSuccess: () => void,
  onCloseModal: () => void,
};

const CreateAcquisitionStatusModal = (props: Props) => {
  const { onSuccess, onCloseModal } = props;

  // ===== Requests ===== //
  const acquisitionStatusesQuery = useAcquisitionStatusesQuery({
    variables: {
      brandId: Config.getBrand().id,
      args: {},
    },
  });

  const acquisitionStatuses = acquisitionStatusesQuery.data?.settings.acquisitionStatuses || [];

  const [createAcquisitionStatus] = useCreateAcquisitionStatusMutation();

  // Get only not used SALES statuses
  const differenceSalesStatuses = differenceWith(
    Object.keys(Constants.salesStatuses),
    acquisitionStatuses,
    (salesStatus, { type, status }) => type === AcquisitionStatusTypes.SALES && salesStatus === status,
  ).sort();

  // Get only not used RETENTION statuses
  const differenceRetentionStatuses = differenceWith(
    Object.keys(Constants.retentionStatuses),
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
        level: Types.LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('SETTINGS.ACQUISITION_STATUSES.MODALS.NEW_ACQUISITION_STATUS.NOTIFICATION.SUCCESS'),
      });
    } catch (e) {
      notify({
        level: Types.LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('SETTINGS.ACQUISITION_STATUSES.MODALS.NEW_ACQUISITION_STATUS.NOTIFICATION.FAILED'),
      });
    }
  };

  const handleTypeChange = (type: AcquisitionStatusTypes, setFieldValue: Types.SetFieldValue<FormValues>) => {
    setFieldValue('type', type);

    // Clear status field while new type chosen
    setFieldValue('status', '');
  };

  return (
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
      {({ dirty, isSubmitting, setFieldValue, values, submitForm }: FormikProps<FormValues>) => (
        <Modal
          onCloseModal={onCloseModal}
          disabled={!dirty || isSubmitting}
          buttonTitle={I18n.t('COMMON.SAVE')}
          clickSubmit={submitForm}
          title={(
            <Choose>
              <When condition={acquisitionStatusesQuery.loading}>
                {I18n.t('COMMON.LOADING')}
              </When>

              <Otherwise>
                {I18n.t('SETTINGS.ACQUISITION_STATUSES.MODALS.NEW_ACQUISITION_STATUS.TITLE')}
              </Otherwise>
            </Choose>
          )}
        >
          <Form>
            <Choose>
              <When condition={acquisitionStatusesQuery.loading}>
                <ShortLoader className="CreateAcquisitionStatusModal__loader" />
              </When>

              <Otherwise>
                <div className="CreateAcquisitionStatusModal__fields">
                  <Field
                    name="type"
                    data-testid="CreateAcquisitionStatusModal-typeSelect"
                    label={I18n.t('SETTINGS.ACQUISITION_STATUSES.MODALS.NEW_ACQUISITION_STATUS.FORM.ACQUISITION')}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                    className="CreateAcquisitionStatusModal__field--large"
                    component={FormikSingleSelectField}
                    customOnChange={(type: AcquisitionStatusTypes) => handleTypeChange(type, setFieldValue)}
                    options={[
                      {
                        label: I18n.t('SETTINGS.ACQUISITION_STATUSES.TYPES.SALES'),
                        value: AcquisitionStatusTypes.SALES,
                      },
                      {
                        label: I18n.t('SETTINGS.ACQUISITION_STATUSES.TYPES.RETENTION'),
                        value: AcquisitionStatusTypes.RETENTION,
                      },
                    ]}
                  />

                  <Field
                    searchable
                    name="status"
                    data-testid="CreateAcquisitionStatusModal-statusSelect"
                    label={I18n.t('SETTINGS.ACQUISITION_STATUSES.MODALS.NEW_ACQUISITION_STATUS.FORM.STATUS')}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                    className="CreateAcquisitionStatusModal__field--large"
                    component={FormikSingleSelectField}
                    disabled={
                        values.type === AcquisitionStatusTypes.SALES
                          ? differenceSalesStatuses.length === 0
                          : differenceRetentionStatuses.length === 0
                      }
                    options={values.type === AcquisitionStatusTypes.SALES
                      ? differenceSalesStatuses.map(status => ({
                        label: I18n.t(Constants.salesStatuses[status]),
                        value: status,
                      }))
                      : differenceRetentionStatuses.map(status => ({
                        label: I18n.t(Constants.retentionStatuses[status]),
                        value: status,
                      }))
                  }
                  />
                </div>
              </Otherwise>
            </Choose>
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default React.memo(CreateAcquisitionStatusModal);
