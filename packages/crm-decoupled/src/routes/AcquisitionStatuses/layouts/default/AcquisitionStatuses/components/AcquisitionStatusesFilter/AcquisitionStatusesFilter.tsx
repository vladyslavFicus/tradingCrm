import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Button, RefreshButton } from 'components';
import { AcquisitionStatusTypes__Enum as AcquisitionStatusTypes } from '__generated__/types';
import { FormikSelectField, FormikInputField } from 'components/Formik';
import useFilter from 'hooks/useFilter';
import { FormValues } from 'routes/AcquisitionStatuses/types';
import useAcquisitionStatuses from 'routes/AcquisitionStatuses/hooks/useAcquisitionStatuses';
import './AcquisitionStatusesFilter.scss';

const AcquisitionStatusesFilter = () => {
  const { refetch } = useAcquisitionStatuses();
  const {
    filters,
    handleSubmit,
    handleReset,
  } = useFilter<FormValues>();

  return (
    <Formik
      enableReinitialize
      initialValues={filters}
      onSubmit={handleSubmit}
    >
      {({
        isSubmitting,
        resetForm,
        values,
        dirty,
      }) => (
        <Form className="AcquisitionStatusesFilter">
          <div className="AcquisitionStatusesFilter__fields">
            <Field
              name="statusName"
              className="AcquisitionStatusesFilter__field AcquisitionStatusesFilter__field--large"
              data-testid="AcquisitionStatusesFilter-statusNameInput"
              label={I18n.t('SETTINGS.ACQUISITION_STATUSES.FORM.FIELDS.SEARCH_BY')}
              placeholder={I18n.t('SETTINGS.ACQUISITION_STATUSES.FORM.FIELDS.SEARCH_BY_PLACEHOLDER')}
              addition={<i className="icon icon-search" />}
              component={FormikInputField}
              maxLength={200}
              withFocus
            />

            <Field
              name="type"
              data-testid="AcquisitionStatusesFilter-typeSelect"
              label={I18n.t('SETTINGS.ACQUISITION_STATUSES.FORM.FIELDS.ACQUISITION_STATUS')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              className="AcquisitionStatusesFilter__field"
              component={FormikSelectField}
              withFocus
              withAnyOption
            >
              <option key={AcquisitionStatusTypes.SALES} value={AcquisitionStatusTypes.SALES}>
                {I18n.t('SETTINGS.ACQUISITION_STATUSES.TYPES.SALES')}
              </option>

              <option key={AcquisitionStatusTypes.RETENTION} value={AcquisitionStatusTypes.RETENTION}>
                {I18n.t('SETTINGS.ACQUISITION_STATUSES.TYPES.RETENTION')}
              </option>
            </Field>

            <div className="AcquisitionStatusesFilter__buttons">
              <RefreshButton
                className="AcquisitionStatusesFilter__button"
                data-testid="AcquisitionStatusesFilter-refreshButton"
                onClick={refetch}
              />

              <Button
                className="AcquisitionStatusesFilter__button"
                data-testid="AcquisitionStatusesFilter-resetButton"
                onClick={() => handleReset(resetForm)}
                disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
                primary
              >
                {I18n.t('COMMON.RESET')}
              </Button>

              <Button
                className="AcquisitionStatusesFilter__button"
                data-testid="AcquisitionStatusesFilter-applyButton"
                type="submit"
                disabled={isSubmitting || !dirty}
                primary
              >
                {I18n.t('COMMON.APPLY')}
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default React.memo(AcquisitionStatusesFilter);
