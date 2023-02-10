import React from 'react';
import { startCase } from 'lodash';
import { useHistory, useLocation } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { State } from 'types';
import { ResetForm } from 'types/formik';
import enumToArray from 'utils/enumToArray';
import { FormikInputField, FormikSelectField, FormikDateRangePicker } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { Button, RefreshButton } from 'components/Buttons';
import { CallHistory__Status__Enum as CallHistoryStatusEnum } from '__generated__/types';
import { useClickToCallConfigQuery } from './graphql/__generated__/ClickToCallConfigQuery';
import './LeadCallHistoryGridFilter.scss';

type FormValues = {
  operatorUuid?: string,
  callStatus?: CallHistoryStatusEnum,
  callSystems?: Array<string>,
  callDateRange?: {
    from?: string,
    to?: string,
  },
};

type Props = {
  onRefetch: () => void,
};

const LeadCallHistoryGridFilter = (props: Props) => {
  const { onRefetch } = props;

  const { state } = useLocation<State<FormValues>>();

  const history = useHistory();

  // ===== Requests ===== //
  const clickToCallConfigQuery = useClickToCallConfigQuery();

  const callSystems = (clickToCallConfigQuery?.data?.clickToCall.configs || []).map(config => config.callSystem);

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
      className="LeadCallHistoryGridFilter"
      initialValues={state?.filters || {}}
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
              withFocus
            />

            <Field
              name="callSystems"
              disabled={clickToCallConfigQuery.loading}
              className="LeadCallHistoryGridFilter__field LeadCallHistoryGridFilter__select"
              placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
              label={I18n.t('LEAD_PROFILE.CALL_HISTORY.GRID.FILTERS.CALL_SYSTEM')}
              component={FormikSelectField}
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
              disabled={isSubmitting}
              withAnyOption
            >
              {enumToArray(CallHistoryStatusEnum).map(callHistoryStatus => (
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
              withFocus
            />
          </div>

          <div className="LeadCallHistoryGridFilter__buttons">
            <RefreshButton
              className="LeadCallHistoryGridFilter__button"
              onClick={onRefetch}
            />

            <Button
              className="LeadCallHistoryGridFilter__button"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>

            <Button
              className="LeadCallHistoryGridFilter__button"
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
