import React, { useCallback, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import compose from 'compose-function';
import { intersection, sortBy } from 'lodash';
import classNames from 'classnames';
import { Formik, Form } from 'formik';
import I18n from 'i18n-js';
import Trackify from '@hrzn/trackify';
import usePrevious from 'hooks/usePrevious';
import { Button, RefreshButton } from 'components/Buttons';
import { isSales, isRetention, userTypes } from 'constants/hierarchyTypes';
import { getAvailableLanguages, getBrand } from 'config';
import permissions from 'config/permissions';
import { statuses, statusesLabels } from 'constants/user';
import { statuses as operatorsStatuses } from 'constants/operators';
import { salesStatuses as staticSalesStatuses } from 'constants/salesStatuses';
import { retentionStatuses as staticRetentionStatuses } from 'constants/retentionStatuses';
import { kycStatuses, kycStatusesLabels } from 'constants/kycStatuses';
import { warningLabels, warningValues } from 'constants/warnings';
import { filterSetTypes } from 'constants/filterSet';
import { withStorage } from 'providers/StorageProvider';
import { usePermission } from 'providers/PermissionsProvider';
import {
  FormikInputField,
  FormikSelectField,
  FormikDateRangePicker,
} from 'components/Formik';
import { DynamicField as Field, DynamicRangeGroup as RangeGroup } from 'components/Forms';
import { decodeNullValues } from 'components/Formik/utils';
import FiltersToggler from 'components/FiltersToggler';
import FilterSetsDecorator, { FilterSetsButtons } from 'components/FilterSetsDecorator';
import DynamicFiltersButton from 'components/DynamicFiltersButton';
import ReactSwitch from 'components/ReactSwitch';
import TimeZoneField from 'components/TimeZoneField/TimeZoneField';
import countries from 'utils/countryList';
import { createValidator, translateLabels } from 'utils/validator';
import { State } from 'types';
import { Storage } from 'types/storage';
import {
  MAX_SELECTED_CLIENTS,
  acquisitionStatuses,
  activityStatuses,
  attributeLabels,
  assignStatuses,
  radioSelect,
  PARTNERS_SORT,
  OPERATORS_SORT,
  storageKey,
} from '../../constants';
import { FormValues } from '../../types';
import { usePartnersQuery } from './graphql/__generated__/PartnersQuery';
import { useOperatorsQuery } from './graphql/__generated__/OperatorsQuery';
import { useDesksAndTeamsQuery } from './graphql/__generated__/DesksAndTeamsQuery';
import { useAcquisitionStatusesQuery } from './graphql/__generated__/AcquisitionStatusesQuery';
import { oldFilters, defaultFilters } from './constants';
import './ClientsGridFilter.scss';

type Auth = {
  department: string,
  role: string,
  uuid: string,
};

type Props = {
  auth: Auth,
  storage: Storage,
  clientsLoading: boolean,
  isOldClientsGridFilterPanel?: boolean,
  handleRefetch: () => void,
};

const ClientsGridFilter = (props:Props) => {
  const {
    auth: { role, department },
    storage,
    clientsLoading,
    isOldClientsGridFilterPanel,
    handleRefetch,
  } = props;

  const { state } = useLocation<State<FormValues>>();
  const history = useHistory();
  const permission = usePermission();
  const prevFiltersFields = usePrevious(state?.filtersFields);

  const { data: desksAndTeamsData, loading: isDesksAndTeamsLoading } = useDesksAndTeamsQuery({
    // You should only use this query when displaying desks and teams filters.
    skip: !['desks', 'teams'].some(field => state?.filtersFields?.includes(field)),
  });

  const { data: acquisitionStatusesData, loading: isAcquisitionStatusesLoading } = useAcquisitionStatusesQuery({
    variables: { brandId: getBrand().id },
    // You should only use this query when displaying salesStatuses and retentionStatuses filters.
    skip: !['salesStatuses', 'retentionStatuses'].some(field => state?.filtersFields?.includes(field)),
  });

  const { data: partnersData, loading: isPartnersLoading } = usePartnersQuery({
    variables: { page: { sorts: PARTNERS_SORT } },
    // You should only use this query when displaying affiliateUuids filter.
    skip: !state?.filtersFields?.includes('affiliateUuids'),
  });

  const { data: operatorsData, loading: isOperatorsLoading } = useOperatorsQuery({
    variables: { page: { sorts: OPERATORS_SORT } },
    // You should only use this query when displaying salesOperators, operators and retentionOperators filters.
    skip: !['salesOperators', 'operators', 'retentionOperators'].some(field => state?.filtersFields?.includes(field)),
  });

  const operators = operatorsData?.operators?.content || [];

  const filterOperatorsByBranch = (uuids: Array<string | null>) => (
    operators.filter((operator) => {
      const partnerBranches = operator.hierarchy?.parentBranches || [];
      const branches = partnerBranches.map(({ uuid }) => uuid);

      return intersection(branches, uuids).length;
    })
  );

  const filterOperators = ({ desks, teams }: FormValues) => {
    if (teams && teams.length) {
      return filterOperatorsByBranch(teams);
    }

    if (desks && desks.length) {
      // If desk chosen -> find all teams of these desks to filter operators
      const teamsList = desksAndTeamsData?.userBranches?.TEAM || [];
      const teamsByDesks = teamsList.filter(team => desks.includes(team.parentBranch?.uuid as string))
        .map(({ uuid }) => uuid);
      const uuids = [...desks, ...teamsByDesks];

      return filterOperatorsByBranch(uuids);
    }

    return operators;
  };

  const handleSubmit = (values: FormValues) => {
    history.replace({
      state: {
        ...state,
        filters: decodeNullValues(values),
      },
    });
  };

  const handleReset = () => {
    if (clientsLoading) return;

    history.replace({
      state: {
        ...state,
        filters: null,
        selectedFilterSet: null,
      },
    });
  };

  /**
   * Handle showing filters new or old implementation
   *
   * @param enabled
   */
  const handleToggleFilterPanel = useCallback((enabled: boolean) => {
    Trackify.click('CLIENTS_GRID_SWITCH_TO_OLD_FILTER_PANEL', { eventValue: enabled.toString() });

    storage.set('isOldClientsGridFilterPanel', enabled);

    // When selected "Custom Filters Sets" otherwise defaultFilters
    const prevFilters = state?.selectedFilterSet?.fields || defaultFilters;

    history.replace({
      state: {
        ...state,
        filtersFields: enabled ? oldFilters : prevFilters,
      },
    });
  }, [history, state]);

  const getFilters = () => {
    // Set default filters fields list if no filters fields list was applied before and the current history operation
    // isn't "replace" state to prevent set default filters list if user cleared select with filters list
    if (!state?.filtersFields?.length && history.action !== 'REPLACE') {
      const storedFilters = storage.get(storageKey) || [];
      const filtersFields = storedFilters.length ? storedFilters : defaultFilters;

      history.replace({
        state: {
          ...state,
          filtersFields,
        },
      });
    }

    // Save to persistent storage if list with filters fields was changed
    if (storageKey && prevFiltersFields !== state?.filtersFields) {
      storage.set(storageKey, state?.filtersFields);
    }
  };

  useEffect(() => {
    getFilters();
  }, [state?.filtersFields]);


  const offices = desksAndTeamsData?.userBranches?.OFFICE || [];
  const desks = desksAndTeamsData?.userBranches?.DESK || [];
  const teams = desksAndTeamsData?.userBranches?.TEAM || [];
  const partners = partnersData?.partners?.content || [];
  const salesStatuses = sortBy(acquisitionStatusesData?.settings.salesStatuses || [], 'status');
  const retentionStatuses = sortBy(acquisitionStatusesData?.settings.retentionStatuses || [], 'status');

  return (
    <FiltersToggler hideButton viewPortMarginTop={156}>
      <Formik
        enableReinitialize
        onSubmit={handleSubmit}
        initialValues={state?.filters || {}}
        validate={createValidator({
          searchLimit: ['numeric', 'greater:0', `max:${MAX_SELECTED_CLIENTS}`],
        }, translateLabels(attributeLabels))}
      >
        {({ values, setValues, handleSubmit: onSubmit, isSubmitting, dirty }) => {
          const desksUuids = values.desks || [];
          const officesUuids = values.offices || [];

          const desksByOffices = desks.filter(desk => officesUuids.includes(desk.parentBranch?.uuid as string));
          const desksOptions = officesUuids.length ? desksByOffices : desks;

          const teamsByDesks = teams.filter(team => desksUuids.includes(team.parentBranch?.uuid as string));
          const teamsOptions = desksUuids.length ? teamsByDesks : teams;

          const operatorsOptions = filterOperators(values);
          const salesOperatorsOptions = operatorsOptions.filter(({ userType }) => isSales(userType as userTypes));
          const retentionOperatorsOptions = operatorsOptions.filter((
            { userType },
          ) => isRetention(userType as userTypes));
          const languagesOptions = ['other', ...getAvailableLanguages()];

          return (
            <FilterSetsDecorator
              filterSetType={filterSetTypes.CLIENT}
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
                        affiliateFtd: I18n.t(attributeLabels.affiliateFtd),
                        affiliateFtdDateRange: I18n.t(attributeLabels.affiliateFtdDateRange),
                        languages: I18n.t(attributeLabels.languages),
                        countries: I18n.t(attributeLabels.countries),
                        desks: I18n.t(attributeLabels.desks),
                        teams: I18n.t(attributeLabels.teams),
                        operators: I18n.t(attributeLabels.operators),
                        ...(
                          permission.allows(permissions.PARTNERS.PARTNERS_LIST_VIEW)
                          && { affiliateUuids: I18n.t(attributeLabels.affiliateUuids) }
                        ),
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
                    label={I18n.t(attributeLabels.countries)}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikSelectField}
                    searchable
                    withFocus
                    multiple
                  >
                    {[
                      <option key="UNDEFINED" value="UNDEFINED">{I18n.t('COMMON.OTHER')}</option>,
                      ...Object.keys(countries)
                        .map(country => (
                          <option key={country} value={country}>{countries[country]}</option>
                        )),
                    ]}
                  </Field>

                  <Field
                    name="offices"
                    className="ClientsGridFilter__field ClientsGridFilter__select"
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
                    searchable
                    withFocus
                    multiple
                  >
                    {operatorsOptions.map(({ uuid, fullName, operatorStatus }) => (
                      <option
                        key={uuid}
                        value={uuid}
                        className={classNames('ClientsGridFilter__select-option', {
                          'ClientsGridFilter__select-option--inactive': operatorStatus === operatorsStatuses.INACTIVE
                              || operatorStatus === operatorsStatuses.CLOSED,
                        })}
                      >
                        {fullName}
                      </option>
                    ))}
                  </Field>

                  <Field
                    name="salesOperators"
                    className="ClientsGridFilter__field ClientsGridFilter__select"
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
                    searchable
                    withFocus
                    multiple
                  >
                    {salesOperatorsOptions.map(({ uuid, fullName, operatorStatus }) => (
                      <option
                        key={uuid}
                        value={uuid}
                        className={classNames('ClientsGridFilter__select-option', {
                          'ClientsGridFilter__select-option--inactive': operatorStatus === operatorsStatuses.INACTIVE
                              || operatorStatus === operatorsStatuses.CLOSED,
                        })}
                      >
                        {fullName}
                      </option>
                    ))}
                  </Field>

                  <Field
                    name="retentionOperators"
                    className="ClientsGridFilter__field ClientsGridFilter__select"
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
                    searchable
                    withFocus
                    multiple
                  >
                    {retentionOperatorsOptions.map(({ uuid, fullName, operatorStatus }) => (
                      <option
                        key={uuid}
                        value={uuid}
                        className={classNames('ClientsGridFilter__select-option', {
                          'ClientsGridFilter__select-option--inactive': operatorStatus === operatorsStatuses.INACTIVE
                              || operatorStatus === operatorsStatuses.CLOSED,
                        })}
                      >
                        {fullName}
                      </option>
                    ))}
                  </Field>

                  <If condition={permission.allows(permissions.PARTNERS.PARTNERS_LIST_VIEW)}>
                    <Field
                      name="affiliateUuids"
                      className="ClientsGridFilter__field ClientsGridFilter__select"
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

                  <Field
                    name="isReferrered"
                    className="ClientsGridFilter__field ClientsGridFilter__select"
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
                    label={I18n.t(attributeLabels.statuses)}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikSelectField}
                    withFocus
                    multiple
                  >
                    {Object.keys(statusesLabels).map(status => (
                      <option key={status} value={status}>
                        {I18n.t(statusesLabels[status as statuses])}
                      </option>
                    ))}
                  </Field>

                  <Field
                    name="affiliateFtd"
                    className="ClientsGridFilter__field ClientsGridFilter__select"
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
                    name="acquisitionStatus"
                    className="ClientsGridFilter__field ClientsGridFilter__select"
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
                    name="passportCountriesOfIssue"
                    className="ClientsGridFilter__field ClientsGridFilter__select"
                    label={I18n.t(attributeLabels.passportCountryOfIssue)}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikSelectField}
                    searchable
                    withFocus
                    multiple
                  >
                    {[
                      <option key="UNDEFINED" value="UNDEFINED">{I18n.t('COMMON.OTHER')}</option>,
                      ...Object.keys(countries)
                        .map(country => (
                          <option key={country} value={country}>{countries[country]}</option>
                        )),
                    ]}
                  </Field>

                  <Field
                    name="salesStatuses"
                    className="ClientsGridFilter__field ClientsGridFilter__select"
                    label={I18n.t(attributeLabels.salesStatuses)}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikSelectField}
                    disabled={isAcquisitionStatusesLoading}
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
                    name="retentionStatuses"
                    className="ClientsGridFilter__field ClientsGridFilter__select"
                    label={I18n.t(attributeLabels.retentionStatuses)}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikSelectField}
                    disabled={isAcquisitionStatusesLoading}
                    searchable
                    withFocus
                    multiple
                  >
                    {retentionStatuses.map(({ status }) => (
                      <option key={status} value={status}>
                        {I18n.t(staticRetentionStatuses[status])}
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
                    name="kycStatuses"
                    className="ClientsGridFilter__field ClientsGridFilter__select"
                    label={I18n.t(attributeLabels.kycStatuses)}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikSelectField}
                    searchable
                    withFocus
                    multiple
                  >
                    {Object.keys(kycStatusesLabels).map(status => (
                      <option key={status} value={status}>
                        {I18n.t(kycStatusesLabels[status as kycStatuses])}
                      </option>
                    ))}
                  </Field>

                  <Field
                    name="firstTimeDeposit"
                    className="ClientsGridFilter__field ClientsGridFilter__select"
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

                  <Field
                    name="warnings"
                    className="ClientsGridFilter__field ClientsGridFilter__select"
                    label={I18n.t(attributeLabels.warnings)}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                    component={FormikSelectField}
                    withAnyOption
                    withFocus
                  >
                    {Object.keys(warningLabels).map(warning => (
                      <option key={warning} value={warning}>
                        {I18n.t(warningLabels[warning as warningValues])}
                      </option>
                    ))}
                  </Field>

                  <RangeGroup
                    name="balanceRange"
                    className="ClientsGridFilter__field ClientsGridFilter__range-inputs"
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
                      withFocus
                    />
                  </RangeGroup>

                  <RangeGroup
                    name="depositsCountRange"
                    className="ClientsGridFilter__field ClientsGridFilter__range-inputs"
                    label={I18n.t(attributeLabels.deposit)}
                  >
                    <Field
                      name="depositsCountRange.from"
                      type="number"
                      placeholder="0"
                      min={0}
                      component={FormikInputField}
                      className="ClientsGridFilter__field"
                      withFocus
                    />
                    <Field
                      name="depositsCountRange.to"
                      type="number"
                      min={0}
                      placeholder="0"
                      component={FormikInputField}
                      className="ClientsGridFilter__field"
                      withFocus
                    />
                  </RangeGroup>

                  <Field
                    name="isNeverCalled"
                    className="ClientsGridFilter__field ClientsGridFilter__select"
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
                    component={TimeZoneField}
                  />

                  <Field
                    name="registrationDateRange"
                    className="ClientsGridFilter__field ClientsGridFilter__date-range"
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
                    label={I18n.t(attributeLabels.lastCallDateRange)}
                    component={FormikDateRangePicker}
                    fieldsNames={{
                      from: 'lastCallDateRange.from',
                      to: 'lastCallDateRange.to',
                    }}
                    withFocus
                  />

                  <Field
                    name="searchLimit"
                    type="number"
                    className="ClientsGridFilter__field ClientsGridFilter__search-limit"
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
                    />

                    <Button
                      onClick={handleReset}
                      className="ClientsGridFilter__button"
                      disabled={clientsLoading || isSubmitting || !Object.keys(values).length}
                      primary
                    >
                      {I18n.t('COMMON.RESET')}
                    </Button>

                    <Button
                      type="submit"
                      className="ClientsGridFilter__button"
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

export default compose(
  React.memo,
  withStorage(['auth', 'isOldClientsGridFilterPanel']),
)(ClientsGridFilter);
