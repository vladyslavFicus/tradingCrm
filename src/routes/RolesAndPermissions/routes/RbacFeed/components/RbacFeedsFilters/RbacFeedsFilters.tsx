import React from 'react';
import I18n from 'i18n-js';
import { useHistory, useLocation } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { State } from 'types';
import { ResetForm } from 'types/formik';
import { FormikInputField, FormikDateRangePicker } from 'components/Formik';
import { Button, RefreshButton } from 'components/Buttons';
import { decodeNullValues } from 'components/Formik/utils';
import { createValidator } from 'utils/validator';
import { FeedsQueryVariables } from '../../graphql/__generated__/FeedsQuery';
import './RbacFeedsFilters.scss';

type FormValues = {
  searchBy?: string,
  auditLogType?: string,
  creationDateFrom?: string,
  creationDateTo?: string,
};

type Props = {
  onRefetch: () => void,
};

const RbacFeedsFilters = (props: Props) => {
  const { onRefetch } = props;

  const { state } = useLocation<State<FeedsQueryVariables>>();

  const history = useHistory();

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

  return (
    <Formik
      enableReinitialize
      initialValues={state?.filters || {}}
      onSubmit={handleSubmit}
      validate={
        createValidator({
          searchBy: 'string',
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
        <Form className="RbacFeedsFilters">
          <Field
            name="searchBy"
            className="RbacFeedsFilters__field"
            label={I18n.t('ROLES_AND_PERMISSIONS.FEED.FILTER_FORM.LABELS.SEARCH_BY')}
            placeholder={I18n.t('ROLES_AND_PERMISSIONS.FEED.FILTER_FORM.LABELS.SEARCH_BY_PLACEHOLDER')}
            addition={<i className="icon icon-search" />}
            component={FormikInputField}
            withFocus
          />

          <Field
            className="RbacFeedsFilters__field RbacFeedsFilters__field--date-range"
            label={I18n.t('ROLES_AND_PERMISSIONS.FEED.FILTER_FORM.LABELS.ACTION_DATE_RANGE')}
            component={FormikDateRangePicker}
            fieldsNames={{
              from: 'creationDateFrom',
              to: 'creationDateTo',
            }}
            withFocus
          />

          <div className="RbacFeedsFilters__buttons-group">
            <RefreshButton
              className="RbacFeedsFilters__button"
              onClick={onRefetch}
            />

            <Button
              className="RbacFeedsFilters__button"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>

            <Button
              className="RbacFeedsFilters__button"
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

export default React.memo(RbacFeedsFilters);
