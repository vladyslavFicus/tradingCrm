import React from 'react';
import { Form, Field, Formik } from 'formik';
import I18n from 'i18n-js';
import {
  Button,
  RefreshButton,
  FormikSingleSelectField,
  FormikInputField,
  FormikDateRangePicker,
} from 'components';
import useFilter from 'hooks/useFilter';
import useFilesGridFilter from 'routes/Clients/routes/Files/hooks/useFilesGridFilter';
import './FilesGridFilter.scss';

type FormValues = {
  searchBy: string,
  verificationType: string,
  documentType: string,
};

type Props = {
  onRefetch: () => void,
};

const FilesGridFilter = (props: Props) => {
  const { onRefetch } = props;

  const {
    categories,
    verificationTypes,
    handleVerificationTypeChange,
  } = useFilesGridFilter<FormValues>();

  const {
    filters,
    handleSubmit,
    handleReset,
  } = useFilter<FormValues>();

  return (
    <Formik
      enableReinitialize
      initialValues={filters as FormValues}
      onSubmit={handleSubmit}
    >
      {({ dirty, isSubmitting, values, setFieldValue, resetForm }) => (
        <Form className="FilesGridFilter">
          <div className="FilesGridFilter__inputs">
            <Field
              name="searchBy"
              className="FilesGridFilter__input FilesGridFilter__search"
              data-testid="FilesGridFilter-searchByInput"
              label={I18n.t('FILES.FILTER.SEARCH_BY')}
              placeholder={I18n.t('FILES.FILTER.SEARCH_BY_PLACEHOLDER')}
              addition={<i className="icon icon-search" />}
              component={FormikInputField}
              withFocus
            />

            <Field
              searchable
              withAnyOption
              withFocus
              name="verificationType"
              className="FilesGridFilter__input FilesGridFilter__select"
              data-testid="FilesGridFilter-verificationTypeSelect"
              placeholder={I18n.t('FILES.FILTER.CATEGORY_PLACEHOLDER')}
              label={I18n.t('FILES.FILTER.CATEGORY')}
              component={FormikSingleSelectField}
              customOnChange={(value: string) => handleVerificationTypeChange(value, setFieldValue)}
              options={verificationTypes.map(item => ({
                label: I18n.t(`FILES.CATEGORIES.${item}`),
                value: item,
              }))}
            />

            <Field
              searchable
              withAnyOption
              withFocus
              name="documentType"
              className="FilesGridFilter__input FilesGridFilter__select"
              data-testid="FilesGridFilter-documentTypeSelect"
              placeholder={I18n.t('FILES.FILTER.DOCUMENT_TYPE_PLACEHOLDER')}
              label={I18n.t('FILES.FILTER.DOCUMENT_TYPE')}
              component={FormikSingleSelectField}
              disabled={!values.verificationType || values.verificationType === 'OTHER'}
              options={(categories[values.verificationType] || []).map(item => ({
                label: I18n.t(`FILES.DOCUMENT_TYPES.${item}`),
                value: item,
              }))}
            />

            <Field
              className="FilesGridFilter__input FilesGridFilter__dates"
              data-testid="FilesGridFilter-uploadedDateRangePicker"
              label={I18n.t('FILES.FILTER.UPLOAD_DATA_RANGE')}
              component={FormikDateRangePicker}
              fieldsNames={{
                from: 'uploadedDateFrom',
                to: 'uploadedDateTo',
              }}
              withFocus
            />
          </div>

          <div className="FilesGridFilter__buttons">
            <RefreshButton
              className="FilesGridFilter__button"
              data-testid="FilesGridFilter-refreshButton"
              onClick={onRefetch}
            />

            <Button
              className="FilesGridFilter__button"
              data-testid="FilesGridFilter-resetButton"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>

            <Button
              className="FilesGridFilter__button"
              data-testid="FilesGridFilter-applyButton"
              disabled={isSubmitting || !dirty}
              type="submit"
              primary
            >
              {I18n.t('COMMON.APPLY')}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default React.memo(FilesGridFilter);
