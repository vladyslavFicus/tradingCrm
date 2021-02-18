import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import { intersection } from 'lodash';
import classNames from 'classnames';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import { getAvailableLanguages } from 'config';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import { statusesLabels } from 'constants/user';
import { statuses as operatorsStasuses } from 'constants/operators';
import { salesStatuses } from 'constants/salesStatuses';
import { retentionStatuses } from 'constants/retentionStatuses';
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
import countries from 'utils/countryList';
import { createValidator, translateLabels } from 'utils/validator';
import DesksAndTeamsQuery from './graphql/DesksAndTeamsQuery';
import OperatorsQuery from './graphql/OperatorsQuery';
import PartnersQuery from './graphql/PartnersQuery';
import {
  MAX_SELECTED_CLIENTS,
  acquisitionStatuses,
  activityStatuses,
  attributeLabels,
  assignStatuses,
  radioSelect,
} from '../../constants';
import './ClientsGridFilter.scss';

class ClientsGridFilter extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
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
    const { history, location: { state } } = this.props;

    history.replace({
      state: {
        ...state,
        filters: decodeNullValues(values),
      },
    });
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

  render() {
    const {
      location: { state },
      auth: { role, department },
      clientsLoading,
      partnersQuery,
      handleRefetch,
      desksAndTeamsQuery,
      partnersQuery: { loading: isPartnersLoading },
      operatorsQuery: { loading: isOperatorsLoading },
      desksAndTeamsQuery: { loading: isDesksAndTeamsLoading },
    } = this.props;

    const desks = desksAndTeamsQuery.data?.userBranches?.DESK || [];
    const teams = desksAndTeamsQuery.data?.userBranches?.TEAM || [];
    const partners = partnersQuery.data?.partners?.content || [];

    return (
      <FiltersToggler>
        <Formik
          enableReinitialize
          onSubmit={this.handleSubmit}
          onReset={this.handleReset}
          initialValues={state?.filters || {}}
          validate={createValidator({
            searchLimit: ['numeric', 'greater:0', `max:${MAX_SELECTED_CLIENTS}`],
          }, translateLabels(attributeLabels))}
        >
          {({ values, setValues, handleReset, handleSubmit, isSubmitting, dirty }) => {
            const desksUuids = values.desks || [];
            const teamsByDesks = teams.filter(team => desksUuids.includes(team.parentBranch.uuid));
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
              >
                <Form className="ClientsGridFilter__form">
                  <div className="ClientsGridFilter__fields">
                    <Field
                      name="searchByIdentifiers"
                      className="ClientsGridFilter__field ClientsGridFilter__search"
                      label={I18n.t(attributeLabels.searchByIdentifiers)}
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
                      name="desks"
                      className="ClientsGridFilter__field ClientsGridFilter__select"
                      label={I18n.t(attributeLabels.desks)}
                      placeholder={
                        I18n.t(
                          (!isDesksAndTeamsLoading && desks.length === 0)
                            ? 'COMMON.SELECT_OPTION.NO_ITEMS'
                            : 'COMMON.SELECT_OPTION.ANY',
                        )
                      }
                      component={FormikSelectField}
                      disabled={isDesksAndTeamsLoading || desks.length === 0}
                      searchable
                      withFocus
                      multiple
                    >
                      {desks.map(({ uuid, name }) => (
                        <option key={uuid} value={uuid}>{name}</option>
                      ))}
                    </Field>

                    <Field
                      name="teams"
                      className="ClientsGridFilter__field ClientsGridFilter__select"
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
                      className="ClientsGridFilter__field ClientsGridFilter__select"
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
                        className="ClientsGridFilter__field ClientsGridFilter__select"
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
                      className="ClientsGridFilter__field ClientsGridFilter__select"
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
                      className="ClientsGridFilter__field ClientsGridFilter__select"
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
                      name="salesStatuses"
                      className="ClientsGridFilter__field ClientsGridFilter__select"
                      label={I18n.t(attributeLabels.salesStatuses)}
                      placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                      component={FormikSelectField}
                      searchable
                      withFocus
                      multiple
                    >
                      {Object.keys(salesStatuses).map(status => (
                        <option key={status} value={status}>
                          {I18n.t(salesStatuses[status])}
                        </option>
                      ))}
                    </Field>

                    <Field
                      name="retentionStatuses"
                      className="ClientsGridFilter__field ClientsGridFilter__select"
                      label={I18n.t(attributeLabels.retentionStatuses)}
                      placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                      component={FormikSelectField}
                      searchable
                      withFocus
                      multiple
                    >
                      {Object.keys(retentionStatuses).map(status => (
                        <option key={status} value={status}>
                          {I18n.t(retentionStatuses[status])}
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
                          {I18n.t(kycStatusesLabels[status])}
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
                      className="ClientsGridFilter__field ClientsGridFilter__select"
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
                      className="ClientsGridFilter__field ClientsGridFilter__range-inputs"
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
                      className="ClientsGridFilter__field ClientsGridFilter__date-range"
                      label={I18n.t(attributeLabels.registrationDate)}
                      component={FormikDateRangePicker}
                      fieldsNames={{
                        from: 'registrationDateRange.from',
                        to: 'registrationDateRange.to',
                      }}
                      anchorDirection="right"
                      withFocus
                    />

                    <Field
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
                      className="ClientsGridFilter__field ClientsGridFilter__date-range"
                      label={I18n.t(attributeLabels.firstNoteDateRange)}
                      component={FormikDateRangePicker}
                      fieldsNames={{
                        from: 'firstNoteDateRange.from',
                        to: 'firstNoteDateRange.to',
                      }}
                      withFocus
                    />

                    <Field
                      className="ClientsGridFilter__field ClientsGridFilter__date-range"
                      label={I18n.t(attributeLabels.lastNoteDateRange)}
                      component={FormikDateRangePicker}
                      fieldsNames={{
                        from: 'lastNoteDateRange.from',
                        to: 'lastNoteDateRange.to',
                      }}
                      anchorDirection="right"
                      withFocus
                    />

                    <Field
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
                      className="ClientsGridFilter__field ClientsGridFilter__date-range"
                      label={I18n.t(attributeLabels.lastLoginDateRange)}
                      component={FormikDateRangePicker}
                      fieldsNames={{
                        from: 'lastLoginDateRange.from',
                        to: 'lastLoginDateRange.to',
                      }}
                      withFocus
                    />

                    <Field
                      className="ClientsGridFilter__field ClientsGridFilter__date-range"
                      label={I18n.t(attributeLabels.lastModificationDateRange)}
                      component={FormikDateRangePicker}
                      fieldsNames={{
                        from: 'lastModificationDateRange.from',
                        to: 'lastModificationDateRange.to',
                      }}
                      anchorDirection="right"
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
                    <FilterSetsDecorator.Buttons />
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
  }
}

export default compose(
  withStorage(['auth']),
  withRouter,
  withRequests({
    desksAndTeamsQuery: DesksAndTeamsQuery,
    operatorsQuery: OperatorsQuery,
    partnersQuery: PartnersQuery,
  }),
)(ClientsGridFilter);
