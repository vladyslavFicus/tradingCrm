import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { Formik, Form, Field } from 'formik';
import { State } from 'types';
import { ResetForm } from 'types/formik';
import { accountTypes } from 'constants/accountTypes';
import { statuses as operatorsStasuses } from 'constants/operators';
import { FormikInputField, FormikSelectField, FormikDateRangePicker } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { RangeGroup } from 'components/Forms';
import { Button, RefreshButton } from 'components/Buttons';
import PlatformTypeBadge from 'components/PlatformTypeBadge';
import { getAvailablePlatformTypes } from 'utils/tradingAccount';
import { types, symbols, statuses } from '../../attributes/constants';
import { TradingActivityQueryVariables } from '../../graphql/__generated__/TradingActivityQuery';
import { OPERATORS_SORT } from './constants';
import { useOperatorsQuery } from './graphql/__generated__/OperatorsQuery';
import { useTradingAccountsQuery } from './graphql/__generated__/TradingAccountsQuery';
import './TradingActivityGridFilter.scss';

type FormValues = {
  tradeId: number,
  loginIds: Array<number>,
  operationType: string,
  symbol: string,
  agentIds: string,
  volumeFrom: number,
  volumeTo: number,
  status: string,
  tradeType: string,
  platformType: string,
};

type Props = {
  profileUUID: string,
  loading: boolean,
  onRefetch: () => void,
};

