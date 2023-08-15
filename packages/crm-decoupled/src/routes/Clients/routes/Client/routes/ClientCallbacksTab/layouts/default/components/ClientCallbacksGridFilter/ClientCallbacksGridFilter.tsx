import React from 'react';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { Utils } from '@crm/common';
import { Button, RefreshButton, FormikInputField, FormikSelectField, FormikDateRangePicker } from 'components';
import { Callback__Status__Enum as CallbackStatusEnum } from '__generated__/types';
import useFilter from 'hooks/useFilter';
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

  const {
    filters,
    handleSubmit,
    handleReset,
  } = useFilter<FormValues>();

  return (
    <Formik
      className="ClientCallbacksGridFilter"
      initialValues={filters}
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
            {Utils.enumToArray(CallbackStatusEnum).map(callbackStatus => (
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
