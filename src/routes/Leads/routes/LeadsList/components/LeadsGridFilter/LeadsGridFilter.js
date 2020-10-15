import React, { PureComponent } from 'react';
import { compose, withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { omit, get, intersection } from 'lodash';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { getAvailableLanguages } from 'config';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import { salesStatuses } from 'constants/salesStatuses';
import { statuses as operatorsStasuses } from 'constants/operators';
import { FormikInputField, FormikSelectField, FormikDateRangeGroup } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { Button } from 'components/UI';
import { createValidator, translateLabels } from 'utils/validator';
import countries from 'utils/countryList';
import DesksAndTeamsQuery from './graphql/DesksAndTeamsQuery';
import OperatorsQuery from './graphql/OperatorsQuery';
import { leadAccountStatuses } from '../../constants';
import './LeadsGridFilter.scss';

const attributeLabels = {
  searchKeyword: 'LEADS.FILTER.SEARCH',
  languages: 'LEADS.FILTER.LANGUAGES',
  countries: 'LEADS.FILTER.COUNTRIES',
  desks: 'LEADS.FILTER.DESKS',
  teams: 'LEADS.FILTER.TEAMS',
  salesAgents: 'LEADS.FILTER.SALES_AGENTS',
  salesStatuses: 'LEADS.FILTER.SALES_STATUS',
  status: 'LEADS.FILTER.ACCOUNT_STATUS',
  registrationDateRange: 'LEADS.FILTER.REGISTRATION_DATE_RANGE',
  lastNoteDateRange: 'LEADS.FILTER.LAST_NOTE_DATE_RANGE',
  searchLimit: 'COMMON.FILTERS.SEARCH_LIMIT',
};

class LeadsGridFilter extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    desksAndTeamsData: PropTypes.query({
      hierarchy: PropTypes.shape({
        TEAM: PropTypes.arrayOf(PropTypes.hierarchyBranch),
        DESK: PropTypes.arrayOf(PropTypes.hierarchyBranch),
      }),
    }).isRequired,
    operatorsData: PropTypes.query({
      operators: PropTypes.pageable(PropTypes.operator),
    }).isRequired,
  };

  get leadsSalesStatuses() {
    return omit(salesStatuses, [
      'DIALER_NA',
      'DIALER_NEW',
      'DIALER_ASSIGNED',
      'DIALER_FAILED',
      'DIALER_DROP',
    ]);
  }

  filterOperatorsByBranch = ({ operators, uuids }) => (
    operators.filter((operator) => {
      const branches = get(operator, 'hierarchy.parentBranches').map(({ uuid }) => uuid) || [];

      return intersection(branches, uuids).length;
    })
  )

  filterOperators = ({ desks, teams }) => {
    const {
      operatorsData,
      desksAndTeamsData,
    } = this.props;

    const operators = get(operatorsData, 'data.operators.content') || [];

    if (teams && teams.length) {
      return this.filterOperatorsByBranch({ operators, uuids: teams });
    }

    if (desks && desks.length) {
      // If desk chosen -> find all teams of these desks to filter operators
      const teamsList = get(desksAndTeamsData, 'data.userBranches.TEAM') || [];
      const teamsByDesks = teamsList.filter(team => desks.includes(team.parentBranch.uuid)).map(({ uuid }) => uuid);
      const uuids = [...desks, ...teamsByDesks];

      return this.filterOperatorsByBranch({ operators, uuids });
    }

    return operators;
  }

  handleSubmit = (values, { setSubmitting }) => {
    const { history, location: { state } } = this.props;

    history.replace({
      state: {
        ...state,
        filters: decodeNullValues(values),
      },
    });

    setSubmitting(false);
  };

  handleReset = (resetForm) => {
    const { history, location: { state } } = this.props;

    history.replace({
      state: {
        ...state,
        filters: null,
      },
    });

    resetForm({});
  };

  render() {
    const {
      desksAndTeamsData,
      operatorsData: { loading: isOperatorsLoading },
      desksAndTeamsData: { loading: isDesksAndTeamsLoading },
      location: { state },
    } = this.props;

    return (
      <Formik
        enableReinitialize
        initialValues={state?.filters || {}}
        onSubmit={this.handleSubmit}
        validate={createValidator({
          searchLimit: ['numeric', 'greater:0', 'max:5000'],
        }, translateLabels(attributeLabels))}
      >
        {({ values, isSubmitting, dirty, resetForm }) => {
          const desksUuids = values.desks || [];
          const desks = get(desksAndTeamsData, 'data.userBranches.DESK') || [];
          const teams = get(desksAndTeamsData, 'data.userBranches.TEAM') || [];
          const teamsByDesks = teams.filter(team => desksUuids.includes(team.parentBranch.uuid));
          const teamsOptions = desksUuids.length ? teamsByDesks : teams;
          const operatorsOptions = this.filterOperators(values);

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
                />

                <Field
                  name="languages"
                  className="LeadsGridFilter__field LeadsGridFilter__select"
                  label={I18n.t(attributeLabels.languages)}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                  component={FormikSelectField}
                  multiple
                  searchable
                >
                  {getAvailableLanguages().map(locale => (
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
                  multiple
                  searchable
                >
                  {Object.keys(countries)
                    .map(country => (
                      <option key={country} value={country}>{countries[country]}</option>
                    ))}
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
                  multiple
                  searchable
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
                  multiple
                  searchable
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
                  name="salesStatuses"
                  className="LeadsGridFilter__field LeadsGridFilter__select"
                  label={I18n.t(attributeLabels.salesStatuses)}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                  component={FormikSelectField}
                  searchable
                  multiple
                >
                  {Object.entries(this.leadsSalesStatuses)
                    .map(([key, value]) => (
                      <option key={key} value={key}>
                        {I18n.t(value)}
                      </option>
                    ))}
                </Field>

                <Field
                  name="status"
                  className="LeadsGridFilter__field LeadsGridFilter__select"
                  label={I18n.t(attributeLabels.status)}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                  component={FormikSelectField}
                  searchable
                  withAnyOption
                >
                  {Object.values(leadAccountStatuses)
                    .map(({ label, value }) => (
                      <option key={value} value={value}>
                        {I18n.t(label)}
                      </option>
                    ))}
                </Field>

                <FormikDateRangeGroup
                  className="LeadsGridFilter__field LeadsGridFilter__date-range"
                  label={I18n.t(attributeLabels.registrationDateRange)}
                  periodKeys={{
                    start: 'registrationDateStart',
                    end: 'registrationDateEnd',
                  }}
                />

                <FormikDateRangeGroup
                  className="LeadsGridFilter__field LeadsGridFilter__date-range"
                  label={I18n.t(attributeLabels.lastNoteDateRange)}
                  periodKeys={{
                    start: 'lastNoteDateFrom',
                    end: 'lastNoteDateTo',
                  }}
                />

                <Field
                  name="searchLimit"
                  type="number"
                  className="LeadsGridFilter__field LeadsGridFilter__search-limit"
                  label={I18n.t(attributeLabels.searchLimit)}
                  placeholder={I18n.t('COMMON.UNLIMITED')}
                  component={FormikInputField}
                  min={0}
                />
              </div>

              <div className="LeadsGridFilter__buttons">
                <Button
                  className="LeadsGridFilter__button"
                  disabled={isSubmitting}
                  onClick={() => this.handleReset(resetForm)}
                  common
                >
                  {I18n.t('COMMON.RESET')}
                </Button>

                <Button
                  className="LeadsGridFilter__button"
                  disabled={isSubmitting || !dirty}
                  type="submit"
                  primary
                >
                  {I18n.t('COMMON.APPLY')}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    );
  }
}

export default compose(
  withApollo,
  withRouter,
  withRequests({
    desksAndTeamsData: DesksAndTeamsQuery,
    operatorsData: OperatorsQuery,
  }),
)(LeadsGridFilter);
