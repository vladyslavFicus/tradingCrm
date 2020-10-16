import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import { intersection } from 'lodash';
import { Field } from 'formik';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import { withStorage } from 'providers/StorageProvider';
import PropTypes from 'constants/propTypes';
import { statusesLabels } from 'constants/user';
import { statuses as operatorsStasuses } from 'constants/operators';
import { salesStatuses } from 'constants/salesStatuses';
import { retentionStatuses } from 'constants/retentionStatuses';
import { kycStatusesLabels } from 'constants/kycStatuses';
import { warningLabels } from 'constants/warnings';
import { filterSetTypes } from 'constants/filterSet';
import {
  FormikExtForm,
  FormikInputField,
  FormikSelectField,
  FormikDateRangeGroup,
} from 'components/Formik';
import { RangeGroup } from 'components/Forms';
import { decodeNullValues } from 'components/Formik/utils';
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
    const { history, location: { state } } = this.props;

    history.replace({
      state: {
        ...state,
        filters: null,
      },
    });
  };

  render() {
    const {
      location: { state },
      auth: { role, department },
      clientsLoading,
      partnersQuery,
      desksAndTeamsQuery,
      partnersQuery: { loading: isPartnersLoading },
      operatorsQuery: { loading: isOperatorsLoading },
      desksAndTeamsQuery: { loading: isDesksAndTeamsLoading },
    } = this.props;

    const desks = desksAndTeamsQuery.data?.userBranches?.DESK || [];
    const teams = desksAndTeamsQuery.data?.userBranches?.TEAM || [];
    const partners = partnersQuery.data?.partners?.content || [];

    return (
      <FormikExtForm
        enableReinitialize
        handleSubmit={this.handleSubmit}
        handleReset={this.handleReset}
        initialValues={state?.filters || {}}
        isDataLoading={clientsLoading}
        validate={createValidator({
          searchLimit: ['numeric', 'greater:0', `max:${MAX_SELECTED_CLIENTS}`],
        }, translateLabels(attributeLabels))}
        filterSetType={filterSetTypes.CLIENT}
      >
        {({ values }) => {
          const desksUuids = values.desks || [];
          const teamsByDesks = teams.filter(team => desksUuids.includes(team.parentBranch.uuid));
          const teamsOptions = desksUuids.length ? teamsByDesks : teams;
          const operatorsOptions = this.filterOperators(values);

          return (
            <div className="ClientsGridFilter__fields">
              <Field
                name="searchByIdentifiers"
                className="ClientsGridFilter__field ClientsGridFilter__search"
                label={I18n.t(attributeLabels.searchByIdentifiers)}
                placeholder={I18n.t('COMMON.SEARCH_BY.CLIENT')}
                addition={<i className="icon icon-search" />}
                component={FormikInputField}
                maxLength={200}
              />

              <Field
                name="searchByAffiliateIdentifiers"
                className="ClientsGridFilter__field ClientsGridFilter__search"
                label={I18n.t(attributeLabels.searchByAffiliateIdentifiers)}
                placeholder={I18n.t('COMMON.SEARCH_BY.AFFILIATE')}
                addition={<i className="icon icon-search" />}
                component={FormikInputField}
                maxLength={200}
              />

              <Field
                name="migrationId"
                className="ClientsGridFilter__field ClientsGridFilter__migration-id"
                label={I18n.t(attributeLabels.migrationId)}
                placeholder={I18n.t('COMMON.SEARCH_BY.MIGRATION_ID')}
                addition={<i className="icon icon-search" />}
                component={FormikInputField}
                maxLength={200}
              />

              <Field
                name="countries"
                className="ClientsGridFilter__field ClientsGridFilter__select"
                label={I18n.t(attributeLabels.countries)}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSelectField}
                multiple
                searchable
              >
                {Object.keys(countries)
                  .map(country => (
                    <option key={country} value={country}>{countries[country]}</option>
                  ))}
              </Field>

              <Field
                name="activityStatus"
                className="ClientsGridFilter__field ClientsGridFilter__select"
                label={I18n.t(attributeLabels.activityStatus)}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSelectField}
                withAnyOption
              >
                {activityStatuses.map(({ value, label }) => (
                  <option key={value} value={value}>{I18n.t(label)}</option>
                ))}
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
                multiple
                searchable
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
                multiple
                searchable
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
                multiple
                searchable
              >
                {operatorsOptions.map(({ uuid, fullName, operatorStatus }) => (
                  <option
                    key={uuid}
                    value={uuid}
                    disabled={operatorStatus === operatorsStasuses.INACTIVE
                    || operatorStatus === operatorsStasuses.CLOSED}
                  >
                    {fullName}
                  </option>
                ))}
              </Field>

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
                multiple
                searchable
              >
                {[{ uuid: 'NONE', fullName: 'NONE' }, ...partners].map(({ uuid, fullName }) => (
                  <option key={uuid} value={uuid}>
                    {fullName}
                  </option>
                ))}
              </Field>

              <Field
                name="isReferrered"
                className="ClientsGridFilter__field ClientsGridFilter__select"
                label={I18n.t(attributeLabels.isReferrered)}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSelectField}
                withAnyOption
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
                />
                <Field
                  name="balanceRange.to"
                  type="number"
                  step="0.01"
                  min={0}
                  placeholder="0.0"
                  component={FormikInputField}
                />
              </RangeGroup>

              <FormikDateRangeGroup
                className="ClientsGridFilter__field ClientsGridFilter__date-range"
                label={I18n.t(attributeLabels.registrationDate)}
                periodKeys={{
                  start: 'registrationDateRange.from',
                  end: 'registrationDateRange.to',
                }}
              />

              <FormikDateRangeGroup
                className="ClientsGridFilter__field ClientsGridFilter__date-range"
                label={I18n.t(attributeLabels.firstDepositDateRange)}
                periodKeys={{
                  start: 'firstDepositDateRange.from',
                  end: 'firstDepositDateRange.to',
                }}
              />

              <FormikDateRangeGroup
                className="ClientsGridFilter__field ClientsGridFilter__date-range"
                label={I18n.t(attributeLabels.firstNoteDateRange)}
                periodKeys={{
                  start: 'firstNoteDateRange.from',
                  end: 'firstNoteDateRange.to',
                }}
              />

              <FormikDateRangeGroup
                className="ClientsGridFilter__field ClientsGridFilter__date-range"
                label={I18n.t(attributeLabels.lastNoteDateRange)}
                periodKeys={{
                  start: 'lastNoteDateRange.from',
                  end: 'lastNoteDateRange.to',
                }}
              />

              <FormikDateRangeGroup
                className="ClientsGridFilter__field ClientsGridFilter__date-range"
                label={I18n.t(attributeLabels.lastTradeDateRange)}
                periodKeys={{
                  start: 'lastTradeDateRange.from',
                  end: 'lastTradeDateRange.to',
                }}
              />

              <FormikDateRangeGroup
                className="ClientsGridFilter__field ClientsGridFilter__date-range"
                label={I18n.t(attributeLabels.lastLoginDateRange)}
                periodKeys={{
                  start: 'lastLoginDateRange.from',
                  end: 'lastLoginDateRange.to',
                }}
              />

              <FormikDateRangeGroup
                className="ClientsGridFilter__field ClientsGridFilter__date-range"
                label={I18n.t(attributeLabels.lastModificationDateRange)}
                periodKeys={{
                  start: 'lastModificationDateRange.from',
                  end: 'lastModificationDateRange.to',
                }}
              />

              <Field
                name="searchLimit"
                type="number"
                className="ClientsGridFilter__field ClientsGridFilter__search-limit"
                label={I18n.t(attributeLabels.searchLimit)}
                placeholder={I18n.t('COMMON.UNLIMITED')}
                component={FormikInputField}
                min={0}
              />
            </div>
          );
        }}
      </FormikExtForm>
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