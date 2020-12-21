import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import I18n from 'i18n-js';
import { intersection } from 'lodash';
import { Formik, Form, Field } from 'formik';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import formatLabel from 'utils/formatLabel';
import { decodeNullValues } from 'components/Formik/utils';
import { FormikDateRangeGroup, FormikInputField, FormikSelectField } from 'components/Formik';
import { Button, RefreshButton } from 'components/UI';
import NotificationTypesQuery from './graphql/NotificationTypesQuery';
import DesksAndTeamsQuery from './graphql/DesksAndTeamsQuery';
import OperatorsQuery from './graphql/OperatorsQuery';
import './NotificationsGridFilters.scss';

class NotificationsFilters extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    operatorsQuery: PropTypes.query({
      operators: PropTypes.pageable(PropTypes.operator),
    }).isRequired,
    desksAndTeamsQuery: PropTypes.query({
      hierarchy: PropTypes.shape({
        TEAM: PropTypes.arrayOf(PropTypes.hierarchyBranch),
        DESK: PropTypes.arrayOf(PropTypes.hierarchyBranch),
      }),
    }).isRequired,
    notificationTypesQuery: PropTypes.query({
      notificationCenterTypes: PropTypes.shape({
        ACCOUNT: PropTypes.arrayOf(PropTypes.string),
        CALLBACK: PropTypes.arrayOf(PropTypes.string),
        CLIENT: PropTypes.arrayOf(PropTypes.string),
        DEPOSIT: PropTypes.arrayOf(PropTypes.string),
        KYC: PropTypes.arrayOf(PropTypes.string),
        TRADING: PropTypes.arrayOf(PropTypes.string),
        WITHDRAWAL: PropTypes.arrayOf(PropTypes.string),
      }),
    }).isRequired,
    handleRefetch: PropTypes.func.isRequired,
  }

  filterOperatorsByBranch = ({ operators, uuids }) => (
    operators.filter((operator) => {
      const partnerBranches = operator.hierarchy?.parentBranches || [];
      const branches = partnerBranches.map(({ uuid }) => uuid);

      return intersection(branches, uuids).length;
    })
  )

  filterOperators = ({ operatorDesks, operatorTeams }) => {
    const {
      operatorsQuery,
      desksAndTeamsQuery,
    } = this.props;

    const operators = operatorsQuery.data?.operators?.content || [];

    if (operatorTeams && operatorTeams.length) {
      return this.filterOperatorsByBranch({ operators, uuids: operatorTeams });
    }

    if (operatorDesks && operatorDesks.length) {
      // If desk chosen -> find all teams of these desks to filter operators
      const teamsList = desksAndTeamsQuery.data?.userBranches?.TEAM || [];
      const teamsByDesks = teamsList
        .filter(team => operatorDesks.includes(team.parentBranch.uuid))
        .map(({ uuid }) => uuid);

      return this.filterOperatorsByBranch({ operators, uuids: [...operatorDesks, ...teamsByDesks] });
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

    resetForm();
  };

  render() {
    const {
      handleRefetch,
      location: { state },
      desksAndTeamsQuery,
      notificationTypesQuery,
      operatorsQuery: { loading: isOperatorsLoading },
      desksAndTeamsQuery: { loading: isDesksAndTeamsLoading },
      notificationTypesQuery: { loading: isNotificationTypesLoading },
    } = this.props;

    return (
      <Formik
        initialValues={state?.filters || {}}
        onSubmit={this.handleSubmit}
        enableReinitialize
      >
        {({ values, isSubmitting, resetForm, dirty }) => {
          const desksUuids = values.operatorDesks || [];
          const desks = desksAndTeamsQuery.data.userBranches?.DESK || [];
          const teams = desksAndTeamsQuery.data.userBranches?.TEAM || [];
          const teamsByDesks = teams.filter(team => desksUuids.includes(team.parentBranch.uuid));
          const teamsOptions = desksUuids.length ? teamsByDesks : teams;
          const operatorsOptions = this.filterOperators(values);
          const notificationTypesData = notificationTypesQuery.data?.notificationCenterTypes || {};
          const notificationTypes = Object.keys(notificationTypesData);
          const notificationSubtypes = (values.notificationTypes || notificationTypes)
            .map(type => notificationTypesData[type])
            .flat(Infinity);

          return (
            <Form className="NotificationsGridFilter__form">
              <div className="NotificationsGridFilter__fields">
                <Field
                  name="searchKeyword"
                  className="NotificationsGridFilter__field NotificationsGridFilter__search"
                  label={I18n.t('NOTIFICATION_CENTER.FILTERS.LABELS.SEARCH')}
                  placeholder={I18n.t('NOTIFICATION_CENTER.FILTERS.PLACEHOLDERS.NOTIFICATION_OR_PLAYER')}
                  addition={<i className="icon icon-search" />}
                  component={FormikInputField}
                  withFocus
                />

                <Field
                  name="operatorDesks"
                  className="NotificationsGridFilter__field NotificationsGridFilter__select"
                  label={I18n.t('NOTIFICATION_CENTER.FILTERS.LABELS.DESKS')}
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
                    <option key={uuid} value={uuid}>
                      {I18n.t(name)}
                    </option>
                  ))}
                </Field>

                <Field
                  name="operatorTeams"
                  className="NotificationsGridFilter__field NotificationsGridFilter__select"
                  label={I18n.t('NOTIFICATION_CENTER.FILTERS.LABELS.TEAMS')}
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
                    <option key={uuid} value={uuid}>
                      {I18n.t(name)}
                    </option>
                  ))}
                </Field>

                <Field
                  name="operators"
                  className="NotificationsGridFilter__field NotificationsGridFilter__select"
                  label={I18n.t('NOTIFICATION_CENTER.FILTERS.LABELS.OPERATORS')}
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
                      className={operatorStatus !== 'ACTIVE' ? 'color-inactive' : ''}
                    >
                      {fullName}
                    </option>
                  ))}
                </Field>

                <Field
                  name="notificationTypes"
                  className="NotificationsGridFilter__field NotificationsGridFilter__select"
                  label={I18n.t('NOTIFICATION_CENTER.FILTERS.LABELS.NOTIFICATION_TYPE')}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                  component={FormikSelectField}
                  disabled={isNotificationTypesLoading}
                  searchable
                  withFocus
                  multiple
                >
                  {notificationTypes.map(type => (
                    <option key={type} value={type}>{formatLabel(type)}</option>
                  ))}
                </Field>

                <Field
                  name="notificationSubtypes"
                  className="NotificationsGridFilter__field NotificationsGridFilter__select"
                  label={I18n.t('NOTIFICATION_CENTER.FILTERS.LABELS.NOTIFICATION_TYPE_DETAILS')}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                  component={FormikSelectField}
                  disabled={isNotificationTypesLoading || notificationSubtypes.length === 0}
                  searchable
                  withFocus
                  multiple
                >
                  {notificationSubtypes.map(subtype => (
                    <option key={subtype} value={subtype}>
                      {I18n.t(`NOTIFICATION_CENTER.SUBTYPES.${subtype}`)}
                    </option>
                  ))}
                </Field>
                <FormikDateRangeGroup
                  className="NotificationsGridFilter__field NotificationsGridFilter__date-range"
                  label={I18n.t('NOTIFICATION_CENTER.FILTERS.LABELS.CREATION_RANGE')}
                  periodKeys={{
                    start: 'creationDateRange.from',
                    end: 'creationDateRange.to',
                  }}
                  withFocus
                />
              </div>

              <div className="NotificationsGridFilter__buttons">
                <RefreshButton
                  className="NotificationsGridFilter__button"
                  onClick={handleRefetch}
                />

                <Button
                  className="NotificationsGridFilter__button"
                  onClick={() => this.handleReset(resetForm)}
                  disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
                  primary
                >
                  {I18n.t('COMMON.RESET')}
                </Button>

                <Button
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
  withRouter,
  withRequests({
    operatorsQuery: OperatorsQuery,
    desksAndTeamsQuery: DesksAndTeamsQuery,
    notificationTypesQuery: NotificationTypesQuery,
  }),
)(NotificationsFilters);
