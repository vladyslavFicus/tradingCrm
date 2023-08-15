import React from 'react';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { Utils } from '@crm/common';
import {
  Button,
  FormikMultipleSelectField,
  RefreshButton,
  FormikInputField,
  FormikDateRangePicker,
} from 'components';
import { Callback__Status__Enum as CallbackStatusEnum } from '__generated__/types';
import useFilter from 'hooks/useFilter';
import TimeZoneField from 'components/TimeZoneField';
import { FormValues } from 'routes/Clients/routes/Callbacks/types';
import './ClientCallbacksGridFilter.scss';

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
        <Form className="ClientCallbacksGridFilter__form">
          <Field
            name="searchKeyword"
            className="ClientCallbacksGridFilter__field ClientCallbacksGridFilter__search"
            data-testid="ClientCallbacksGridFilter-searchKeywordInput"
            label={I18n.t('CALLBACKS.FILTER.SEARCH_BY')}
            placeholder={I18n.t('CALLBACKS.FILTER.SEARCH_BY_PLACEHOLDER_CLIENT')}
            addition={<i className="icon icon-search" />}
            component={FormikInputField}
            withFocus
          />

          <Field
            searchable
            withFocus
            name="statuses"
            className="ClientCallbacksGridFilter__field ClientCallbacksGridFilter__select"
            data-testid="ClientCallbacksGridFilter-statusesSelect"
            placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
            label={I18n.t('CALLBACKS.FILTER.STATUS')}
            component={FormikMultipleSelectField}
            options={Utils.enumToArray(CallbackStatusEnum).map(callbackStatus => ({
              label: I18n.t(`CONSTANTS.CALLBACKS.${callbackStatus}`),
              value: callbackStatus,
            }))}
          />

          <TimeZoneField
            className="ClientCallbacksGridFilter__field ClientCallbacksGridFilter__time-zone"
            data-testid="ClientCallbacksGridFilter-timeZone"
          />

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
