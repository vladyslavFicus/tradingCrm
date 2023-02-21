import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import compose from 'compose-function';
import { intersection, sortBy } from 'lodash';
import classNames from 'classnames';
import { Formik, Form, Field } from 'formik';
import Trackify from '@hrzn/trackify';
import I18n from 'i18n-js';
import { isSales, isRetention, userTypes } from 'constants/hierarchyTypes';
import { getAvailableLanguages, getBrand } from 'config';
import { State } from 'types';
import permissions from 'config/permissions';
import { statuses, statusesLabels } from 'constants/user';
import { statuses as operatorsStatuses } from 'constants/operators';
import { salesStatuses as staticSalesStatuses } from 'constants/salesStatuses';
import { retentionStatuses as staticRetentionStatuses } from 'constants/retentionStatuses';
import { kycStatuses, kycStatusesLabels } from 'constants/kycStatuses';
import { warningLabels, warningValues } from 'constants/warnings';
import { filterSetTypes } from 'constants/filterSet';
import { withStorage } from 'providers/StorageProvider';
import { ClientSearch__Input as ClientSearch } from '__generated__/types';
import {
  FormikInputField,
  FormikSelectField,
  FormikDateRangePicker,
} from 'components/Formik';
import { RangeGroup } from 'components/Forms';
import { decodeNullValues } from 'components/Formik/utils';
import FiltersToggler from 'components/FiltersToggler';
import FilterSetsDecorator, { FilterSetsButtons } from 'components/FilterSetsDecorator';
import { Button, RefreshButton } from 'components/Buttons';
import ReactSwitch from 'components/ReactSwitch';
import countries from 'utils/countryList';
import { createValidator, translateLabels } from 'utils/validator';
import { usePermission } from 'providers/PermissionsProvider';
import {
  MAX_SELECTED_CLIENTS,
  acquisitionStatuses,
  activityStatuses,
  attributeLabels,
  assignStatuses,
  radioSelect,
  PARTNERS_SORT,
  OPERATORS_SORT,
} from '../../constants';
import { useDesksAndTeamsQuery } from './graphql/__generated__/DesksAndTeamsQuery';
import { useAcquisitionStatusesQuery } from './graphql/__generated__/AcquisitionStatusesQuery';
import { PartnersQueryVariables, usePartnersQuery } from './graphql/__generated__/PartnersQuery';
import { useOperatorsQuery } from './graphql/__generated__/OperatorsQuery';
import './ClientsGridOldFilter.scss';

type Auth = {
  department: string,
  role: string,
  uuid: string,
};

type Props = {
  auth: Auth,
  storage: Storage,
  clientsLoading: boolean,
  handleRefetch: () => void,
};

