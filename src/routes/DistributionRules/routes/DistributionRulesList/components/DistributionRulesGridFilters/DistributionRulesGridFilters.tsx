import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import classNames from 'classnames';
import { getAvailableLanguages } from 'config';
import { State } from 'types';
import { DistributionRule__Statuses__Enum as DistributionRuleStatusesEnum } from '__generated__/types';
import { ResetForm } from 'types/formik';
import { salesStatuses } from 'constants/salesStatuses';
import { statusesLabels, timeInCurrentStatusInHours } from 'constants/clientsDistribution';
import countryList from 'utils/countryList';
import renderLabel from 'utils/renderLabel';
import FiltersToggler from 'components/FiltersToggler';
import { Button, RefreshButton } from 'components/Buttons';
import { FormikInputField, FormikSelectField, FormikDateRangePicker } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import enumToArray from 'utils/enumToArray';
import { DistributionRulesQueryVariables } from '../../graphql/__generated__/DistributionRulesQuery';
import { firstTimeDepositFilter, PARTNERS_SORT } from './constants';
import { usePartnersQuery } from './graphql/__generated__/PartnersQuery';
import './DistributionRulesGridFilters.scss';

type FormValues = {
  searchParam?: string,
  ruleStatus?: string,
  fromBrand?: string,
  toBrand?: string,
  salesStatuses?: Array<string>,
  affiliateUuids?: Array<string>,
  languages?: Array<string>,
  countries?: Array<string>,
  firstTimeDeposit?: boolean,
  createdDateFrom?: string,
  createdDateTo?: string,
  timesInCurrentStatusInHours?: Array<number>,
  lastTimeExecutedFrom?: string,
  lastTimeExecutedTo?: string,
};

type Props = {
  onRefetch: () => void,
};

const DistributionRulesGridFilters = (props: Props) => {
  const { onRefetch } = props;

  const partnersQuery = usePartnersQuery({ variables: { page: { sorts: PARTNERS_SORT } } });

  const partners = partnersQuery.data?.partners?.content || [];

  const { state } = useLocation<State<DistributionRulesQueryVariables>>();

  const history = useHistory();

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
    <FiltersToggler>
      <Formik
        initialValues={state?.filters as FormValues || {}}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, values, resetForm, dirty }) => (
          <Form className="DistributionRulesGridFilters__form">
            <div className="DistributionRulesGridFilters__fields">
              <Field
                name="searchParam"
                className="DistributionRulesGridFilters__field DistributionRulesGridFilters__search"
                placeholder={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.SEARCH_BY_PLACEHOLDER')}
                label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.SEARCH_BY')}
                component={FormikInputField}
                withFocus
              />

              <Field
                name="ruleStatus"
                className="DistributionRulesGridFilters__field DistributionRulesGridFilters__select"
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.RULE_STATUS')}
                component={FormikSelectField}
                withAnyOption
                withFocus
              >
                {enumToArray(DistributionRuleStatusesEnum).map(status => (
                  <option key={status} value={status}>
                    {I18n.t(statusesLabels[status])}
                  </option>
                ))}
              </Field>

              <Field
                name="fromBrand"
                className="DistributionRulesGridFilters__field DistributionRulesGridFilters__select"
                placeholder={I18n.t('COMMON.NAME')}
                label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.SOURCE_BRAND')}
                component={FormikInputField}
                withFocus
              />

              <Field
                name="toBrand"
                className="DistributionRulesGridFilters__field DistributionRulesGridFilters__select"
                placeholder={I18n.t('COMMON.NAME')}
                label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.TARGET_BRAND')}
                component={FormikInputField}
                withFocus
              />

              <Field
                name="salesStatuses"
                className="DistributionRulesGridFilters__field DistributionRulesGridFilters__select"
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.SALES_STATUS')}
                component={FormikSelectField}
                searchable
                withFocus
                multiple
              >
                {Object.keys(salesStatuses).map(value => (
                  <option key={value} value={value}>
                    {I18n.t(renderLabel(value, salesStatuses))}
                  </option>
                ))}
              </Field>

              <Field
                name="affiliateUuids"
                className="DistributionRulesGridFilters__field DistributionRulesGridFilters__select"
                label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.AFFILIATE')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSelectField}
                disabled={partnersQuery.loading}
                withAnyOption
                searchable
                withFocus
                multiple
              >
                {partners.map(({ uuid, fullName, status }) => (
                  <option
                    key={uuid}
                    value={uuid}
                    className={
                      classNames('DistributionRulesGridFilters__select-option', {
                        'DistributionRulesGridFilters__select-option--inactive':
                          ['INACTIVE', 'CLOSED'].includes(status),
                      })
                    }
                  >
                    {fullName}
                  </option>
                ))}
              </Field>

              <Field
                name="languages"
                className="DistributionRulesGridFilters__field DistributionRulesGridFilters__select"
                label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.LANGUAGES')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSelectField}
                searchable
                multiple
              >
                {getAvailableLanguages().map(locale => (
                  <option key={locale} value={locale}>
                    {I18n.t(`COMMON.LANGUAGE_NAME.${locale.toUpperCase()}`, { defaultValue: locale.toUpperCase() })}
                  </option>
                ))}
              </Field>

              <Field
                name="countries"
                className="DistributionRulesGridFilters__field DistributionRulesGridFilters__select"
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.COUNTRY')}
                component={FormikSelectField}
                searchable
                withFocus
                multiple
              >
                {Object.keys(countryList).map(country => (
                  <option key={country} value={country}>{countryList[country]}</option>
                ))}
              </Field>

              <Field
                name="firstTimeDeposit"
                className="DistributionRulesGridFilters__field DistributionRulesGridFilters__select"
                label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.FIRST_TIME_DEPOSIT')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSelectField}
                withAnyOption
              >
                {firstTimeDepositFilter.map(({ value, label }) => (
                  // @ts-ignore because in tsx file Field can't set BOOLEAN to option value
                  <option key={`firstTimeDeposit-${value}`} value={value}>
                    {I18n.t(label)}
                  </option>
                ))}
              </Field>

              <Field
                className="DistributionRulesGridFilters__field DistributionRulesGridFilters__date-range"
                label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.CREATED_TIME')}
                component={FormikDateRangePicker}
                fieldsNames={{
                  from: 'createdDateFrom',
                  to: 'createdDateTo',
                }}
                withFocus
              />

              <Field
                name="timesInCurrentStatusInHours"
                className="DistributionRulesGridFilters__field DistributionRulesGridFilters__select"
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.TIME_IN_STATUS')}
                component={FormikSelectField}
                searchable
                withFocus
                multiple
              >
                {timeInCurrentStatusInHours.map(({ label, value, i18nValue }) => (
                  <option key={value} value={value}>
                    {I18n.t(label, { value: i18nValue })}
                  </option>
                ))}
              </Field>

              <Field
                className="DistributionRulesGridFilters__field DistributionRulesGridFilters__date-range"
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
                onClick={onRefetch}
              />

              <Button
                className="DistributionRulesGridFilters__button"
                disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
                onClick={() => handleReset(resetForm)}
                primary
              >
                {I18n.t('COMMON.RESET')}
              </Button>

              <Button
                className="DistributionRulesGridFilters__button"
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
