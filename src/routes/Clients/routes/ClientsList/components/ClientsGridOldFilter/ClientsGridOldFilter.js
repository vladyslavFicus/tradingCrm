import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import compose from 'compose-function';
import { intersection, sortBy } from 'lodash';
import classNames from 'classnames';
import { Formik, Form, Field } from 'formik';
import Trackify from '@hrzn/trackify';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import { getAvailableLanguages } from 'config';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import { statusesLabels } from 'constants/user';
import { statuses as operatorsStasuses } from 'constants/operators';
import { salesStatuses as staticSalesStatuses } from 'constants/salesStatuses';
import { retentionStatuses as staticRetentionStatuses } from 'constants/retentionStatuses';
import { kycStatusesLabels } from 'constants/kycStatuses';
import { warningLabels } from 'constants/warnings';
import { filterSetTypes } from 'constants/filterSet';
import { withStorage } from 'providers/StorageProvider';
import {
  FormikInputField,
  FormikSelectField,
  FormikDateRangePicker,
} from 'components/Formik';
import { RangeGroup } from 'components/Forms';
import { decodeNullValues } from 'components/Formik/utils';
import FiltersToggler from 'components/FiltersToggler';
import FilterSetsDecorator from 'components/FilterSetsDecorator';
import { Button, RefreshButton } from 'components/UI';
import PermissionContent from 'components/PermissionContent';
import ReactSwitch from 'components/ReactSwitch';
import countries from 'utils/countryList';
import { createValidator, translateLabels } from 'utils/validator';
import {
  MAX_SELECTED_CLIENTS,
  acquisitionStatuses,
  activityStatuses,
  attributeLabels,
  assignStatuses,
  radioSelect,
} from '../../constants';
import DesksAndTeamsQuery from './graphql/DesksAndTeamsQuery';
import OperatorsQuery from './graphql/OperatorsQuery';
import PartnersQuery from './graphql/PartnersQuery';
import AcquisitionStatusesQuery from './graphql/AcquisitionStatusesQuery';
import './ClientsGridOldFilter.scss';