const TradingActivityGridFilter = (props: Props) => {
  const { profileUUID, loading, onRefetch } = props;

  const { state } = useLocation<State<TradingActivityQueryVariables>>();

  const history = useHistory();

  // ===== Requests ===== //
  const { data: operatorsData, loading: operatorsLoading } = useOperatorsQuery({
    variables: { page: { sorts: OPERATORS_SORT } },
  });

  const { data: tradingAccountsData, loading: tradingAccountsLoading } = useTradingAccountsQuery({
    variables: { profileUUID },
  });

  const accounts = tradingAccountsData?.clientTradingAccounts || [];
  const originalAgents = operatorsData?.operators?.content || [];
  const disabledOriginalAgentField = operatorsLoading;

  const platformTypes = getAvailablePlatformTypes();

  // ===== Handlers ===== //
  const handleSubmit = (values: FormValues) => {
    history.replace({
      state: {
        ...state,
        filters: {
          ...decodeNullValues(values),
          tradeType: values.tradeType || null,
        },
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

  const tradeType = state?.filters && ('tradeType' in state.filters) ? state.filters.tradeType : 'LIVE';

  return (
    <Formik
      enableReinitialize
      initialValues={{
        ...state?.filters,
        tradeType,
      } as FormValues}
      onSubmit={handleSubmit}
    >
      {({ values, dirty, resetForm }) => (
        <Form className="TradingActivityGridFilter">
          <div className="TradingActivityGridFilter__fields">
            <Field
              name="tradeId"
              type="number"
              label={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.TRADE_LABEL')}
              placeholder={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.TRADE_PLACEHOLDER')}
              className="TradingActivityGridFilter__field TradingActivityGridFilter__field--large"
              component={FormikInputField}
              addition={<i className="icon icon-search" />}
              withFocus
            />

            <Field
              name="loginIds"
              label={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.LOGIN_IDS')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ALL')}
              className="TradingActivityGridFilter__field"
              component={FormikSelectField}
              disabled={accounts.length === 0}
              withFocus
              multiple
            >
              {accounts.map(({ login, platformType }) => (
                <option key={login} value={login}>
                  <PlatformTypeBadge platformType={platformType} center>
                    {login}
                  </PlatformTypeBadge>
                </option>
              ))}
            </Field>

            <Field
              name="operationType"
              label={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.TYPE_LABEL')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              className="TradingActivityGridFilter__field"
              component={FormikSelectField}
              withAnyOption
              searchable
              withFocus
            >
              {types.map(({ value, label }) => (
                <option key={value} value={value}>
                  {I18n.t(label)}
                </option>
              ))}
            </Field>

            <Field
              name="symbol"
              label={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOL_LABEL')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              className="TradingActivityGridFilter__field"
              component={FormikSelectField}
              withAnyOption
              searchable
              withFocus
            >
              {symbols.map(({ value, label }) => (
                <option key={value} value={value}>
                  {I18n.t(label)}
                </option>
              ))}
            </Field>

            <Field
              name="agentIds"
              label={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.ORIGINAL_AGENT_LABEL')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              className="TradingActivityGridFilter__field"
              component={FormikSelectField}
              disabled={disabledOriginalAgentField}
              searchable
              withFocus
              multiple
            >
              {originalAgents.map(({ fullName, uuid, operatorStatus }) => (
                <option
                  key={uuid}
                  value={uuid}
                  className={classNames({
                    'TradingActivityGridFilter__field-inactive-option': operatorStatus !== operatorsStasuses.ACTIVE,
                  })}
                >
                  {fullName}
                </option>
              ))}
            </Field>

            <RangeGroup
              className="TradingActivityGridFilter__field"
              label={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.VOLUME_LABEL')}
            >
              <Field
                name="volumeFrom"
                type="number"
                step="0.01"
                min={0}
                placeholder="0"
                component={FormikInputField}
                className="TradingActivityGridFilter__field"
                withFocus
              />
              <Field
                name="volumeTo"
                type="number"
                step="0.01"
                min={0}
                placeholder="0"
                component={FormikInputField}
                className="TradingActivityGridFilter__field"
                withFocus
              />
            </RangeGroup>

            <Field
              name="status"
              label={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.STATUS_LABEL')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              className="TradingActivityGridFilter__field"
              component={FormikSelectField}
              withAnyOption
              withFocus
            >
              {Object.keys(statuses).map(status => (
                <option key={status} value={status}>
                  {I18n.t(`CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.STATUSES.${status}`)}
                </option>
              ))}
            </Field>
            <Field
              name="tradeType"
              label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.ACCOUNT_TYPE')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              className="TradingActivityGridFilter__field"
              component={FormikSelectField}
              withAnyOption
              withFocus
            >
              {accountTypes.map(({ value, label }) => (
                <option key={value} value={value}>
                  {I18n.t(label)}
                </option>
              ))}
            </Field>

            <If condition={platformTypes.length > 1}>
              <Field
                name="platformType"
                label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.PLATFORM_TYPE')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                className="TradingActivityGridFilter__field"
                component={FormikSelectField}
                withAnyOption
                withFocus
              >
                {platformTypes.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Field>
            </If>

            <Field
              className="TradingActivityGridFilter__field TradingActivityGridFilter__field--large"
              label={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.OPEN_TIME_RANGE_LABEL')}
              component={FormikDateRangePicker}
              fieldsNames={{
                from: 'openTimeStart',
                to: 'openTimeEnd',
              }}
              withFocus
            />
            <Field
              className="TradingActivityGridFilter__field TradingActivityGridFilter__field--large"
              label={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.CLOSE_TIME_RANGE_LABEL')}
              component={FormikDateRangePicker}
              fieldsNames={{
                from: 'closeTimeStart',
                to: 'closeTimeEnd',
              }}
              withFocus
            />
          </div>

          <div className="TradingActivityGridFilter__buttons">
            <RefreshButton
              className="TradingActivityGridFilter__button"
              onClick={onRefetch}
            />

            <Button
              className="TradingActivityGridFilter__button"
              onClick={() => handleReset(resetForm)}
              disabled={loading || (!dirty && (Object.keys(values).length === 1 && values.tradeType === 'LIVE'))}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>

            <Button
              className="TradingActivityGridFilter__button"
              type="submit"
              disabled={loading || !dirty || tradingAccountsLoading}
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

export default React.memo(TradingActivityGridFilter);