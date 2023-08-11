import React from 'react';
import classNames from 'classnames';
import { Formik, Form } from 'formik';
import I18n from 'i18n-js';
import { Config, Utils, Constants } from '@crm/common';
import { Button, RefreshButton } from 'components';
import useFilter from 'hooks/useFilter';
import {
  FormikInputField,
  FormikSelectField,
  FormikDateRangePicker,
} from 'components/Formik';
import { DynamicField as Field, DynamicRangeGroup as RangeGroup } from 'components/Forms';
import { FiltersToggler } from 'components/FiltersToggler';
import { FilterSetsDecorator, FilterSetsButtons } from 'components/FilterSetsDecorator';
import DynamicFiltersButton from 'components/DynamicFiltersButton';
import ReactSwitch from 'components/ReactSwitch';
import TimeZoneField from 'components/TimeZoneField/TimeZoneField';
import {
  MAX_SELECTED_CLIENTS,
  acquisitionStatuses,
  activityStatuses,
  attributeLabels,
  assignStatuses,
  radioSelect,
} from 'routes/Clients/routes/ClientsList/constants';
import { FormValues } from 'routes/Clients/routes/ClientsList/types';
import useClientsGridFilter from 'routes/Clients/routes/ClientsList/hooks/useClientsGridFilter';
import './ClientsGridFilter.scss';

type Props = {
  clientsLoading: boolean,
  handleRefetch: () => void,
};

