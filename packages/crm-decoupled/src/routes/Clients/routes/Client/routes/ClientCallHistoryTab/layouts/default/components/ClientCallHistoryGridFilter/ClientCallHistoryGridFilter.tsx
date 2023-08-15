import React from 'react';
import { startCase } from 'lodash';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { Utils } from '@crm/common';
import {
  Button,
  FormikMultipleSelectField,
  FormikSingleSelectField,
  RefreshButton,
  FormikInputField,
  FormikDateRangePicker,
} from 'components';
import { CallHistory__Status__Enum as CallHistoryStatusEnum } from '__generated__/types';
import useFilter from 'hooks/useFilter';
import useClientCallHistoryGridFilter
  from 'routes/Clients/routes/Client/routes/ClientCallHistoryTab/hooks/useClientCallHistoryGridFilter';
import { FormValues } from 'routes/Clients/routes/Client/routes/ClientCallHistoryTab/types/clientCallHistoryGridFilter';
import './ClientCallHistoryGridFilter.scss';

type Props = {
  onRefetch: () => void,
};

const ClientCallHistoryGridFilter = (props: Props) => {
  const { onRefetch } = props;

  const {
    clickToCallConfigQuery,
    CallSystems,
  } = useClientCallHistoryGridFilter();

  const {
    filters,
    handleSubmit,
    handleReset,
  } = useFilter<FormValues>();

  return (
    <Formik
      className="ClientCallHistoryGridFilter"
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
        <Form className="ClientCallHistoryGridFilter">
          <div className="ClientCallHistoryGridFilter__fields">
            <Field
              name="operatorUuid"
              className="ClientCallHistoryGridFilter__field ClientCallHistoryGridFilter__search"
              data-testid="ClientCallHistoryGridFilter-operatorUuidInput"
              label={I18n.t('CLIENT_PROFILE.CALL_HISTORY.GRID.FILTERS.SEARCH_BY')}
              placeholder={I18n.t('CLIENT_PROFILE.CALL_HISTORY.GRID.FILTERS.SEARCH_BY_PLACEHOLDER')}
              addition={<i className="icon icon-search" />}
              component={FormikInputField}
              withFocus
            />

            <Field
              searchable
              withFocus
              name="callSystems"
              disabled={clickToCallConfigQuery.loading}
              className="ClientCallHistoryGridFilter__field ClientCallHistoryGridFilter__select"
              data-testid="ClientCallHistoryGridFilter-callSystemsSelect"
              placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
              label={I18n.t('CLIENT_PROFILE.CALL_HISTORY.GRID.FILTERS.CALL_SYSTEM')}
              component={FormikMultipleSelectField}
              options={CallSystems.map((callSystem: string) => ({
                label: startCase(callSystem.toLowerCase()),
                value: callSystem,
              }))}
            />

            <Field
              withAnyOption
              name="callStatus"
              className="ClientCallHistoryGridFilter__field ClientCallHistoryGridFilter__select"
              data-testid="ClientCallHistoryGridFilter-callStatusSelect"
              component={FormikSingleSelectField}
              label={I18n.t('CLIENT_PROFILE.CALL_HISTORY.GRID.FILTERS.CALL_STATUS')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              disabled={isSubmitting}
              options={Utils.enumToArray(CallHistoryStatusEnum).map(callHistoryStatus => ({
                label: I18n.t(`CLIENT_PROFILE.CALL_HISTORY.STATUSES.${callHistoryStatus}`),
                value: callHistoryStatus,
              }))}
            />

            <Field
              className="ClientCallHistoryGridFilter__field ClientCallHistoryGridFilter__date-range"
              data-testid="ClientCallHistoryGridFilter-callDateRangePicker"
              label={I18n.t('CLIENT_PROFILE.CALL_HISTORY.GRID.FILTERS.DATE_RANGE')}
              component={FormikDateRangePicker}
              fieldsNames={{
                from: 'callDateRange.from',
                to: 'callDateRange.to',
              }}
              withFocus
            />
          </div>
          <div className="ClientCallHistoryGridFilter__buttons">
            <RefreshButton
              className="ClientCallHistoryGridFilter__button"
              data-testid="ClientCallHistoryGridFilter-refreshButton"
              onClick={onRefetch}
            />

            <Button
              className="ClientCallHistoryGridFilter__button"
              data-testid="ClientCallHistoryGridFilter-resetButton"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>

            <Button
              className="ClientCallHistoryGridFilter__button"
              data-testid="ClientCallHistoryGridFilter-applyButton"
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

export default React.memo(ClientCallHistoryGridFilter);
