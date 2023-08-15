import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import classNames from 'classnames';
import { Config, Utils, Constants } from '@crm/common';
import {
  Button,
  RefreshButton,
  FormikSingleSelectField,
  FormikMultipleSelectField,
  FormikInputField,
  FormikDateRangePicker,
} from 'components';
import { DistributionRule__Statuses__Enum as DistributionRuleStatusesEnum } from '__generated__/types';
import useFilter from 'hooks/useFilter';
import { FiltersToggler } from 'components/FiltersToggler';
import useDistributionRulesGridFilters from 'routes/DistributionRules/hooks/useDistributionRulesGridFilters';
import { RulesFormValues } from 'routes/DistributionRules/types';
import { firstTimeDepositFilter } from './constants';
import './DistributionRulesGridFilters.scss';

type Props = {
  onRefetch: () => void,
};

const DistributionRulesGridFilters = (props: Props) => {
  const { onRefetch } = props;

  // ===== Hooks ===== //
  const {
    loading,
    partners,
  } = useDistributionRulesGridFilters();

  const {
    filters,
    handleSubmit,
    handleReset,
  } = useFilter<RulesFormValues>();

  return (
    <FiltersToggler>
      <Formik
        initialValues={filters}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, values, resetForm, dirty }) => (
          <Form className="DistributionRulesGridFilters__form">
            <div className="DistributionRulesGridFilters__fields">
              <Field
                name="searchParam"
                className="DistributionRulesGridFilters__field DistributionRulesGridFilters__search"
                data-testid="DistributionRulesGridFilters-searchParamInput"
                placeholder={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.SEARCH_BY_PLACEHOLDER')}
                label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.SEARCH_BY')}
                component={FormikInputField}
                withFocus
              />

              <Field
                withAnyOption
                withFocus
                name="ruleStatus"
                className="DistributionRulesGridFilters__field DistributionRulesGridFilters__select"
                data-testid="DistributionRulesGridFilters-ruleStatusSelect"
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.RULE_STATUS')}
                component={FormikSingleSelectField}
                options={Utils.enumToArray(DistributionRuleStatusesEnum).map(status => ({
                  label: I18n.t(Constants.clientDistributionStatusesLabels[status]),
                  value: status,
                }))}
              />

              <Field
                name="fromBrand"
                className="DistributionRulesGridFilters__field DistributionRulesGridFilters__select"
                data-testid="DistributionRulesGridFilters-fromBrandInput"
                placeholder={I18n.t('COMMON.NAME')}
                label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.SOURCE_BRAND')}
                component={FormikInputField}
                withFocus
              />

              <Field
                name="toBrand"
                className="DistributionRulesGridFilters__field DistributionRulesGridFilters__select"
                data-testid="DistributionRulesGridFilters-toBrandInput"
                placeholder={I18n.t('COMMON.NAME')}
                label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.TARGET_BRAND')}
                component={FormikInputField}
                withFocus
              />

              <Field
                searchable
                withFocus
                name="salesStatuses"
                className="DistributionRulesGridFilters__field DistributionRulesGridFilters__select"
                data-testid="DistributionRulesGridFilters-salesStatusesSelect"
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.SALES_STATUS')}
                component={FormikMultipleSelectField}
                options={Object.keys(Constants.salesStatuses).map(value => ({
                  label: I18n.t(Utils.renderLabel(value, Constants.salesStatuses)),
                  value,
                }))}
              />

              <Field
                withAnyOption
                searchable
                withFocus
                name="affiliateUuids"
                className="DistributionRulesGridFilters__field DistributionRulesGridFilters__select"
                data-testid="DistributionRulesGridFilters-affiliateUuidsSelect"
                label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.AFFILIATE')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikMultipleSelectField}
                disabled={loading}
                options={partners.map(({ uuid, fullName, status }) => ({
                  label: fullName,
                  value: uuid,
                  className: classNames('DistributionRulesGridFilters__select-option', {
                    'DistributionRulesGridFilters__select-option--inactive':
                      ['INACTIVE', 'CLOSED'].includes(status),
                  }),
                }))}
              />

              <Field
                searchable
                name="languages"
                className="DistributionRulesGridFilters__field DistributionRulesGridFilters__select"
                data-testid="DistributionRulesGridFilters-languagesSelect"
                label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.LANGUAGES')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikMultipleSelectField}
                options={Config.getAvailableLanguages().map(locale => ({
                  label: I18n.t(`COMMON.LANGUAGE_NAME.${locale.toUpperCase()}`, { defaultValue: locale.toUpperCase() }),
                  value: locale,
                }))}
              />

              <Field
                searchable
                withFocus
                name="countries"
                className="DistributionRulesGridFilters__field DistributionRulesGridFilters__select"
                data-testid="DistributionRulesGridFilters-countriesSelect"
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.COUNTRY')}
                component={FormikMultipleSelectField}
                options={Object.keys(Utils.countryList).map(country => ({
                  label: Utils.countryList[country],
                  value: country,
                }))}
              />

              <Field
                withAnyOption
                name="firstTimeDeposit"
                className="DistributionRulesGridFilters__field DistributionRulesGridFilters__select"
                data-testid="DistributionRulesGridFilters-firstTimeDepositSelect"
                label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.FIRST_TIME_DEPOSIT')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSingleSelectField}
                options={firstTimeDepositFilter.map(({ value, label }) => ({
                  label: I18n.t(label),
                  value,
                }))}
              />

              <Field
                className="DistributionRulesGridFilters__field DistributionRulesGridFilters__date-range"
                data-testid="DistributionRulesGridFilters-createdDateRangePicker"
                label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.CREATED_TIME')}
                component={FormikDateRangePicker}
                fieldsNames={{
                  from: 'createdDateFrom',
                  to: 'createdDateTo',
                }}
                withFocus
              />

              <Field
                searchable
                withFocus
                name="timesInCurrentStatusInHours"
                className="DistributionRulesGridFilters__field DistributionRulesGridFilters__select"
                data-testid="DistributionRulesGridFilters-timesInCurrentStatusInHoursSelect"
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.TIME_IN_STATUS')}
                component={FormikMultipleSelectField}
                options={Constants.timeInCurrentStatusInHours.map(({ label, value, i18nValue }) => ({
                  label: I18n.t(label, { value: i18nValue }),
                  value,
                }))}
              />

              <Field
                className="DistributionRulesGridFilters__field DistributionRulesGridFilters__date-range"
                data-testid="DistributionRulesGridFilters-lastTimeExecutedDateRangePicker"
                label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.LAST_TIME_EXECUTED')}
                component={FormikDateRangePicker}
                fieldsNames={{
                  from: 'lastTimeExecutedFrom',
                  to: 'lastTimeExecutedTo',
                }}
                withFocus
              />
            </div>

            <div className="DistributionRulesGridFilters__buttons">
              <RefreshButton
                className="DistributionRulesGridFilters__button"
                data-testid="DistributionRulesGridFilters-refreshButton"
                onClick={onRefetch}
              />

              <Button
                className="DistributionRulesGridFilters__button"
                data-testid="DistributionRulesGridFilters-resetButton"
                disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
                onClick={() => handleReset(resetForm)}
                primary
              >
                {I18n.t('COMMON.RESET')}
              </Button>

              <Button
                className="DistributionRulesGridFilters__button"
                data-testid="DistributionRulesGridFilters-applyButton"
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
    </FiltersToggler>
  );
};

export default React.memo(DistributionRulesGridFilters);
