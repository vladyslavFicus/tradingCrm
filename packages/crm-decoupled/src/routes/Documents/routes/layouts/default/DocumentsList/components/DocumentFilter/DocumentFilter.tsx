import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import useFilter from 'hooks/useFilter';
import { FormikDateRangePicker, FormikInputField } from 'components/Formik';
import { Button, RefreshButton } from 'components/Buttons';
import TimeZoneField from 'components/TimeZoneField';
import { FormValues } from 'routes/Documents/routes/types';
import useDocuments from 'routes/Documents/routes/hooks/useDocuments';
import './DocumentFilter.scss';

const DocumentFilter = () => {
  // ===== Hooks ===== //
  const { refetch } = useDocuments();

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
        isValid,
        resetForm,
        values,
        dirty,
      }) => (
        <Form className="DocumentFilter">
          <div className="DocumentFilter__fields">
            <Field
              name="searchBy"
              className="DocumentFilter__field DocumentFilter__search"
              data-testid="DocumentFilter-searchByInput"
              label={I18n.t('DOCUMENTS.GRID.FILTER_FORM.SEARCH')}
              placeholder={I18n.t('DOCUMENTS.GRID.FILTER_FORM.SEARCH_PLACEHOLDER')}
              component={FormikInputField}
              addition={<i className="icon icon-search" />}
            />

            <TimeZoneField
              className="DocumentFilter__field DocumentFilter__time-zone"
              data-testid="DocumentFilter-timeZone"
            />

            <Field
              name="uploadDateRange"
              className="DocumentFilter__field DocumentFilter__date-range"
              data-testid="DocumentFilter-uploadDateRangePicker"
              label={I18n.t('DOCUMENTS.GRID.FILTER_FORM.CREATION_DATE_LABEL')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              component={FormikDateRangePicker}
              fieldsNames={{
                from: 'uploadDateRange.from',
                to: 'uploadDateRange.to',
              }}
            />

            <div className="DocumentFilter__buttons">
              <RefreshButton
                className="DocumentFilter__button"
                data-testid="DocumentFilter-refreshButton"
                onClick={refetch}
              />

              <Button
                className="DocumentFilter__button"
                data-testid="DocumentFilter-resetButton"
                onClick={() => handleReset(resetForm)}
                disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
                primary
              >
                {I18n.t('COMMON.RESET')}
              </Button>

              <Button
                className="DocumentFilter__button"
                data-testid="DocumentFilter-applyButton"
                type="submit"
                disabled={isSubmitting || !isValid || !dirty}
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

export default React.memo(DocumentFilter);
