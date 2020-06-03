import React, { PureComponent } from 'react';
import { compose, withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { omit, get } from 'lodash';
import I18n from 'i18n-js';
import { withFormik, Form, Field } from 'formik';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import { salesStatuses } from 'constants/salesStatuses';
import { statuses as operatorsStasuses } from 'constants/operators';
import { FormikInputField, FormikSelectField, FormikDateRangePicker } from 'components/Formik';
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
  countries: 'LEADS.FILTER.COUNTRIES',
  desks: 'LEADS.FILTER.DESKS',
  teams: 'LEADS.FILTER.TEAMS',
  salesAgents: 'LEADS.FILTER.SALES_AGENTS',
  salesStatuses: 'LEADS.FILTER.SALES_STATUS',
  status: 'LEADS.FILTER.ACCOUNT_STATUS',
  registrationDateRange: 'LEADS.FILTER.REGISTRATION_DATE_RANGE',
  lastNoteDateRange: 'LEADS.FILTER.LAST_NOTE_DATE_RANGE',
  size: 'COMMON.FILTERS.SEARCH_LIMIT',
};

class LeadsGridFilter extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    isSubmitting: PropTypes.bool.isRequired,
    resetForm: PropTypes.func.isRequired,
    initialValues: PropTypes.objectOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
    ).isRequired,
    values: PropTypes.objectOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
    ).isRequired,
    desksAndTeamsData: PropTypes.query({
      hierarchy: PropTypes.shape({
        data: PropTypes.shape({
          TEAM: PropTypes.arrayOf(PropTypes.hierarchyBranch),
          DESK: PropTypes.arrayOf(PropTypes.hierarchyBranch),
        }),
        error: PropTypes.object,
      }),
    }).isRequired,
    operatorsData: PropTypes.query({
      operators: PropTypes.response({
        content: PropTypes.arrayOf(
          PropTypes.shape({
            uuid: PropTypes.string,
            fullName: PropTypes.string,
            operatorStatus: PropTypes.string,
            parentBranches: PropTypes.shape({
              branchType: PropTypes.string,
              uuid: PropTypes.string,
            }),
          }),
        ),
      }),
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

  filterOperatorsByBranch = ({ operators, branchType, uuids }) => (
    operators.filter((operator) => {
      const branches = get(operator, 'hierarchy.parentBranches') || [];

      return branches.reduce((_, currentBranch) => (
        currentBranch.branchType === branchType && uuids.includes(currentBranch.uuid)
      ), false);
    })
  )

  filterOperators = () => {
    const {
      operatorsData,
      values: { desks, teams },
    } = this.props;

    const operators = get(operatorsData, 'data.operators.data.content') || [];

    if (teams && teams.length) {
      return this.filterOperatorsByBranch({ operators, branchType: 'TEAM', uuids: teams });
    }

    if (desks && desks.length) {
      return this.filterOperatorsByBranch({ operators, branchType: 'DESK', uuids: desks });
    }

    return operators;
  }

  handleReset = () => {
    const { history, initialValues, resetForm } = this.props;

    history.replace({ query: { filters: {} } });
    resetForm(initialValues);
  };

  render() {
    const {
      values,
      isSubmitting,
      desksAndTeamsData,
      operatorsData: { loading: isOperatorsLoading },
      desksAndTeamsData: { loading: isDesksAndTeamsLoading },
    } = this.props;

    const desksUuids = values.desks || [];
    const desks = get(desksAndTeamsData, 'data.hierarchy.userBranchHierarchy.data.DESK') || [];
    const teams = get(desksAndTeamsData, 'data.hierarchy.userBranchHierarchy.data.TEAM') || [];
    const teamsByDesks = teams.filter(team => desksUuids.includes(team.parentBranch.uuid));
    const teamsOptions = desksUuids.length ? teamsByDesks : teams;
    const operatorsOptions = this.filterOperators();

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
            name="countries"
            className="LeadsGridFilter__field LeadsGridFilter__select"
            label={I18n.t(attributeLabels.countries)}
            placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
            component={FormikSelectField}
            multiple
            searchable
            withAnyOption
          >
            {Object.keys(countries).map(country => (
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
            withAnyOption
          >
            {Object.entries(this.leadsSalesStatuses).map(([key, value]) => (
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
            {Object.values(leadAccountStatuses).map(({ label, value }) => (
              <option key={value} value={value}>
                {I18n.t(label)}
              </option>
            ))}
          </Field>

          <Field
            className="LeadsGridFilter__field"
            label={I18n.t(attributeLabels.registrationDateRange)}
            component={FormikDateRangePicker}
            periodKeys={{
              start: 'registrationDateStart',
              end: 'registrationDateEnd',
            }}
            withTime
          />

          <Field
            className="LeadsGridFilter__field"
            label={I18n.t(attributeLabels.lastNoteDateRange)}
            component={FormikDateRangePicker}
            periodKeys={{
              start: 'lastNoteDateFrom',
              end: 'lastNoteDateTo',
            }}
            withTime
          />

          <Field
            name="size"
            type="number"
            className="LeadsGridFilter__field LeadsGridFilter__search-limit"
            label={I18n.t(attributeLabels.size)}
            placeholder={I18n.t('COMMON.UNLIMITED')}
            component={FormikInputField}
            min={0}
          />
        </div>

        <div className="LeadsGridFilter__buttons">
          <Button
            className="LeadsGridFilter__button"
            disabled={isSubmitting}
            onClick={this.handleReset}
            common
          >
            {I18n.t('COMMON.RESET')}
          </Button>

          <Button
            className="LeadsGridFilter__button"
            disabled={isSubmitting}
            type="submit"
            primary
          >
            {I18n.t('COMMON.APPLY')}
          </Button>
        </div>
      </Form>
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
  withFormik({
    mapPropsToValues: () => ({}),
    validate: values => createValidator({
      size: ['numeric', 'greater:0', 'max:10000'],
    }, translateLabels(attributeLabels))(values),
    handleSubmit: (values, { props, setSubmitting }) => {
      props.history.replace({
        query: {
          filters: decodeNullValues(values),
        },
      });
      setSubmitting(false);
    },
  }),
)(LeadsGridFilter);
