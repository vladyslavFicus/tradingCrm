import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { State } from 'types';
import { Callback__Status__Enum as CallbackStatusEnum } from '__generated__/types';
import { ResetForm } from 'types/formik';
import enumToArray from 'utils/enumToArray';
import { Button, RefreshButton } from 'components/Buttons';
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
      initialValues={state?.filters as FormValues || {}}
      onSubmit={handleSubmit}
      enableReinitialize
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
            data-testid="ClientCallbacksGridFilter-searchKeywordInput"
            label={I18n.t('CALLBACKS.FILTER.SEARCH_BY')}
            placeholder={I18n.t('CALLBACKS.FILTER.CALLBACK_OR_OPERATOR')}
            addition={<i className="icon icon-search" />}
            component={FormikInputField}
            withFocus
          />

          <Field
            name="statuses"
            className="ClientCallbacksGridFilter__field ClientCallbacksGridFilter__select"
            data-testid="ClientCallbacksGridFilter-statusesSelect"
            placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
            label={I18n.t('CALLBACKS.FILTER.STATUS')}
            component={FormikSelectField}
            searchable
            withFocus
            multiple
          >
            {enumToArray(CallbackStatusEnum).map(callbackStatus => (
              <option key={callbackStatus} value={callbackStatus}>
                {I18n.t(`CONSTANTS.CALLBACKS.${callbackStatus}`)}
              </option>
            ))}
          </Field>

          <Field
            className="ClientCallbacksGridFilter__field ClientCallbacksGridFilter__date-range"
            data-testid="ClientCallbacksGridFilter-callbackTimeDateRangePicker"
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
              data-testid="ClientCallbacksGridFilter-refreshButton"
              onClick={onRefetch}
            />

            <Button
              className="ClientCallbacksGridFilter__button"
              data-testid="ClientCallbacksGridFilter-resetButton"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>

            <Button
              className="ClientCallbacksGridFilter__button"
              data-testid="ClientCallbacksGridFilter-applyButton"
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