const ClientsGridOldFilter = (props: Props) => {
  const {
    auth: { role, department },
    storage,
    clientsLoading,
    handleRefetch,
  } = props;

  const { state } = useLocation<State<ClientSearch>>();
  const history = useHistory();
  const permission = usePermission();

  const { data: desksAndTeamsData, loading: isDesksAndTeamsLoading } = useDesksAndTeamsQuery();
  const { data: acquisitionStatusesData, loading: isAcquisitionStatusesLoading } = useAcquisitionStatusesQuery({
    variables: { brandId: getBrand().id },
  });

  const { data: partnersData, loading: isPartnersLoading } = usePartnersQuery({
    variables: {
      ...state?.filters as PartnersQueryVariables,
      page: { sorts: PARTNERS_SORT },
    },
    fetchPolicy: 'cache-and-network',
  });

  const { data: operatorsData, loading: isOperatorsLoading } = useOperatorsQuery({
    variables: { page: { sorts: OPERATORS_SORT } },
  });
  const operators = operatorsData?.operators?.content || [];


  const filterOperatorsByBranch = (uuids: Array<string | null>) => (
    operators.filter((operator) => {
      const partnerBranches = operator.hierarchy?.parentBranches || [];
      const branches = partnerBranches.map(({ uuid }) => uuid);

      return intersection(branches, uuids).length;
    })
  );

  const filterOperators = ({ desks, teams }: ClientSearch) => {
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

  const handleSubmit = (values: ClientSearch) => {
    // Need here to store filters fields in browser history and persistent storage if user switched to new filter panel
    // all applied filters fields should be rendered in new filter panel
    const filtersFields = Object.keys(values);

    history.replace({
      state: {
        ...state,
        filters: decodeNullValues(values),
        filtersFields,
      },
    });

    storage.set('clientsGridFilterFields', filtersFields);
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
  const handleToggleFilterPanel = (enabled: boolean) => {
    Trackify.click('CLIENTS_GRID_SWITCH_TO_OLD_FILTER_PANEL', { eventValue: enabled.toString() });

    storage.set('isOldClientsGridFilterPanel', enabled);
  };

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
              submitFilters={(filterSetValues: ClientSearch) => {
                setValues(filterSetValues);
                onSubmit();
              }}
              renderBefore={(
                <ReactSwitch
                  on
                  stopPropagation
                  className="ClientsGridOldFilter__old-filters"
                  label={I18n.t('COMMON.BUTTONS.OLD_FILTERS')}
                  labelPosition="bottom"
                  onClick={handleToggleFilterPanel}
                />
                )}
            >
              <Form className="ClientsGridOldFilter__form">
                <div className="ClientsGridOldFilter__fields">
                  <Field
                    name="searchByIdentifiers"
                    className="ClientsGridOldFilter__field ClientsGridOldFilter__search"
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
                    className="ClientsGridOldFilter__field ClientsGridOldFilter__search"
                    label={I18n.t(attributeLabels.searchByAffiliateIdentifiers)}
                    placeholder={I18n.t('COMMON.SEARCH_BY.AFFILIATE')}
                    addition={<i className="icon icon-search" />}
                    component={FormikInputField}
                    maxLength={200}
                    withFocus
                  />

                  <Field
                    name="migrationId"
                    className="ClientsGridOldFilter__field ClientsGridOldFilter__migration-id"
                    label={I18n.t(attributeLabels.migrationId)}
                    placeholder={I18n.t('COMMON.SEARCH_BY.MIGRATION_ID')}
                    addition={<i className="icon icon-search" />}
                    component={FormikInputField}
                    maxLength={200}
                    withFocus
                  />

                  <Field
                    name="activityStatus"
                    className="ClientsGridOldFilter__field ClientsGridOldFilter__select"
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
                    className="ClientsGridOldFilter__field ClientsGridOldFilter__select"
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
                    className="ClientsGridOldFilter__field ClientsGridOldFilter__select"
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
                    className="ClientsGridOldFilter__field ClientsGridOldFilter__select"
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
                    className="ClientsGridOldFilter__field ClientsGridOldFilter__select"
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
                    className="ClientsGridOldFilter__field ClientsGridOldFilter__select"
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
                        className={classNames('ClientsGridOldFilter__select-option', {
                          'ClientsGridOldFilter__select-option--inactive':
                              operatorStatus === operatorsStatuses.INACTIVE
                              || operatorStatus === operatorsStatuses.CLOSED,
                        })}
                      >
                        {fullName}
                      </option>
                    ))}
                  </Field>

                  <Field
                    name="salesOperators"
                    className="ClientsGridOldFilter__field ClientsGridOldFilter__select"
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
                        className={classNames('ClientsGridOldFilter__select-option', {
                          'ClientsGridOldFilter__select-option--inactive': (
                            operatorStatus === operatorsStatuses.INACTIVE
                              || operatorStatus === operatorsStatuses.CLOSED
                          ),
                        })}
                      >
                        {fullName}
                      </option>
                    ))}
                  </Field>

                  <Field
                    name="retentionOperators"
                    className="ClientsGridOldFilter__field ClientsGridOldFilter__select"
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
                        className={classNames('ClientsGridOldFilter__select-option', {
                          'ClientsGridOldFilter__select-option--inactive': (
                            operatorStatus === operatorsStatuses.INACTIVE
                              || operatorStatus === operatorsStatuses.CLOSED
                          ),
                        })}
                      >
                        {fullName}
                      </option>
                    ))}
                  </Field>

                  <If condition={permission.allows(permissions.PARTNERS.PARTNERS_LIST_VIEW)}>
                    <Field
                      name="affiliateUuids"
                      className="ClientsGridOldFilter__field ClientsGridOldFilter__select"
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
                            className={classNames('ClientsGridOldFilter__select-option', {
                              'ClientsGridOldFilter__select-option--inactive':
                                  ['INACTIVE', 'CLOSED'].includes(status),
                            })}
                          >
                            {fullName}
                          </option>
                        ))
                        }
                    </Field>
                  </If>

                  <Field
                    name="isReferrered"
                    className="ClientsGridOldFilter__field ClientsGridOldFilter__select"
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
                    className="ClientsGridOldFilter__field ClientsGridOldFilter__select"
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
                    className="ClientsGridOldFilter__field ClientsGridOldFilter__select"
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
                    className="ClientsGridOldFilter__field ClientsGridOldFilter__select"
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
                    className="ClientsGridOldFilter__field ClientsGridOldFilter__select"
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
                    className="ClientsGridOldFilter__field ClientsGridOldFilter__select"
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
                    className="ClientsGridOldFilter__field ClientsGridOldFilter__select"
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
                    className="ClientsGridOldFilter__field ClientsGridOldFilter__select"
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
                    className="ClientsGridOldFilter__field ClientsGridOldFilter__select"
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
                    className="ClientsGridOldFilter__field ClientsGridOldFilter__range-inputs"
                    label={I18n.t(attributeLabels.balance)}
                  >
                    <Field
                      name="balanceRange.from"
                      type="number"
                      step="0.01"
                      min={0}
                      placeholder="0.0"
                      component={FormikInputField}
                      className="ClientsGridOldFilter__field"
                      withFocus
                    />
                    <Field
                      name="balanceRange.to"
                      type="number"
                      step="0.01"
                      min={0}
                      placeholder="0.0"
                      component={FormikInputField}
                      className="ClientsGridOldFilter__field"
                      withFocus
                    />
                  </RangeGroup>

                  <RangeGroup
                    className="ClientsGridOldFilter__field ClientsGridOldFilter__range-inputs"
                    label={I18n.t(attributeLabels.deposit)}
                  >
                    <Field
                      name="depositsCountRange.from"
                      type="number"
                      placeholder="0"
                      min={0}
                      component={FormikInputField}
                      className="ClientsGridOldFilter__field"
                      withFocus
                    />
                    <Field
                      name="depositsCountRange.to"
                      type="number"
                      min={0}
                      placeholder="0"
                      component={FormikInputField}
                      className="ClientsGridOldFilter__field"
                      withFocus
                    />
                  </RangeGroup>

                  <Field
                    name="registrationDateRange"
                    className="ClientsGridOldFilter__field ClientsGridOldFilter__date-range"
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
                    className="ClientsGridOldFilter__field ClientsGridOldFilter__date-range"
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
                    className="ClientsGridOldFilter__field ClientsGridOldFilter__date-range"
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
                    className="ClientsGridOldFilter__field ClientsGridOldFilter__date-range"
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
                    className="ClientsGridOldFilter__field ClientsGridOldFilter__date-range"
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
                    className="ClientsGridOldFilter__field ClientsGridOldFilter__date-range"
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
                    className="ClientsGridOldFilter__field ClientsGridOldFilter__date-range"
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
                    className="ClientsGridOldFilter__field ClientsGridOldFilter__date-range"
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
                    className="ClientsGridOldFilter__field ClientsGridOldFilter__date-range"
                    label={I18n.t(attributeLabels.lastCallDateRange)}
                    component={FormikDateRangePicker}
                    fieldsNames={{
                      from: 'lastCallDateRange.from',
                      to: 'lastCallDateRange.to',
                    }}
                    anchorDirection="right"
                    withFocus
                  />

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
                    name="searchLimit"
                    type="number"
                    className="ClientsGridOldFilter__field ClientsGridOldFilter__search-limit"
                    label={I18n.t(attributeLabels.searchLimit)}
                    placeholder={I18n.t('COMMON.UNLIMITED')}
                    component={FormikInputField}
                    min={0}
                    withFocus
                  />
                </div>

                <div className="ClientsGridOldFilter__buttons">
                  <FilterSetsButtons />

                  <div className="ClientsGridOldFilter__buttons-group">
                    <RefreshButton
                      onClick={handleRefetch}
                      className="ClientsGridOldFilter__button"
                    />

                    <Button
                      onClick={handleReset}
                      className="ClientsGridOldFilter__button"
                      disabled={clientsLoading || isSubmitting || !Object.keys(values).length}
                      primary
                    >
                      {I18n.t('COMMON.RESET')}
                    </Button>

                    <Button
                      type="submit"
                      className="ClientsGridOldFilter__button"
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
  withStorage(['auth']),
)(ClientsGridOldFilter);
