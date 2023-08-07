import React from 'react';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { Formik, Form, Field } from 'formik';
import { Button, RefreshButton } from 'components';
import useFilter from 'hooks/useFilter';
import { accountTypes } from 'constants/accountTypes';
import { statuses as operatorsStasuses } from 'constants/operators';
import { FormikInputField, FormikSelectField, FormikDateRangePicker } from 'components/Formik';
import { RangeGroup } from 'components/Forms';
import PlatformTypeBadge from 'components/PlatformTypeBadge';
import useTradingActivityGridFilter
  from 'routes/Clients/routes/Client/routes/ClientTradingActivityTab/hooks/useTradingActivityGridFilter';
import { FormValues }
  from 'routes/Clients/routes/Client/routes/ClientTradingActivityTab/types/tradingActivityGridFilter';
import {
  types,
  symbols,
  statuses,
} from 'routes/Clients/routes/Client/routes/ClientTradingActivityTab/constants';
import './TradingActivityGridFilter.scss';

type Props = {
  profileUUID: string,
  loading: boolean,
  onRefetch: () => void,
};

const TradingActivityGridFilter = (props: Props) => {
  const { profileUUID, loading, onRefetch } = props;

  const {
    tradeType,
    accounts,
    disabledOriginalAgentField,
    originalAgents,
    platformTypes,
    tradingAccountsLoading,
  } = useTradingActivityGridFilter({ profileUUID });

  const {
    filters,
    handleSubmit,
    handleReset,
  } = useFilter<FormValues>();

  return (
    <Formik
      enableReinitialize
      initialValues={{
        ...filters,
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
              data-testid="TradingActivityGridFilter-tradeIdInput"
              label={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.TRADE_LABEL')}
              placeholder={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.TRADE_PLACEHOLDER')}
              className="TradingActivityGridFilter__field TradingActivityGridFilter__field--large"
              component={FormikInputField}
              addition={<i className="icon icon-search" />}
              withFocus
            />

            <Field
              name="loginIds"
              data-testid="TradingActivityGridFilter-loginIdsSelect"
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
              data-testid="TradingActivityGridFilter-operationTypeSelect"
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
              data-testid="TradingActivityGridFilter-symbolSelect"
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
              data-testid="TradingActivityGridFilter-agentIdsSelect"
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
              data-testid="TradingActivityGridFilter-volumeRangeGroup"
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
                data-testid="TradingActivityGridFilter-volumeFromInput"
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
                data-testid="TradingActivityGridFilter-volumeToInput"
                withFocus
              />
            </RangeGroup>

            <Field
              name="status"
              data-testid="TradingActivityGridFilter-statusSelect"
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
              data-testid="TradingActivityGridFilter-tradeTypeSelect"
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
                data-testid="TradingActivityGridFilter-platformTypeSelect"
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
              data-testid="TradingActivityGridFilter-openTimeDateRangePicker"
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
              data-testid="TradingActivityGridFilter-closeTimeDateRangePicker"
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
              data-testid="TradingActivityGridFilter-refreshButton"
              onClick={onRefetch}
            />

            <Button
              className="TradingActivityGridFilter__button"
              data-testid="TradingActivityGridFilter-resetButton"
              onClick={() => handleReset(resetForm)}
              disabled={loading || (!dirty && (Object.keys(values).length === 1 && values.tradeType === 'LIVE'))}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>

            <Button
              className="TradingActivityGridFilter__button"
              data-testid="TradingActivityGridFilter-applyButton"
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
