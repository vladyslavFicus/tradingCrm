import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Form, Field, Formik } from 'formik';
import { omit } from 'lodash';
import I18n from 'i18n-js';
import { State } from 'types';
import { ResetForm, SetFieldValue } from 'types/formik';
import { FormikInputField, FormikSelectField, FormikDateRangePicker } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { Button, RefreshButton } from 'components/Buttons';
import { FilesQueryVariables } from '../../graphql/__generated__/FilesQuery';
import { useFilesCategoriesQuery } from './graphql/__generated__/FilesCategoriesQuery';
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

  const { state } = useLocation<State<FilesQueryVariables>>();

  const history = useHistory();

  // ===== Requests ===== //
  const { data } = useFilesCategoriesQuery();

  const categoriesData = data?.filesCategories || {};
  const categories = omit(categoriesData, '__typename') as Record<string, Array<string>>;
  const verificationTypes = Object.keys(categories);

  // ===== Handlers ===== //
  const handleSubmit = (values: FormValues) => {
    history.replace({
      state: {
        ...state,
        filters: decodeNullValues(values),
      },
    });
  };

  const handleReset = (resetForm: ResetForm<FormValues>) => {
    history.replace({
      state: {
        ...state,
        filters: null,
      },
    });

    resetForm();
  };

  const handleVerificationTypeChange = (value: string, setFieldValue: SetFieldValue<FormValues>) => {
    setFieldValue('verificationType', value);

    if (value === 'OTHER') {
      setFieldValue('documentType', value);
    } else {
      setFieldValue('documentType', '');
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={state?.filters as FormValues || {}}
      onSubmit={handleSubmit}
    >
      {({ dirty, isSubmitting, values, setFieldValue, resetForm }) => (
        <Form className="FilesGridFilter">
          <div className="FilesGridFilter__inputs">
            <Field
              name="searchBy"
              className="FilesGridFilter__input FilesGridFilter__search"
              label={I18n.t('FILES.FILTER.SEARCH_BY')}
              placeholder={I18n.t('FILES.FILTER.SEARCH_BY_PLACEHOLDER')}
              addition={<i className="icon icon-search" />}
              component={FormikInputField}
              withFocus
            />

            <Field
              name="verificationType"
              className="FilesGridFilter__input FilesGridFilter__select"
              placeholder={I18n.t('FILES.FILTER.CATEGORY_PLACEHOLDER')}
              label={I18n.t('FILES.FILTER.CATEGORY')}
              component={FormikSelectField}
              customOnChange={(value: string) => handleVerificationTypeChange(value, setFieldValue)}
              searchable
              withAnyOption
              withFocus
            >
              {verificationTypes.map(item => (
                <option key={item} value={item}>
                  {I18n.t(`FILES.CATEGORIES.${item}`)}
                </option>
              ))}
            </Field>

            <Field
              name="documentType"
              className="FilesGridFilter__input FilesGridFilter__select"
              placeholder={I18n.t('FILES.FILTER.DOCUMENT_TYPE_PLACEHOLDER')}
              label={I18n.t('FILES.FILTER.DOCUMENT_TYPE')}
              component={FormikSelectField}
              disabled={!values.verificationType || values.verificationType === 'OTHER'}
              searchable
              withAnyOption
              withFocus
            >
              {(categories[values.verificationType] || []).map(item => (
                <option key={item} value={item}>
                  {I18n.t(`FILES.DOCUMENT_TYPES.${item}`)}
                </option>
              ))}
            </Field>

            <Field
              className="FilesGridFilter__input FilesGridFilter__dates"
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
              onClick={onRefetch}
            />

            <Button
              className="FilesGridFilter__button"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>

            <Button
              className="FilesGridFilter__button"
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
