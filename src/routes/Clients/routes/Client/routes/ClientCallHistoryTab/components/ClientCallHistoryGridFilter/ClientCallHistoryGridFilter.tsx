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
import './ClientCallHistoryGridFilter.scss';

type FormValues = {
  operatorUuid?: string,
  callStatus?: Array<CallHistoryStatusEnum>,
  callSystems?: Array<string>,
  callDateRange?: {
    from?: string,
    to?: string,
  },
};

type Props = {
  onRefetch: () => void,
};

const ClientCallHistoryGridFilter = (props: Props) => {
  const { onRefetch } = props;

  const { state } = useLocation<State<FormValues>>();

  const history = useHistory();

  // ===== Requests ===== //
  const clickToCallConfigQuery = useClickToCallConfigQuery();

  const CallSystems = (clickToCallConfigQuery?.data?.clickToCall.configs || []).map(config => config.callSystem);

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
      className="ClientCallHistoryGridFilter"
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
              name="callSystems"
              disabled={clickToCallConfigQuery.loading}
              className="ClientCallHistoryGridFilter__field ClientCallHistoryGridFilter__select"
              data-testid="ClientCallHistoryGridFilter-callSystemsSelect"
              placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
              label={I18n.t('CLIENT_PROFILE.CALL_HISTORY.GRID.FILTERS.CALL_SYSTEM')}
              component={FormikSelectField}
              searchable
              multiple
              withFocus
            >
              {CallSystems.map(callSystem => (
                <option key={callSystem} value={callSystem}>
                  {startCase(callSystem.toLowerCase())}
                </option>
              ))}
            </Field>

            <Field
              name="callStatus"
              className="ClientCallHistoryGridFilter__field ClientCallHistoryGridFilter__select"
              data-testid="ClientCallHistoryGridFilter-callStatusSelect"
              component={FormikSelectField}
              label={I18n.t('CLIENT_PROFILE.CALL_HISTORY.GRID.FILTERS.CALL_STATUS')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              disabled={isSubmitting}
              withAnyOption
            >
              {enumToArray(CallHistoryStatusEnum).map(callHistoryStatus => (
                <option key={callHistoryStatus} value={callHistoryStatus}>
                  {I18n.t(`CLIENT_PROFILE.CALL_HISTORY.STATUSES.${callHistoryStatus}`)}
                </option>
              ))}
            </Field>

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
