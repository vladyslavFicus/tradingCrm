import React from 'react';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Config, Utils, Constants } from '@crm/common';
import {
  Button,
  FormikMultipleSelectField,
  FormikSingleSelectField,
  FormikInputField,
  FormikDateRangePicker,
  RefreshButton,
} from 'components';
import useFilter from 'hooks/useFilter';
import TimeZoneField from 'components/TimeZoneField';
import {
  attributeLabels,
  leadAccountStatuses,
  maxSearchLimit,
  neverCalledTypes,
} from 'routes/Leads/routes/LeadsList/constants/leadsGridFilter';
import useLeadsGridFilter from 'routes/Leads/routes/LeadsList/hooks/useLeadsGridFilter';
import { FormValues } from 'routes/Leads/routes/LeadsList/types/leadsGridFilter';
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
                searchable
                withFocus
                name="languages"
                className="LeadsGridFilter__field LeadsGridFilter__select"
                label={I18n.t(attributeLabels.languages)}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikMultipleSelectField}
                data-testid="LeadsGridFilter-languagesSelect"
                options={languagesOptions.map(locale => ({
                  label: I18n.t(`COMMON.LANGUAGE_NAME.${locale.toUpperCase()}`, { defaultValue: locale.toUpperCase() }),
                  value: locale,
                }))}
              />

              <Field
                searchable
                withFocus
                name="countries"
                className="LeadsGridFilter__field LeadsGridFilter__select"
                label={I18n.t(attributeLabels.countries)}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikMultipleSelectField}
                data-testid="LeadsGridFilter-countriesSelect"
                options={[
                  { label: I18n.t('COMMON.OTHER'), value: 'UNDEFINED' },
                  ...Object.keys(Utils.countryList).map(country => ({
                    label: Utils.countryList[country],
                    value: country,
                  })),
                ]}
              />

              <Field
                searchable
                withFocus
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
                component={FormikMultipleSelectField}
                disabled={isDesksAndTeamsLoading || desks.length === 0}
                data-testid="LeadsGridFilter-desksSelect"
                options={desks.map(({ uuid, name }) => ({
                  label: I18n.t(name),
                  value: uuid,
                }))}
              />

              <Field
                searchable
                withFocus
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
                component={FormikMultipleSelectField}
                disabled={isDesksAndTeamsLoading || teamsOptions.length === 0}
                data-testid="LeadsGridFilter-teamsSelect"
                options={teamsOptions.map(({ uuid, name }) => ({
                  label: I18n.t(name),
                  value: uuid,
                }))}
              />

              <Field
                searchable
                withFocus
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
                component={FormikMultipleSelectField}
                disabled={isOperatorsLoading || operatorsOptions.length === 0}
                data-testid="LeadsGridFilter-salesAgentsSelect"
                options={operatorsOptions.map(({ uuid, fullName, operatorStatus }) => ({
                  label: fullName,
                  value: uuid,
                  className: classNames('LeadsGridFilter__select-option', {
                    'LeadsGridFilter__select-option--inactive': operatorStatus === Constants.Operator.statuses.INACTIVE
                        || operatorStatus === Constants.Operator.statuses.CLOSED,
                  }),
                }))}
              />

              <Field
                searchable
                withFocus
                name="salesStatuses"
                className="LeadsGridFilter__field LeadsGridFilter__select"
                label={I18n.t(attributeLabels.salesStatuses)}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikMultipleSelectField}
                disabled={isAcquisitionStatusesLoading}
                data-testid="LeadsGridFilter-salesStatusesSelect"
                options={salesStatuses.map(({ status }) => ({
                  label: I18n.t(Constants.salesStatuses[status]),
                  value: status,
                }))}
              />

              <Field
                withAnyOption
                searchable
                withFocus
                name="status"
                className="LeadsGridFilter__field LeadsGridFilter__select"
                label={I18n.t(attributeLabels.status)}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSingleSelectField}
                data-testid="LeadsGridFilter-statusSelect"
                options={Object.values(leadAccountStatuses)
                  .map(({ label, value }) => ({
                    label: I18n.t(label),
                    value,
                  }))}
              />

              <Field
                withAnyOption
                withFocus
                name="isNeverCalled"
                className="LeadsGridFilter__field LeadsGridFilter__select"
                label={I18n.t(attributeLabels.isNeverCalled)}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSingleSelectField}
                data-testid="LeadsGridFilter-isNeverCalledSelect"
                options={neverCalledTypes.map(({ value, label }) => ({
                  label: I18n.t(label),
                  value,
                }))}
              />

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
