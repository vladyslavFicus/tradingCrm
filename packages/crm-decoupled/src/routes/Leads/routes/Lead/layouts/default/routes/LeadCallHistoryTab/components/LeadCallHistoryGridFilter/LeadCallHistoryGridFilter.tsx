import React from 'react';
import { startCase } from 'lodash';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { Utils } from '@crm/common';
import { Button, RefreshButton } from 'components';
import { CallHistory__Status__Enum as CallHistoryStatusEnum } from '__generated__/types';
import { FormikInputField, FormikSelectField, FormikDateRangePicker } from 'components/Formik';
import useFilter from 'hooks/useFilter';
import useLeadCallHistoryGridFilter from 'routes/Leads/routes/Lead/hooks/useLeadCallHistoryGridFilter';
import { FormValues } from 'routes/Leads/routes/Lead/types/leadCallHistoryGridFilter';
import './LeadCallHistoryGridFilter.scss';

type Props = {
  onRefetch: () => void,
};

const LeadCallHistoryGridFilter = (props: Props) => {
  const { onRefetch } = props;

  // ===== Hooks ===== //
  const {
    loading,
    callSystems,
  } = useLeadCallHistoryGridFilter();

  const {
    filters,
    handleSubmit,
    handleReset,
  } = useFilter<FormValues>();

  return (
    <Formik
      className="LeadCallHistoryGridFilter"
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
        <Form className="LeadCallHistoryGridFilter">
          <div className="LeadCallHistoryGridFilter__fields">
            <Field
              name="operatorUuid"
              className="LeadCallHistoryGridFilter__field LeadCallHistoryGridFilter__search"
              label={I18n.t('LEAD_PROFILE.CALL_HISTORY.GRID.FILTERS.SEARCH_BY')}
              placeholder={I18n.t('LEAD_PROFILE.CALL_HISTORY.GRID.FILTERS.SEARCH_BY_PLACEHOLDER')}
              addition={<i className="icon icon-search" />}
              component={FormikInputField}
              data-testid="LeadCallHistoryGridFilter-operatorUuidInput"
              withFocus
            />

            <Field
              name="callSystems"
              disabled={loading}
              className="LeadCallHistoryGridFilter__field LeadCallHistoryGridFilter__select"
              placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
              label={I18n.t('LEAD_PROFILE.CALL_HISTORY.GRID.FILTERS.CALL_SYSTEM')}
              component={FormikSelectField}
              data-testid="LeadCallHistoryGridFilter-callSystemsSelect"
              searchable
              multiple
              withFocus
            >
              {callSystems.map(callSystem => (
                <option key={callSystem} value={callSystem}>
                  {startCase(callSystem.toLowerCase())}
                </option>
              ))}
            </Field>

            <Field
              name="callStatus"
              className="LeadCallHistoryGridFilter__field LeadCallHistoryGridFilter__select"
              component={FormikSelectField}
              label={I18n.t('LEAD_PROFILE.CALL_HISTORY.GRID.FILTERS.CALL_STATUS')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              data-testid="LeadCallHistoryGridFilter-callStatusSelect"
              disabled={isSubmitting}
              withAnyOption
            >
              {Utils.enumToArray(CallHistoryStatusEnum).map(callHistoryStatus => (
                <option key={callHistoryStatus} value={callHistoryStatus}>
                  {I18n.t(`LEAD_PROFILE.CALL_HISTORY.STATUSES.${callHistoryStatus}`)}
                </option>
              ))}
            </Field>

            <Field
              className="LeadCallHistoryGridFilter__field LeadCallHistoryGridFilter__date-range"
              label={I18n.t('LEAD_PROFILE.CALL_HISTORY.GRID.FILTERS.DATE_RANGE')}
              component={FormikDateRangePicker}
              fieldsNames={{
                from: 'callDateRange.from',
                to: 'callDateRange.to',
              }}
              data-testid="LeadCallHistoryGridFilter-callDateRangePicker"
              withFocus
            />
          </div>

          <div className="LeadCallHistoryGridFilter__buttons">
            <RefreshButton
              className="LeadCallHistoryGridFilter__button"
              data-testid="LeadCallHistoryGridFilter-refreshButton"
              onClick={onRefetch}
            />

            <Button
              className="LeadCallHistoryGridFilter__button"
              data-testid="LeadCallHistoryGridFilter-resetButton"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>

            <Button
              className="LeadCallHistoryGridFilter__button"
              data-testid="LeadCallHistoryGridFilter-submitButton"
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

export default React.memo(LeadCallHistoryGridFilter);
