import React from 'react';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { Button, RefreshButton } from 'components';
import { Callback__Status__Enum as CallbackStatusEnum } from '__generated__/types';
import enumToArray from 'utils/enumToArray';
import useFilter from 'hooks/useFilter';
import { FormikInputField, FormikSelectField, FormikDateRangePicker } from 'components/Formik';
import { FormValues } from 'routes/Leads/routes/Lead/types/leadCallbacksGridFilter';
import './LeadCallbacksGridFilter.scss';

type Props = {
  onRefetch: () => void,
};

const LeadCallbacksGridFilter = (props: Props) => {
  const { onRefetch } = props;

  // ===== Hooks ===== //
  const {
    filters,
    handleSubmit,
    handleReset,
  } = useFilter<FormValues>();

  return (
    <Formik
      className="LeadCallbacksGridFilter"
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
        <Form className="LeadCallbacksGridFilter__form">
          <Field
            name="searchKeyword"
            className="LeadCallbacksGridFilter__field LeadCallbacksGridFilter__search"
            data-testid="LeadCallbacksGridFilter-searchKeywordInput"
            label={I18n.t('CALLBACKS.FILTER.SEARCH_BY')}
            placeholder={I18n.t('CALLBACKS.FILTER.CALLBACK_OR_OPERATOR')}
            addition={<i className="icon icon-search" />}
            component={FormikInputField}
            withFocus
          />

          <Field
            name="statuses"
            className="LeadCallbacksGridFilter__field LeadCallbacksGridFilter__select"
            data-testid="LeadCallbacksGridFilter-statusesSelect"
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
            className="LeadCallbacksGridFilter__field LeadCallbacksGridFilter__date-range"
            data-testid="LeadCallbacksGridFilter-callbackTimeDateRangePicker"
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
              data-testid="LeadCallbacksGridFilter-refreshButton"
              onClick={onRefetch}
            />

            <Button
              className="LeadCallbacksGridFilter__button"
              data-testid="LeadCallbacksGridFilter-resetButton"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>

            <Button
              className="LeadCallbacksGridFilter__button"
              data-testid="LeadCallbacksGridFilter-applyButton"
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