class ClientsGridOldFilter extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    ...withStorage.propTypes,
    auth: PropTypes.auth.isRequired,
    clientsLoading: PropTypes.bool.isRequired,
    desksAndTeamsQuery: PropTypes.query({
      hierarchy: PropTypes.shape({
        TEAM: PropTypes.arrayOf(PropTypes.hierarchyBranch),
        DESK: PropTypes.arrayOf(PropTypes.hierarchyBranch),
      }),
    }).isRequired,
    operatorsQuery: PropTypes.query({
      operators: PropTypes.pageable(PropTypes.operator),
    }).isRequired,
    partnersQuery: PropTypes.query({
      partners: PropTypes.pageable(PropTypes.partner),
    }).isRequired,
    acquisitionStatusesQuery: PropTypes.query({
      settings: PropTypes.shape({
        acquisitionStatuses: PropTypes.arrayOf(
          PropTypes.shape({
            type: PropTypes.string.isRequired,
            status: PropTypes.string.isRequired,
          }),
        ),
      }),
    }).isRequired,
    handleRefetch: PropTypes.func.isRequired,
  };

  filterOperatorsByBranch = ({ operators, uuids }) => (
    operators.filter((operator) => {
      const partnerBranches = operator.hierarchy?.parentBranches || [];
      const branches = partnerBranches.map(({ uuid }) => uuid);

      return intersection(branches, uuids).length;
    })
  )

  filterOperators = ({ desks, teams }) => {
    const {
      operatorsQuery,
      desksAndTeamsQuery,
    } = this.props;

    const operators = operatorsQuery.data?.operators?.content || [];

    if (teams && teams.length) {
      return this.filterOperatorsByBranch({ operators, uuids: teams });
    }

    if (desks && desks.length) {
      // If desk chosen -> find all teams of these desks to filter operators
      const teamsList = desksAndTeamsQuery.data?.userBranches?.TEAM || [];
      const teamsByDesks = teamsList.filter(team => desks.includes(team.parentBranch.uuid)).map(({ uuid }) => uuid);
      const uuids = [...desks, ...teamsByDesks];

      return this.filterOperatorsByBranch({ operators, uuids });
    }

    return operators;
  }

  handleSubmit = (values) => {
    const { history, location: { state }, storage } = this.props;

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

  handleReset = () => {
    const {
      history,
      location: {
        state,
      },
      clientsLoading,
    } = this.props;

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
  handleToggleFilterPanel = (enabled) => {
    Trackify.click('CLIENTS_GRID_SWITCH_TO_OLD_FILTER_PANEL', { eventValue: enabled.toString() });

    this.props.storage.set('isOldClientsGridFilterPanel', enabled);
  };

  render() {
    const {
      location: { state },
      auth: { role, department },
      clientsLoading,
      handleRefetch,
      partnersQuery,
      desksAndTeamsQuery,
      acquisitionStatusesQuery,
      partnersQuery: { loading: isPartnersLoading },
      operatorsQuery: { loading: isOperatorsLoading },
      desksAndTeamsQuery: { loading: isDesksAndTeamsLoading },
      acquisitionStatusesQuery: { loading: isAcquisitionStatusesLoading },
    } = this.props;

    const desks = desksAndTeamsQuery.data?.userBranches?.DESK || [];
    const teams = desksAndTeamsQuery.data?.userBranches?.TEAM || [];
    const offices = desksAndTeamsQuery.data?.userBranches?.OFFICE || [];
    const partners = partnersQuery.data?.partners?.content || [];
    const salesStatuses = sortBy(acquisitionStatusesQuery.data?.settings.salesStatuses || [], 'status');
    const retentionStatuses = sortBy(acquisitionStatusesQuery.data?.settings.retentionStatuses || [], 'status');

    return (
      <FiltersToggler hideButton viewPortMarginTop={156}>
        <Formik
          enableReinitialize
          onSubmit={this.handleSubmit}
          initialValues={state?.filters || {}}
          validate={createValidator({
            searchLimit: ['numeric', 'greater:0', `max:${MAX_SELECTED_CLIENTS}`],
          }, translateLabels(attributeLabels))}
        >
          {({ values, setValues, handleSubmit, isSubmitting, dirty }) => {
            const desksUuids = values.desks || [];
            const officesUuids = values.offices || [];
            const desksByOffices = desks.filter(desk => officesUuids.includes(desk.parentBranch?.uuid));
            const teamsByDesks = teams.filter(team => desksUuids.includes(team.parentBranch?.uuid));
            const desksOptions = officesUuids.length ? desksByOffices : desks;
            const teamsOptions = desksUuids.length ? teamsByDesks : teams;
            const operatorsOptions = this.filterOperators(values);
            const languagesOptions = ['other', ...getAvailableLanguages()];

            return (
              <FilterSetsDecorator
                filterSetType={filterSetTypes.CLIENT}
                currentValues={values}
                disabled={clientsLoading}
                submitFilters={(filterSetValues) => {
                  setValues(filterSetValues);
                  handleSubmit();
                }}
                renderBefore={(
                  <ReactSwitch
                    on
                    stopPropagation
                    className="ClientsGridOldFilter__old-filters"
                    label={I18n.t('COMMON.BUTTONS.OLD_FILTERS')}
                    labelPosition="bottom"
                    onClick={this.handleToggleFilterPanel}
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
                          (!isDesksAndTeamsLoading && desksOptions.length === 0)
                            ? 'COMMON.SELECT_OPTION.NO_ITEMS'
                            : 'COMMON.SELECT_OPTION.ANY',
                        )
                      }
                      component={FormikSelectField}
                      disabled={isDesksAndTeamsLoading || desksOptions.length === 0}
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
                          (!isDesksAndTeamsLoading && teamsOptions.length === 0)
                            ? 'COMMON.SELECT_OPTION.NO_ITEMS'
                            : 'COMMON.SELECT_OPTION.ANY',
                        )
                      }
                      component={FormikSelectField}
                      disabled={isDesksAndTeamsLoading || teamsOptions.length === 0}
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
                          (!isOperatorsLoading && operatorsOptions.length === 0)
                            ? 'COMMON.SELECT_OPTION.NO_ITEMS'
                            : 'COMMON.SELECT_OPTION.ANY',
                        )
                      }
                      component={FormikSelectField}
                      disabled={isOperatorsLoading || operatorsOptions.length === 0}
                      searchable
                      withFocus
                      multiple
                    >
                      {operatorsOptions.map(({ uuid, fullName, operatorStatus }) => (
                        <option
                          key={uuid}
                          value={uuid}
                          className={classNames({
                            'color-inactive': operatorStatus === operatorsStasuses.INACTIVE
                              || operatorStatus === operatorsStasuses.CLOSED,
                          })}
                        >
                          {fullName}
                        </option>
                      ))}
                    </Field>

                    <PermissionContent permissions={permissions.PARTNERS.PARTNERS_LIST_VIEW}>
                      <Field
                        name="affiliateUuids"
                        className="ClientsGridOldFilter__field ClientsGridOldFilter__select"
                        label={I18n.t(attributeLabels.affiliateUuids)}
                        placeholder={
                          I18n.t(
                            (!isPartnersLoading && partners.length === 0)
                              ? 'COMMON.SELECT_OPTION.NO_ITEMS'
                              : 'COMMON.SELECT_OPTION.ANY',
                          )
                        }
                        component={FormikSelectField}
                        disabled={isPartnersLoading || partners.length === 0}
                        searchable
                        withFocus
                        multiple
                      >
                        {[{ uuid: 'NONE', fullName: 'NONE' }, ...partners].map(({ uuid, fullName }) => (
                          <option key={uuid} value={uuid}>
                            {fullName}
                          </option>
                        ))}
                      </Field>
                    </PermissionContent>

                    <Field
                      name="isReferrered"
                      className="ClientsGridOldFilter__field ClientsGridOldFilter__select"
                      label={I18n.t(attributeLabels.isReferrered)}
                      placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                      component={FormikSelectField}
                      withAnyOption
                      withFocus
                      boolean
                    >
                      {radioSelect.map(({ value, label }) => (
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
                          {I18n.t(statusesLabels[status])}
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
                      boolean
                    >
                      {radioSelect.map(({ value, label }) => (
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
                        className="ClientsGridOldFilter__field ClientsGridOldFilter__select"
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
                          {I18n.t(kycStatusesLabels[status])}
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
                      boolean
                    >
                      {radioSelect.map(({ value, label }) => (
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
                          {I18n.t(warningLabels[warning])}
                        </option>
                      ))}
                    </Field>

                    <RangeGroup
                      name="balanceRange"
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
                        withFocus
                      />
                      <Field
                        name="balanceRange.to"
                        type="number"
                        step="0.01"
                        min={0}
                        placeholder="0.0"
                        component={FormikInputField}
                        withFocus
                      />
                    </RangeGroup>

                    <RangeGroup
                      name="depositsCountRange"
                      className="ClientsGridOldFilter__field ClientsGridOldFilter__range-inputs"
                      label={I18n.t(attributeLabels.deposit)}
                    >
                      <Field
                        name="depositsCountRange.from"
                        type="number"
                        placeholder="0"
                        min={0}
                        component={FormikInputField}
                        withFocus
                      />
                      <Field
                        name="depositsCountRange.to"
                        type="number"
                        min={0}
                        placeholder="0"
                        component={FormikInputField}
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
                    <FilterSetsDecorator.Buttons />
                    <div className="ClientsGridOldFilter__buttons-group">
                      <RefreshButton
                        onClick={handleRefetch}
                        className="ClientsGridOldFilter__button"
                      />

                      <Button
                        onClick={this.handleReset}
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
  }
}

export default compose(
  withStorage(['auth']),
  withRouter,
  withRequests({
    desksAndTeamsQuery: DesksAndTeamsQuery,
    operatorsQuery: OperatorsQuery,
    partnersQuery: PartnersQuery,
    acquisitionStatusesQuery: AcquisitionStatusesQuery,
  }),
)(ClientsGridOldFilter);