const ClientsGridFilter = (props:Props) => {
  const { clientsLoading, handleRefetch } = props;

  const {
    allowPartnersListView,
    allowAffiliateReferrals,
    offices,
    desks,
    teams,
    partners,
    affiliateReferrals,
    salesStatuses,
    retentionStatuses,
    role,
    department,
    isOldClientsGridFilterPanel,
    isPartnersLoading,
    isAffiliateReferralsLoading,
    isOperatorsLoading,
    isDesksAndTeamsLoading,
    isAcquisitionStatusesLoading,
    handleFetchPartners,
    handleFetchAffiliateReferrals,
    handleFetchOperators,
    handleFetchDesksAndTeamsQuery,
    handleFetchAcquisitionStatuses,
    filterOperators,
    handleToggleFilterPanel,
  } = useClientsGridFilter();

  const {
    filters,
    handleSubmit,
    handleReset,
  } = useFilter<FormValues>();

  return (
    <FiltersToggler hideButton viewPortMarginTop={156}>
      <Formik
        enableReinitialize
        onSubmit={handleSubmit}
        initialValues={filters}
        validate={Utils.createValidator({
          searchLimit: ['numeric', 'greater:0', `max:${MAX_SELECTED_CLIENTS}`],
        }, Utils.translateLabels(attributeLabels))}
      >
        {({ values, setValues, handleSubmit: onSubmit, resetForm, isSubmitting, dirty }) => {
          const desksUuids = values.desks || [];
          const officesUuids = values.offices || [];

          const desksByOffices = desks.filter(desk => officesUuids.includes(desk.parentBranch?.uuid as string));
          const desksOptions = officesUuids.length ? desksByOffices : desks;

          const teamsByDesks = teams.filter(team => desksUuids.includes(team.parentBranch?.uuid as string));
          const teamsOptions = desksUuids.length ? teamsByDesks : teams;

          const operatorsOptions = filterOperators(values);
          const salesOperatorsOptions = operatorsOptions.filter(({ userType }) => (
            Constants.isSales(userType as Constants.userTypes)));
          const retentionOperatorsOptions = operatorsOptions.filter((
            { userType },
          ) => Constants.isRetention(userType as Constants.userTypes));
          const languagesOptions = ['other', ...Config.getAvailableLanguages()];

          return (
            <FilterSetsDecorator
              // @ts-ignore Component withRouter HOC types issue
              filterSetType={Constants.filterSetTypes.CLIENT}
              currentValues={values}
              disabled={clientsLoading}
              isOldClientsGridFilterPanel={isOldClientsGridFilterPanel}
              submitFilters={(filterSetValues: FormValues) => {
                setValues(filterSetValues);
                onSubmit();
              }}
              renderBefore={(
                <>
                  <ReactSwitch
                    on={isOldClientsGridFilterPanel}
                    stopPropagation
                    className="ClientsGridFilter__old-filters"
                    label={I18n.t('COMMON.BUTTONS.OLD_FILTERS')}
                    labelPosition="bottom"
                    onClick={handleToggleFilterPanel}
                  />

                  <If condition={!isOldClientsGridFilterPanel}>
                    <DynamicFiltersButton
                      className="ClientsGridFilter__add-filter-button"
                      filters={{
                        searchByIdentifiers: I18n.t('COMMON.SEARCH_BY.CLIENT'),
                        searchByAffiliateIdentifiers: I18n.t('COMMON.SEARCH_BY.AFFILIATE'),
                        migrationId: I18n.t('COMMON.SEARCH_BY.MIGRATION_ID'),
                        activityStatus: I18n.t(attributeLabels.activityStatus),
                        ...(
                          allowPartnersListView && { affiliateUuids: I18n.t(attributeLabels.affiliateUuids) }
                        ),
                        affiliateFtd: I18n.t(attributeLabels.affiliateFtd),
                        affiliateFtdDateRange: I18n.t(attributeLabels.affiliateFtdDateRange),
                        affiliateReferrals: I18n.t(attributeLabels.affiliateReferrals),
                        languages: I18n.t(attributeLabels.languages),
                        countries: I18n.t(attributeLabels.countries),
                        desks: I18n.t(attributeLabels.desks),
                        teams: I18n.t(attributeLabels.teams),
                        operators: I18n.t(attributeLabels.operators),
                        salesOperators: I18n.t(attributeLabels.salesOperators),
                        retentionOperators: I18n.t(attributeLabels.retentionOperators),
                        isReferrered: I18n.t(attributeLabels.isReferrered),
                        statuses: I18n.t(attributeLabels.statuses),
                        acquisitionStatus: I18n.t(attributeLabels.acquisitionStatus),
                        passportCountriesOfIssue: I18n.t(attributeLabels.passportCountryOfIssue),
                        salesStatuses: I18n.t(attributeLabels.salesStatuses),
                        retentionStatuses: I18n.t(attributeLabels.retentionStatuses),

                        /* Only Admin and CS Head of department can see unassigned clients */
                        ...(
                          ['ADMINISTRATION', 'CS'].includes(department)
                          && ['ADMINISTRATION', 'HEAD_OF_DEPARTMENT'].includes(role)
                          && { assignStatus: I18n.t(attributeLabels.assignStatus) }
                        ),
                        kycStatuses: I18n.t(attributeLabels.kycStatuses),
                        firstTimeDeposit: I18n.t(attributeLabels.firstTimeDeposit),
                        warnings: I18n.t(attributeLabels.warnings),
                        balanceRange: I18n.t(attributeLabels.balance),
                        depositsCountRange: I18n.t(attributeLabels.deposit),
                        registrationDateRange: I18n.t(attributeLabels.registrationDate),
                        firstDepositDateRange: I18n.t(attributeLabels.firstDepositDateRange),
                        firstNoteDateRange: I18n.t(attributeLabels.firstNoteDateRange),
                        lastNoteDateRange: I18n.t(attributeLabels.lastNoteDateRange),
                        lastTradeDateRange: I18n.t(attributeLabels.lastTradeDateRange),
                        lastLoginDateRange: I18n.t(attributeLabels.lastLoginDateRange),
                        lastModificationDateRange: I18n.t(attributeLabels.lastModificationDateRange),
                        lastCallDateRange: I18n.t(attributeLabels.lastCallDateRange),
                        isNeverCalled: I18n.t(attributeLabels.isNeverCalled),
                        searchLimit: I18n.t(attributeLabels.searchLimit),
                        offices: I18n.t(attributeLabels.offices),
                        timeZone: I18n.t(attributeLabels.timeZone),
                        termsAccepted: I18n.t(attributeLabels.termsAccepted),
                      }}
                    />
                  </If>
                </>
                )}
            >
              <Form className="ClientsGridFilter__form">
                <div className="ClientsGridFilter__fields">
                  <Field
                    name="searchByIdentifiers"
                    className="ClientsGridFilter__field ClientsGridFilter__search"
                    data-testid="ClientsGridFilter-searchByIdentifiersInput"
                    label={I18n.t(attributeLabels.searchByIdentifiers)}
                    labelTooltip={I18n.t('COMMON.SEARCH_BY.TOOLTIP')}
                    placeholder={I18n.t('COMMON.SEARCH_BY.CLIENT')}
                    addition={<i className="icon icon-search" />}
                    component={FormikInputField}
                    maxLength={200}
                    withFocus
                  />

                  <Field
                    name="searchByAffiliateIdentifiers"
                    className="ClientsGridFilter__field ClientsGridFilter__search"
                    data-testid="ClientsGridFilter-searchByAffiliateIdentifiersInput"
                    label={I18n.t(attributeLabels.searchByAffiliateIdentifiers)}
                    placeholder={I18n.t('COMMON.SEARCH_BY.AFFILIATE')}
                    addition={<i className="icon icon-search" />}
                    component={FormikInputField}
                    maxLength={200}
                    withFocus
                  />

                  <Field
                    name="migrationId"
                    className="ClientsGridFilter__field ClientsGridFilter__migration-id"
                    data-testid="ClientsGridFilter-migrationIdInput"
                    label={I18n.t(attributeLabels.migrationId)}
                    placeholder={I18n.t('COMMON.SEARCH_BY.MIGRATION_ID')}
                    addition={<i className="icon icon-search" />}
                    component={FormikInputField}
                    maxLength={200}
                    withFocus
                  />

                  <Field
                    name="activityStatus"
                    className="ClientsGridFilter__field ClientsGridFilter__select"
                    data-testid="ClientsGridFilter-activityStatusSelect"
                    label={I18n.t(attributeLabels.activityStatus)}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikSelectField}
                    withAnyOption
                    withFocus
                  >
                    {activityStatuses.map(({ value, label }) => (
                      <option key={value} value={value}>{I18n.t(label)}</option>
                    ))}
                  </Field>

                  <Field
                    name="languages"
                    className="ClientsGridFilter__field ClientsGridFilter__select"
                    data-testid="ClientsGridFilter-languagesSelect"
                    label={I18n.t(attributeLabels.languages)}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikSelectField}
                    searchable
                    withFocus
                    multiple
                  >
                    {languagesOptions.map(locale => (
                      <option key={locale} value={locale}>
                        {I18n.t(
                          `COMMON.LANGUAGE_NAME.${locale.toUpperCase()}`,
                          { defaultValue: locale.toUpperCase() },
                        )}
                      </option>
                    ))}
                  </Field>

                  <Field
                    name="countries"
                    className="ClientsGridFilter__field ClientsGridFilter__select"
                    data-testid="ClientsGridFilter-countriesSelect"
                    label={I18n.t(attributeLabels.countries)}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikSelectField}
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
                    name="offices"
                    className="ClientsGridFilter__field ClientsGridFilter__select"
                    data-testid="ClientsGridFilter-officesSelect"
                    label={I18n.t(attributeLabels.offices)}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikSelectField}
                    withFocus
                    multiple
                    searchable
                  >
                    {offices.map(({ name, uuid }) => (
                      <option key={uuid} value={uuid}>
                        {name}
                      </option>
                    ))}
                  </Field>

                  <Field
                    name="desks"
                    className="ClientsGridFilter__field ClientsGridFilter__select"
                    data-testid="ClientsGridFilter-desksSelect"
                    label={I18n.t(attributeLabels.desks)}
                    placeholder={
                        I18n.t(
                          (!isDesksAndTeamsLoading && !desksOptions.length)
                            ? 'COMMON.SELECT_OPTION.NO_ITEMS'
                            : 'COMMON.SELECT_OPTION.ANY',
                        )
                      }
                    component={FormikSelectField}
                    disabled={isDesksAndTeamsLoading || !desksOptions.length}
                    onFetch={handleFetchDesksAndTeamsQuery}
                    searchable
                    withFocus
                    multiple
                  >
                    {desksOptions.map(({ uuid, name }) => (
                      <option key={uuid} value={uuid}>{name}</option>
                    ))}
                  </Field>

                  <Field
                    name="teams"
                    className="ClientsGridFilter__field ClientsGridFilter__select"
                    data-testid="ClientsGridFilter-teamsSelect"
                    label={I18n.t(attributeLabels.teams)}
                    placeholder={
                        I18n.t(
                          (!isDesksAndTeamsLoading && !teamsOptions.length)
                            ? 'COMMON.SELECT_OPTION.NO_ITEMS'
                            : 'COMMON.SELECT_OPTION.ANY',
                        )
                      }
                    component={FormikSelectField}
                    disabled={isDesksAndTeamsLoading || !teamsOptions.length}
                    onFetch={handleFetchDesksAndTeamsQuery}
                    searchable
                    withFocus
                    multiple
                  >
                    {teamsOptions.map(({ uuid, name }) => (
                      <option key={uuid} value={uuid}>{name}</option>
                    ))}
                  </Field>

                  <Field
                    name="operators"
                    className="ClientsGridFilter__field ClientsGridFilter__select"
                    data-testid="ClientsGridFilter-operatorsSelect"
                    label={I18n.t(attributeLabels.operators)}
                    placeholder={
                        I18n.t(
                          (!isOperatorsLoading && !operatorsOptions.length)
                            ? 'COMMON.SELECT_OPTION.NO_ITEMS'
                            : 'COMMON.SELECT_OPTION.ANY',
                        )
                      }
                    component={FormikSelectField}
                    disabled={isOperatorsLoading || !operatorsOptions.length}
                    onFetch={handleFetchOperators}
                    searchable
                    withFocus
                    multiple
                  >
                    {operatorsOptions.map(({ uuid, fullName, operatorStatus }) => (
                      <option
                        key={uuid}
                        value={uuid}
                        className={classNames('ClientsGridFilter__select-option', {
                          'ClientsGridFilter__select-option--inactive':
                              operatorStatus === Constants.Operator.statuses.INACTIVE
                              || operatorStatus === Constants.Operator.statuses.CLOSED,
                        })}
                      >
                        {fullName}
                      </option>
                    ))}
                  </Field>

                  <If condition={allowPartnersListView}>
                    <Field
                      name="affiliateUuids"
                      className="ClientsGridFilter__field ClientsGridFilter__select"
                      data-testid="ClientsGridFilter-affiliateUuidsSelect"
                      label={I18n.t(attributeLabels.affiliateUuids)}
                      placeholder={
                        I18n.t(
                          (!isPartnersLoading && !partners.length)
                            ? 'COMMON.SELECT_OPTION.NO_ITEMS'
                            : 'COMMON.SELECT_OPTION.ANY',
                        )
                      }
                      component={FormikSelectField}
                      disabled={isPartnersLoading || !partners.length}
                      onFetch={handleFetchPartners}
                      searchable
                      withFocus
                      multiple
                    >
                      {[{ uuid: 'NONE', fullName: 'NONE', status: '' }, ...partners]
                        .map(({ uuid, fullName, status }) => (
                          <option
                            key={uuid}
                            value={uuid}
                            className={classNames('ClientsGridFilter__select-option', {
                              'ClientsGridFilter__select-option--inactive':
                                ['INACTIVE', 'CLOSED'].includes(status),
                            })}
                          >
                            {fullName}
                          </option>
                        ))}
                    </Field>
                  </If>

                  <If condition={allowAffiliateReferrals}>
                    <Field
                      name="affiliateReferrals"
                      className="ClientsGridFilter__field ClientsGridFilter__select"
                      data-testid="ClientsGridFilter-affiliateaffiliateReferralsSelect"
                      label={I18n.t(attributeLabels.affiliateReferrals)}
                      placeholder={
                        I18n.t(
                          (!isAffiliateReferralsLoading && !affiliateReferrals.length)
                            ? 'COMMON.SELECT_OPTION.NO_ITEMS'
                            : 'COMMON.SELECT_OPTION.ANY',
                        )
                      }
                      component={FormikSelectField}
                      disabled={isAffiliateReferralsLoading || !affiliateReferrals.length}
                      onFetch={handleFetchAffiliateReferrals}
                      searchable
                      withFocus
                      multiple
                    >
                      {affiliateReferrals.map((name, idx) => (
                        <option
                          key={idx}
                          value={name as string}
                          className="ClientsGridFilter__select-option"
                        >
                          {name}
                        </option>
                      ))}
                    </Field>
                  </If>

                  <Field
                    name="affiliateFtd"
                    className="ClientsGridFilter__field ClientsGridFilter__select"
                    data-testid="ClientsGridFilter-affiliateFtdSelect"
                    label={I18n.t(attributeLabels.affiliateFtd)}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikSelectField}
                    withAnyOption
                    withFocus
                  >
                    {radioSelect.map(({ value, label }) => (
                      // @ts-ignore TS doesn't approve value as boolean type
                      <option key={`affiliateFTD-${value}`} value={value}>
                        {I18n.t(label)}
                      </option>
                    ))}
                  </Field>

                  <Field
                    name="isReferrered"
                    className="ClientsGridFilter__field ClientsGridFilter__select"
                    data-testid="ClientsGridFilter-isReferreredSelect"
                    label={I18n.t(attributeLabels.isReferrered)}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikSelectField}
                    withAnyOption
                    withFocus
                  >
                    {radioSelect.map(({ value, label }) => (
                      // @ts-ignore TS doesn't approve value as boolean type
                      <option key={`refferer-${value}`} value={value}>
                        {I18n.t(label)}
                      </option>
                    ))}
                  </Field>

                  <Field
                    name="statuses"
                    className="ClientsGridFilter__field ClientsGridFilter__select"
                    data-testid="ClientsGridFilter-statusesSelect"
                    label={I18n.t(attributeLabels.statuses)}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikSelectField}
                    withFocus
                    multiple
                  >
                    {Object.keys(Constants.User.statusesLabels).map(status => (
                      <option key={status} value={status}>
                        {I18n.t(Constants.User.statusesLabels[status as Constants.User.statuses])}
                      </option>
                    ))}
                  </Field>

                  <Field
                    name="kycStatuses"
                    className="ClientsGridFilter__field ClientsGridFilter__select"
                    data-testid="ClientsGridFilter-kycStatusesSelect"
                    label={I18n.t(attributeLabels.kycStatuses)}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikSelectField}
                    searchable
                    withFocus
                    multiple
                  >
                    {Object.keys(Constants.kycStatusesLabels).map(status => (
                      <option key={status} value={status}>
                        {I18n.t(Constants.kycStatusesLabels[status as Constants.kycStatuses])}
                      </option>
                    ))}
                  </Field>

                  {/* Only Admin and CS Head of department can see unassigned clients */}
                  <If
                    condition={
                      ['ADMINISTRATION', 'CS'].includes(department)
                      && ['ADMINISTRATION', 'HEAD_OF_DEPARTMENT'].includes(role)
                    }
                  >
                    <Field
                      name="assignStatus"
                      className="ClientsGridFilter__field ClientsGridFilter__select"
                      data-testid="ClientsGridFilter-assignStatusSelect"
                      label={I18n.t(attributeLabels.assignStatus)}
                      placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                      component={FormikSelectField}
                      withAnyOption
                      withFocus
                    >
                      {assignStatuses.map(({ value, label }) => (
                        <option key={value} value={value}>
                          {I18n.t(label)}
                        </option>
                      ))}
                    </Field>
                  </If>

                  <Field
                    name="acquisitionStatus"
                    className="ClientsGridFilter__field ClientsGridFilter__select"
                    data-testid="ClientsGridFilter-acquisitionStatusSelect"
                    label={I18n.t(attributeLabels.acquisitionStatus)}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikSelectField}
                    withAnyOption
                    withFocus
                  >
                    {acquisitionStatuses.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {I18n.t(label)}
                      </option>
                    ))}
                  </Field>

                  <Field
                    name="salesStatuses"
                    className="ClientsGridFilter__field ClientsGridFilter__select"
                    data-testid="ClientsGridFilter-salesStatusesSelect"
                    label={I18n.t(attributeLabels.salesStatuses)}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikSelectField}
                    disabled={isAcquisitionStatusesLoading}
                    onFetch={handleFetchAcquisitionStatuses}
                    searchable
                    withFocus
                    multiple
                  >
                    {salesStatuses.map(({ status }) => (
                      <option key={status} value={status}>
                        {I18n.t(Constants.salesStatuses[status])}
                      </option>
                    ))}
                  </Field>

                  <Field
                    name="retentionStatuses"
                    className="ClientsGridFilter__field ClientsGridFilter__select"
                    data-testid="ClientsGridFilter-retentionStatusesSelect"
                    label={I18n.t(attributeLabels.retentionStatuses)}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikSelectField}
                    disabled={isAcquisitionStatusesLoading}
                    onFetch={handleFetchAcquisitionStatuses}
                    searchable
                    withFocus
                    multiple
                  >
                    {retentionStatuses.map(({ status }) => (
                      <option key={status} value={status}>
                        {I18n.t(Constants.retentionStatuses[status])}
                      </option>
                    ))}
                  </Field>

                  <Field
                    name="retentionOperators"
                    className="ClientsGridFilter__field ClientsGridFilter__select"
                    data-testid="ClientsGridFilter-retentionOperatorsSelect"
                    label={I18n.t(attributeLabels.retentionOperators)}
                    placeholder={
                        I18n.t(
                          (!isOperatorsLoading && !retentionOperatorsOptions.length)
                            ? 'COMMON.SELECT_OPTION.NO_ITEMS'
                            : 'COMMON.SELECT_OPTION.ANY',
                        )
                      }
                    component={FormikSelectField}
                    disabled={isOperatorsLoading || !retentionOperatorsOptions.length}
                    onFetch={handleFetchOperators}
                    searchable
                    withFocus
                    multiple
                  >
                    {retentionOperatorsOptions.map(({ uuid, fullName, operatorStatus }) => (
                      <option
                        key={uuid}
                        value={uuid}
                        className={classNames('ClientsGridFilter__select-option', {
                          'ClientsGridFilter__select-option--inactive':
                            operatorStatus === Constants.Operator.statuses.INACTIVE
                            || operatorStatus === Constants.Operator.statuses.CLOSED,
                        })}
                      >
                        {fullName}
                      </option>
                    ))}
                  </Field>

                  <Field
                    name="salesOperators"
                    className="ClientsGridFilter__field ClientsGridFilter__select"
                    data-testid="ClientsGridFilter-salesOperatorsSelect"
                    label={I18n.t(attributeLabels.salesOperators)}
                    placeholder={
                      I18n.t(
                        (!isOperatorsLoading && !salesOperatorsOptions.length)
                          ? 'COMMON.SELECT_OPTION.NO_ITEMS'
                          : 'COMMON.SELECT_OPTION.ANY',
                      )
                    }
                    component={FormikSelectField}
                    disabled={isOperatorsLoading || !salesOperatorsOptions.length}
                    onFetch={handleFetchOperators}
                    searchable
                    withFocus
                    multiple
                  >
                    {salesOperatorsOptions.map(({ uuid, fullName, operatorStatus }) => (
                      <option
                        key={uuid}
                        value={uuid}
                        className={classNames('ClientsGridFilter__select-option', {
                          'ClientsGridFilter__select-option--inactive':
                            operatorStatus === Constants.Operator.statuses.INACTIVE
                            || operatorStatus === Constants.Operator.statuses.CLOSED,
                        })}
                      >
                        {fullName}
                      </option>
                    ))}
                  </Field>

                  <Field
                    name="termsAccepted"
                    className="ClientsGridFilter__field ClientsGridFilter__select"
                    data-testid="ClientsGridFilter-termsAcceptedSelect"
                    label={I18n.t(attributeLabels.termsAccepted)}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikSelectField}
                  >
                    {Constants.User.TERMS_ACCEPTED_FILTER_TYPES.map(({ label, value }) => (
                      <option key={label} value={value}>
                        {I18n.t(`PLAYER_PROFILE.PROFILE.PERSONAL.LABEL.TERMS_ACCEPTED_TYPES.${label}`)}
                      </option>
                    ))}
                  </Field>

                  <Field
                    name="firstTimeDeposit"
                    className="ClientsGridFilter__field ClientsGridFilter__select"
                    data-testid="ClientsGridFilter-firstTimeDepositSelect"
                    label={I18n.t(attributeLabels.firstTimeDeposit)}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikSelectField}
                    withAnyOption
                    withFocus
                  >
                    {radioSelect.map(({ value, label }) => (
                      // @ts-ignore TS doesn't approve value as boolean type
                      <option key={`firstTimeDeposit-${value}`} value={value}>
                        {I18n.t(label)}
                      </option>
                    ))}
                  </Field>

                  <RangeGroup
                    name="balanceRange"
                    className="ClientsGridFilter__field ClientsGridFilter__range-inputs"
                    data-testid="ClientsGridFilter-balanceRangeGroup"
                    label={I18n.t(attributeLabels.balance)}
                  >
                    <Field
                      name="balanceRange.from"
                      type="number"
                      step="0.01"
                      min={0}
                      placeholder="0.0"
                      component={FormikInputField}
                      className="ClientsGridFilter__field"
                      data-testid="ClientsGridFilter-balanceRangeFromInput"
                      withFocus
                    />
                    <Field
                      name="balanceRange.to"
                      type="number"
                      step="0.01"
                      min={0}
                      placeholder="0.0"
                      component={FormikInputField}
                      className="ClientsGridFilter__field"
                      data-testid="ClientsGridFilter-balanceRangeToInput"
                      withFocus
                    />
                  </RangeGroup>

                  <RangeGroup
                    name="depositsCountRange"
                    className="ClientsGridFilter__field ClientsGridFilter__range-inputs"
                    data-testid="ClientsGridFilter-depositsCountRangeGroup"
                    label={I18n.t(attributeLabels.deposit)}
                  >
                    <Field
                      name="depositsCountRange.from"
                      type="number"
                      placeholder="0"
                      min={0}
                      component={FormikInputField}
                      className="ClientsGridFilter__field"
                      data-testid="ClientsGridFilter-depositsCountRangeFromInput"
                      withFocus
                    />
                    <Field
                      name="depositsCountRange.to"
                      type="number"
                      min={0}
                      placeholder="0"
                      component={FormikInputField}
                      className="ClientsGridFilter__field"
                      data-testid="ClientsGridFilter-depositsCountRangeToInput"
                      withFocus
                    />
                  </RangeGroup>

                  <Field
                    name="isNeverCalled"
                    className="ClientsGridFilter__field ClientsGridFilter__select"
                    data-testid="ClientsGridFilter-isNeverCalledSelect"
                    label={I18n.t(attributeLabels.isNeverCalled)}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikSelectField}
                    withAnyOption
                    withFocus
                  >
                    {radioSelect.map(({ value, label }) => (
                      // @ts-ignore TS doesn't approve value as boolean type
                      <option key={`isNeverCalled-${value}`} value={value}>
                        {I18n.t(label)}
                      </option>
                    ))}
                  </Field>

                  <Field
                    name="timeZone"
                    className="ClientsGridFilter__field ClientsGridFilter__select"
                    data-testid="ClientsGridFilter-timeZone"
                    component={TimeZoneField}
                  />

                  <Field
                    name="registrationDateRange"
                    className="ClientsGridFilter__field ClientsGridFilter__date-range"
                    data-testid="ClientsGridFilter-registrationDateRangePicker"
                    label={I18n.t(attributeLabels.registrationDate)}
                    component={FormikDateRangePicker}
                    fieldsNames={{
                      from: 'registrationDateRange.from',
                      to: 'registrationDateRange.to',
                    }}
                    withFocus
                  />

                  <Field
                    name="affiliateFtdDateRange"
                    className="ClientsGridFilter__field ClientsGridFilter__date-range"
                    data-testid="ClientsGridFilter-affiliateFtdDateRangePicker"
                    label={I18n.t(attributeLabels.affiliateFtdDateRange)}
                    component={FormikDateRangePicker}
                    fieldsNames={{
                      from: 'affiliateFtdDateRange.from',
                      to: 'affiliateFtdDateRange.to',
                    }}
                    withFocus
                  />

                  <Field
                    name="firstDepositDateRange"
                    className="ClientsGridFilter__field ClientsGridFilter__date-range"
                    data-testid="ClientsGridFilter-firstDepositDateRangePicker"
                    label={I18n.t(attributeLabels.firstDepositDateRange)}
                    component={FormikDateRangePicker}
                    fieldsNames={{
                      from: 'firstDepositDateRange.from',
                      to: 'firstDepositDateRange.to',
                    }}
                    withFocus
                  />

                  <Field
                    name="firstNoteDateRange"
                    className="ClientsGridFilter__field ClientsGridFilter__date-range"
                    data-testid="ClientsGridFilter-firstNoteDateRangePicker"
                    label={I18n.t(attributeLabels.firstNoteDateRange)}
                    component={FormikDateRangePicker}
                    fieldsNames={{
                      from: 'firstNoteDateRange.from',
                      to: 'firstNoteDateRange.to',
                    }}
                    anchorDirection="right"
                    withFocus
                  />

                  <Field
                    name="lastNoteDateRange"
                    className="ClientsGridFilter__field ClientsGridFilter__date-range"
                    data-testid="ClientsGridFilter-lastNoteDateRangePicker"
                    label={I18n.t(attributeLabels.lastNoteDateRange)}
                    component={FormikDateRangePicker}
                    fieldsNames={{
                      from: 'lastNoteDateRange.from',
                      to: 'lastNoteDateRange.to',
                    }}
                    withFocus
                  />

                  <Field
                    name="lastTradeDateRange"
                    className="ClientsGridFilter__field ClientsGridFilter__date-range"
                    data-testid="ClientsGridFilter-lastTradeDateRangePicker"
                    label={I18n.t(attributeLabels.lastTradeDateRange)}
                    component={FormikDateRangePicker}
                    fieldsNames={{
                      from: 'lastTradeDateRange.from',
                      to: 'lastTradeDateRange.to',
                    }}
                    withFocus
                  />

                  <Field
                    name="lastLoginDateRange"
                    className="ClientsGridFilter__field ClientsGridFilter__date-range"
                    data-testid="ClientsGridFilter-lastLoginDateRangePicker"
                    label={I18n.t(attributeLabels.lastLoginDateRange)}
                    component={FormikDateRangePicker}
                    fieldsNames={{
                      from: 'lastLoginDateRange.from',
                      to: 'lastLoginDateRange.to',
                    }}
                    anchorDirection="right"
                    withFocus
                  />

                  <Field
                    name="lastModificationDateRange"
                    className="ClientsGridFilter__field ClientsGridFilter__date-range"
                    data-testid="ClientsGridFilter-lastModificationDateRangePicker"
                    label={I18n.t(attributeLabels.lastModificationDateRange)}
                    component={FormikDateRangePicker}
                    fieldsNames={{
                      from: 'lastModificationDateRange.from',
                      to: 'lastModificationDateRange.to',
                    }}
                    withFocus
                  />

                  <Field
                    name="lastCallDateRange"
                    className="ClientsGridFilter__field ClientsGridFilter__date-range"
                    data-testid="ClientsGridFilter-lastCallDateRangePicker"
                    label={I18n.t(attributeLabels.lastCallDateRange)}
                    component={FormikDateRangePicker}
                    fieldsNames={{
                      from: 'lastCallDateRange.from',
                      to: 'lastCallDateRange.to',
                    }}
                    withFocus
                  />

                  <Field
                    name="passportCountriesOfIssue"
                    className="ClientsGridFilter__field ClientsGridFilter__select"
                    data-testid="ClientsGridFilter-passportCountriesOfIssueSelect"
                    label={I18n.t(attributeLabels.passportCountryOfIssue)}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikSelectField}
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
                    name="warnings"
                    className="ClientsGridFilter__field ClientsGridFilter__select"
                    data-testid="ClientsGridFilter-warningsSelect"
                    label={I18n.t(attributeLabels.warnings)}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikSelectField}
                    withAnyOption
                    withFocus
                  >
                    {Object.keys(Constants.warningLabels).map(warning => (
                      <option key={warning} value={warning}>
                        {I18n.t(Constants.warningLabels[warning as Constants.warningValues])}
                      </option>
                    ))}
                  </Field>

                  <Field
                    name="searchLimit"
                    type="number"
                    className="ClientsGridFilter__field ClientsGridFilter__search-limit"
                    data-testid="ClientsGridFilter-searchLimitInput"
                    label={I18n.t(attributeLabels.searchLimit)}
                    placeholder={I18n.t('COMMON.UNLIMITED')}
                    component={FormikInputField}
                    min={0}
                    withFocus
                  />
                </div>
                <div className="ClientsGridFilter__buttons">
                  <FilterSetsButtons />

                  <div className="ClientsGridFilter__buttons-group">
                    <RefreshButton
                      onClick={handleRefetch}
                      className="ClientsGridFilter__button"
                      data-testid="ClientsGridFilter-refreshButton"
                    />

                    <Button
                      onClick={() => handleReset(resetForm)}
                      className="ClientsGridFilter__button"
                      data-testid="ClientsGridFilter-resetButton"
                      disabled={clientsLoading || isSubmitting || !Object.keys(values).length}
                      primary
                    >
                      {I18n.t('COMMON.RESET')}
                    </Button>

                    <Button
                      type="submit"
                      className="ClientsGridFilter__button"
                      data-testid="ClientsGridFilter-applyButton"
                      disabled={clientsLoading || isSubmitting || !dirty}
                      primary
                    >
                      {I18n.t('COMMON.APPLY')}
                    </Button>
                  </div>
                </div>
              </Form>
            </FilterSetsDecorator>
          );
        }}
      </Formik>
    </FiltersToggler>
  );
};

export default React.memo(ClientsGridFilter);
