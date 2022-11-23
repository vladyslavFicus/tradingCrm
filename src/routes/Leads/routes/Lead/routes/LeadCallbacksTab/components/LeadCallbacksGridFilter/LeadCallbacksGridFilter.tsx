import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { State } from 'types';
import { callbacksStatuses } from 'constants/callbacks';
import { Button, RefreshButton } from 'components/UI';
import { FormikInputField, FormikSelectField, FormikDateRangePicker } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { LeadCallbacksQueryVariables } from '../../graphql/__generated__/LeadCallbacksQuery';
import './LeadCallbacksGridFilter.scss';

type Props = {
  handleRefetch: () => void,
};

const LeadCallbacksGridFilter = (props: Props) => {
  const { handleRefetch } = props;

  const { state } = useLocation<State<LeadCallbacksQueryVariables>>();
  const history = useHistory();

  const handleSubmit = (values: LeadCallbacksQueryVariables) => {
    history.replace({
      state: {
        ...state,
        filters: decodeNullValues(values),
      },
    });
  };

  const handleReset = (resetForm: Function) => {
    history.replace({
      state: {
        ...state,
        filters: {},
      },
    });
    resetForm();
  };

  return (
    <Formik
      className="LeadCallbacksGridFilter"
      initialValues={state?.filters as LeadCallbacksQueryVariables || {}}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({
        isSubmitting,
        resetForm,
        values,
        dirty,
      }) => (
        <Form className="LeadCallbacksGridFilter__form">
          <Field
            name="searchKeyword"
            className="LeadCallbacksGridFilter__field LeadCallbacksGridFilter__search"
            label={I18n.t('CALLBACKS.FILTER.SEARCH_BY')}
            placeholder={I18n.t('CALLBACKS.FILTER.CALLBACK_OR_OPERATOR')}
            addition={<i className="icon icon-search" />}
            component={FormikInputField}
            withFocus
          />

          <Field
            name="statuses"
            className="LeadCallbacksGridFilter__field LeadCallbacksGridFilter__select"
            placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
            label={I18n.t('CALLBACKS.FILTER.STATUS')}
            component={FormikSelectField}
            withAnyOption
            searchable
            withFocus
          >
            {Object.keys(callbacksStatuses).map(status => (
              <option key={status} value={status}>{I18n.t(callbacksStatuses[status])}</option>
            ))}
          </Field>

          <Field
            className="LeadCallbacksGridFilter__field LeadCallbacksGridFilter__date-range"
            label={I18n.t('CALLBACKS.FILTER.DATE_RANGE')}
            component={FormikDateRangePicker}
            fieldsNames={{
              from: 'callbackTimeFrom',
              to: 'callbackTimeTo',
            }}
            withFocus
          />

          <div className="LeadCallbacksGridFilter__buttons">
            <RefreshButton
              className="LeadCallbacksGridFilter__button"
              onClick={handleRefetch}
            />

            <Button
              className="LeadCallbacksGridFilter__button"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>

            <Button
              className="LeadCallbacksGridFilter__button"
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

export default React.memo(LeadCallbacksGridFilter);
