import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { State } from 'types';
import { Callback__Status__Enum as CallbackStatusEnum } from '__generated__/types';
import { ResetForm } from 'types/formik';
import { callbacksStatuses } from 'constants/callbacks';
import { Button, RefreshButton } from 'components/UI';
import { FormikInputField, FormikSelectField, FormikDateRangePicker } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import './ClientCallbacksGridFilter.scss';

type FormValues = {
  searchKeyword?: string,
  statuses?: Array<CallbackStatusEnum>,
  callbackTimeFrom?: string,
  callbackTimeTo?: string,
};

type Props = {
  onRefetch: () => void,
};

const ClientCallbacksGridFilter = (props: Props) => {
  const { onRefetch } = props;

  const { state } = useLocation<State<FormValues>>();

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
      className="ClientCallbacksGridFilter"
      enableReinitialize
      initialValues={state?.filters as FormValues || {}}
      onSubmit={handleSubmit}
    >
      {({
        isSubmitting,
        resetForm,
        values,
        dirty,
      }) => (
        <Form className="ClientCallbacksGridFilter__form">
          <Field
            name="searchKeyword"
            className="ClientCallbacksGridFilter__field ClientCallbacksGridFilter__search"
            label={I18n.t('CALLBACKS.FILTER.SEARCH_BY')}
            placeholder={I18n.t('CALLBACKS.FILTER.SEARCH_BY_PLACEHOLDER_CLIENT')}
            addition={<i className="icon icon-search" />}
            component={FormikInputField}
            withFocus
          />

          <Field
            name="statuses"
            className="ClientCallbacksGridFilter__field ClientCallbacksGridFilter__select"
            placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
            label={I18n.t('CALLBACKS.FILTER.STATUS')}
            component={FormikSelectField}
            withAnyOption
            searchable
            withFocus
            multiple
          >
            {Object.keys(callbacksStatuses).map(status => (
              <option key={status} value={status}>{I18n.t(callbacksStatuses[status])}</option>
            ))}
          </Field>

          <Field
            className="ClientCallbacksGridFilter__field ClientCallbacksGridFilter__date-range"
            label={I18n.t('CALLBACKS.FILTER.DATE_RANGE')}
            component={FormikDateRangePicker}
            fieldsNames={{
              from: 'callbackTimeFrom',
              to: 'callbackTimeTo',
            }}
            withFocus
          />

          <div className="ClientCallbacksGridFilter__buttons">
            <RefreshButton
              className="ClientCallbacksGridFilter__button"
              onClick={onRefetch}
            />

            <Button
              className="ClientCallbacksGridFilter__button"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>

            <Button
              className="ClientCallbacksGridFilter__button"
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

export default React.memo(ClientCallbacksGridFilter);
