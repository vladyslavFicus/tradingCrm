import React from 'react';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Config, Utils } from '@crm/common';
import { Button, RefreshButton } from 'components';
import useFilter from 'hooks/useFilter';
import { FormikInputField, FormikSelectField, FormikDateRangePicker } from 'components/Formik';
import TimeZoneField from 'components/TimeZoneField';
import {
  attributeLabels,
  leadAccountStatuses,
  maxSearchLimit,
  neverCalledTypes,
} from 'routes/Leads/routes/LeadsList/constants/leadsGridFilter';
import useLeadsGridFilter from 'routes/Leads/routes/LeadsList/hooks/useLeadsGridFilter';
import { FormValues } from 'routes/Leads/routes/LeadsList/types/leadsGridFilter';
import { statuses as operatorsStasuses } from 'constants/operators';
import { salesStatuses as staticSalesStatuses } from 'constants/salesStatuses';
import './LeadsGridFilter.scss';

type Props = {
  onRefetch: () => void,
};

const LeadsGridFilter = (props:Props) => {
  const { onRefetch } = props;

  // ===== Hooks ===== //
  const {
    desksAndTeamsData,
    isDesksAndTeamsLoading,
    isAcquisitionStatusesLoading,
    isOperatorsLoading,
    filterOperators,
    salesStatuses,
  } = useLeadsGridFilter();

  const {
    filters,
    handleSubmit,
    handleReset,
  } = useFilter<FormValues>();

  return (
    <Formik
      enableReinitialize
      initialValues={filters}
      onSubmit={handleSubmit}
      validate={Utils.createValidator({
        searchLimit: ['numeric', 'greater:0', `max:${maxSearchLimit}`],
      }, Utils.translateLabels(attributeLabels))}
    >
      {({
        isSubmitting,
        values,
        resetForm,
        dirty,
      }) => {
        const desksUuids = values.desks || [];
        const desks = desksAndTeamsData?.userBranches?.DESK || [];

        const teams = desksAndTeamsData?.userBranches?.TEAM || [];
        const teamsByDesks = teams.filter(team => desksUuids.includes(team?.parentBranch?.uuid as string));
        const teamsOptions = desksUuids.length ? teamsByDesks : teams;

        const operatorsOptions = filterOperators(values);
        const languagesOptions = ['other', ...Config.getAvailableLanguages()];

        return (
          <Form className="LeadsGridFilter__form">
            <div className="LeadsGridFilter__fields">
              <Field
                name="searchKeyword"
                className="LeadsGridFilter__field LeadsGridFilter__search"
                label={I18n.t(attributeLabels.searchKeyword)}
                placeholder={I18n.t('COMMON.SEARCH_BY.LEAD')}
                addition={<i className="icon icon-search" />}
                component={FormikInputField}
                data-testid="LeadsGridFilter-searchKeywordInput"
                withFocus
              />

              <Field
                name="languages"
                className="LeadsGridFilter__field LeadsGridFilter__select"
                label={I18n.t(attributeLabels.languages)}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSelectField}
                data-testid="LeadsGridFilter-languagesSelect"
                searchable
                withFocus
                multiple
              >
                {languagesOptions.map(locale => (
                  <option key={locale} value={locale}>
                    {I18n.t(`COMMON.LANGUAGE_NAME.${locale.toUpperCase()}`, { defaultValue: locale.toUpperCase() })}
                  </option>
                ))}
              </Field>

              <Field
                name="countries"
                className="LeadsGridFilter__field LeadsGridFilter__select"
                label={I18n.t(attributeLabels.countries)}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSelectField}
                data-testid="LeadsGridFilter-countriesSelect"
                searchable
                withFocus
                multiple
              >
                {[
                  <option key="UNDEFINED" value="UNDEFINED">{I18n.t('COMMON.OTHER')}</option>,
                  ...Object.keys(Utils.countryList)
                    .map(country => (
                      <option key={country} value={country}>{Utils.countryList[country]}</option>
                    )),
                ]}
              </Field>

              <Field
                name="desks"
                className="LeadsGridFilter__field LeadsGridFilter__select"
                label={I18n.t(attributeLabels.desks)}
                placeholder={
                    I18n.t(
                      (!isDesksAndTeamsLoading && desks.length === 0)
                        ? 'COMMON.SELECT_OPTION.NO_ITEMS'
                        : 'COMMON.SELECT_OPTION.DEFAULT',
                    )
                  }
                component={FormikSelectField}
                disabled={isDesksAndTeamsLoading || desks.length === 0}
                data-testid="LeadsGridFilter-desksSelect"
                searchable
                withFocus
                multiple
              >
                {desks.map(({ uuid, name }) => (
                  <option key={uuid} value={uuid}>
                    {I18n.t(name)}
                  </option>
                ))}
              </Field>

              <Field
                name="teams"
                className="LeadsGridFilter__field LeadsGridFilter__select"
                label={I18n.t(attributeLabels.teams)}
                placeholder={
                    I18n.t(
                      (!isDesksAndTeamsLoading && teamsOptions.length === 0)
                        ? 'COMMON.SELECT_OPTION.NO_ITEMS'
                        : 'COMMON.SELECT_OPTION.DEFAULT',
                    )
                  }
                component={FormikSelectField}
                disabled={isDesksAndTeamsLoading || teamsOptions.length === 0}
                data-testid="LeadsGridFilter-teamsSelect"
                searchable
                withFocus
                multiple
              >
                {teamsOptions.map(({ uuid, name }) => (
                  <option key={uuid} value={uuid}>
                    {I18n.t(name)}
                  </option>
                ))}
              </Field>

              <Field
                name="salesAgents"
                className="LeadsGridFilter__field LeadsGridFilter__select"
                label={I18n.t(attributeLabels.salesAgents)}
                placeholder={
                    I18n.t(
                      (!isOperatorsLoading && operatorsOptions.length === 0)
                        ? 'COMMON.SELECT_OPTION.NO_ITEMS'
                        : 'COMMON.SELECT_OPTION.DEFAULT',
                    )
                  }
                component={FormikSelectField}
                disabled={isOperatorsLoading || operatorsOptions.length === 0}
                data-testid="LeadsGridFilter-salesAgentsSelect"
                searchable
                withFocus
                multiple
              >
                {operatorsOptions.map(({ uuid, fullName, operatorStatus }) => (
                  <option
                    key={uuid}
                    value={uuid}
                    className={classNames('LeadsGridFilter__select-option', {
                      'LeadsGridFilter__select-option--inactive': operatorStatus === operatorsStasuses.INACTIVE
                          || operatorStatus === operatorsStasuses.CLOSED,
                    })}
                  >
                    {fullName}
                  </option>
                ))}
              </Field>

              <Field
                name="salesStatuses"
                className="LeadsGridFilter__field LeadsGridFilter__select"
                label={I18n.t(attributeLabels.salesStatuses)}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSelectField}
                disabled={isAcquisitionStatusesLoading}
                data-testid="LeadsGridFilter-salesStatusesSelect"
                searchable
                withFocus
                multiple
              >
                {salesStatuses.map(({ status }) => (
                  <option key={status} value={status}>
                    {I18n.t(staticSalesStatuses[status])}
                  </option>
                ))}
              </Field>

              <Field
                name="status"
                className="LeadsGridFilter__field LeadsGridFilter__select"
                label={I18n.t(attributeLabels.status)}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSelectField}
                data-testid="LeadsGridFilter-statusSelect"
                withAnyOption
                searchable
                withFocus
              >
                {Object.values(leadAccountStatuses)
                  .map(({ label, value }) => (
                    <option key={value} value={value}>
                      {I18n.t(label)}
                    </option>
                  ))}
              </Field>

              <Field
                name="isNeverCalled"
                className="LeadsGridFilter__field LeadsGridFilter__select"
                label={I18n.t(attributeLabels.isNeverCalled)}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSelectField}
                data-testid="LeadsGridFilter-isNeverCalledSelect"
                withAnyOption
                withFocus
              >
                {neverCalledTypes.map(({ value, label }) => (
                  // @ts-ignore TS doesn't approve value as boolean type
                  <option key={`isNeverCalled-${value}`} value={value}>
                    {I18n.t(label)}
                  </option>
                ))}
              </Field>

              <Field
                name="searchLimit"
                type="number"
                className="LeadsGridFilter__field LeadsGridFilter__search-limit"
                label={I18n.t(attributeLabels.searchLimit)}
                placeholder={I18n.t('COMMON.UNLIMITED')}
                component={FormikInputField}
                data-testid="LeadsGridFilter-searchLimitInput"
                withFocus
                min={0}
              />
              <Field
                name="affiliate"
                className="LeadsGridFilter__field LeadsGridFilter__search"
                label={I18n.t(attributeLabels.affiliate)}
                placeholder={I18n.t('LEADS.FILTER.AFFILIATE_PLACEHOLDER')}
                component={FormikInputField}
                data-testid="LeadsGridFilter-affiliateInput"
                withFocus
              />

              <TimeZoneField className="LeadsGridFilter__field LeadsGridFilter__select" />

              <Field
                className="LeadsGridFilter__field LeadsGridFilter__date-range"
                label={I18n.t(attributeLabels.registrationDateRange)}
                component={FormikDateRangePicker}
                fieldsNames={{
                  from: 'registrationDateStart',
                  to: 'registrationDateEnd',
                }}
                data-testid="LeadsGridFilter-registrationDateRangePicker"
                withFocus
              />

              <Field
                className="LeadsGridFilter__field LeadsGridFilter__date-range"
                label={I18n.t(attributeLabels.lastNoteDateRange)}
                component={FormikDateRangePicker}
                fieldsNames={{
                  from: 'lastNoteDateFrom',
                  to: 'lastNoteDateTo',
                }}
                data-testid="LeadsGridFilter-lastNoteDateRangePicker"
                withFocus
              />

              <Field
                name="lastCallDateRange"
                className="LeadsGridFilter__field LeadsGridFilter__date-range"
                label={I18n.t(attributeLabels.lastCallDateRange)}
                component={FormikDateRangePicker}
                fieldsNames={{
                  from: 'lastCallDateFrom',
                  to: 'lastCallDateTo',
                }}
                anchorDirection="right"
                data-testid="LeadsGridFilter-lastCallDateRangePicker"
                withFocus
              />

              <div className="LeadsGridFilter__buttons">
                <RefreshButton
                  className="LeadsGridFilter__button"
                  onClick={onRefetch}
                  data-testid="LeadsGridFilter-refreshButton"
                />

                <Button
                  className="LeadsGridFilter__button"
                  disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
                  onClick={() => handleReset(resetForm)}
                  data-testid="LeadsGridFilter-resetButton"
                  primary
                >
                  {I18n.t('COMMON.RESET')}
                </Button>

                <Button
                  className="LeadsGridFilter__button"
                  disabled={isSubmitting || !dirty}
                  type="submit"
                  data-testid="LeadsGridFilter-submitButton"
                  primary
                >
                  {I18n.t('COMMON.APPLY')}
                </Button>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default React.memo(LeadsGridFilter);
