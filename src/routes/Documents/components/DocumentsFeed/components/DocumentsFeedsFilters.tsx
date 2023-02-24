import React, { useMemo } from 'react';
import I18n from 'i18n-js';
import { useHistory, useLocation } from 'react-router-dom';
import { Field, Form, Formik } from 'formik';
import { State } from 'types';
import { getBrand } from 'config';
import { ResetForm } from 'types/formik';
import { FormikDateRangePicker, FormikInputField, FormikSelectField } from 'components/Formik';
import { Button, RefreshButton } from 'components/Buttons';
import { decodeNullValues } from 'components/Formik/utils';
import { createValidator } from 'utils/validator';
import renderLabel from 'utils/renderLabel';
import { typesLabels } from 'constants/audit';
import { FeedsDocumentQueryVariables } from '../graphql/__generated__/FeedsDocumentQuery';
import { useFeedsDocumentFiltersQuery } from './graphql/__generated__/FeedsDocumentFiltersQuery';
import './DocumentsFeedsFilters.scss';

type FormValues = {
  searchBy?: string,
  auditLogType?: string,
  creationDateFrom?: string,
  creationDateTo?: string,
};

type Props = {
  onRefetch: () => void,
};

const DocumentsFeedsFilters = (props: Props) => {
  const { onRefetch } = props;

  const { state } = useLocation<State<FeedsDocumentQueryVariables>>();

  const { replace } = useHistory();

  // ===== Request ===== //
  const { data } = useFeedsDocumentFiltersQuery({ variables: { uuid: getBrand().id } });

  const feedTypesList = data?.feedTypes || {};
  const availableTypes = useMemo(
    () => Object.keys(feedTypesList)
      .filter(key => feedTypesList[key] && key !== '__typename')
      .map(type => ({
        key: type,
        value: I18n.t(renderLabel(type, typesLabels)),
      }))
      .sort(({ value: a }, { value: b }) => (a > b ? 1 : -1)),
    [feedTypesList],
  );

  // ===== Handlers ===== //
  const handleSubmit = (values: FormValues) => {
    replace({
      state: {
        ...state,
        filters: decodeNullValues(values),
      },
    });
  };

  const handleReset = (resetForm: ResetForm<FormValues>) => {
    replace({
      state: {
        ...state,
        filters: null,
      },
    });

    resetForm();
  };

  return (
    <Formik
      enableReinitialize
      initialValues={state?.filters || {}}
      onSubmit={handleSubmit}
      validate={
        createValidator({
          searchBy: 'string',
          auditLogType: ['string', `in:${Object.keys(feedTypesList).join()}`],
          creationDateFrom: 'dateWithTime',
          creationDateTo: 'dateWithTime',
        }, false)
      }
    >
      {({
        isSubmitting,
        resetForm,
        values,
        dirty,
      }) => (
        <Form className="DocumentsFeedsFilters">
          <Field
            name="searchBy"
            className="DocumentsFeedsFilters__field"
            label={I18n.t('DOCUMENTS.FEED.FILTER_FORM.LABELS.SEARCH_BY')}
            placeholder={I18n.t('DOCUMENTS.FEED.FILTER_FORM.LABELS.SEARCH_BY_PLACEHOLDER')}
            addition={<i className="icon icon-search" />}
            component={FormikInputField}
            withFocus
          />

          <Field
            name="auditLogType"
            label={I18n.t('DOCUMENTS.FEED.FILTER_FORM.LABELS.ACTION_TYPE')}
            placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
            component={FormikSelectField}
            className="DocumentsFeedsFilters__field"
            withAnyOption
            withFocus
          >
            {availableTypes.map(({ key, value }) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </Field>

          <Field
            className="DocumentsFeedsFilters__field DocumentsFeedsFilters__field--date-range"
            label={I18n.t('DOCUMENTS.FEED.FILTER_FORM.LABELS.ACTION_DATE_RANGE')}
            component={FormikDateRangePicker}
            fieldsNames={{
              from: 'creationDateFrom',
              to: 'creationDateTo',
            }}
            withFocus
          />

          <div className="DocumentsFeedsFilters__buttons-group">
            <RefreshButton
              className="DocumentsFeedsFilters__button"
              onClick={onRefetch}
            />

            <Button
              className="DocumentsFeedsFilters__button"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>

            <Button
              className="DocumentsFeedsFilters__button"
              disabled={isSubmitting || !dirty}
              primary
              type="submit"
            >
              {I18n.t('COMMON.APPLY')}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default React.memo(DocumentsFeedsFilters);
