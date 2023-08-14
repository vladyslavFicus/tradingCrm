import React from 'react';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { Utils } from '@crm/common';
import { Button, RefreshButton } from 'components';
import { Callback__Status__Enum as CallbackStatusEnum } from '__generated__/types';
import { FormikInputField, FormikSelectField, FormikDateRangePicker } from 'components/Formik';
import useFilter from 'hooks/useFilter';
import TimeZoneField from 'components/TimeZoneField';
import { FormValues } from 'routes/Leads/routes/Callbacks/types/leadCallbacksGridFilter';
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
      enableReinitialize
      initialValues={filters}
      onSubmit={handleSubmit}
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
            placeholder={I18n.t('CALLBACKS.FILTER.SEARCH_BY_PLACEHOLDER_LEAD')}
            addition={<i className="icon icon-search" />}
            component={FormikInputField}
            withFocus
          />

          <Field
            name="statuses"
            className="LeadCallbacksGridFilter__field LeadCallbacksGridFilter__select"
            placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
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

          <TimeZoneField className="LeadCallbacksGridFilter__field LeadCallbacksGridFilter__time-zone" />

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
              onClick={onRefetch}
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
