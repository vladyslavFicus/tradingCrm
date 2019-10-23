import React, { Component } from 'react';
import { isEqual, get } from 'lodash';
import { I18n } from 'react-redux-i18n';
import { getUsersByBranch } from 'graphql/queries/hierarchy';
import PropTypes from 'constants/propTypes';
import { filterSetTypes } from 'constants/filterSet';
import ListFilterForm from 'components/ListFilterForm';
import { filterFields, fieldNames } from '../attributes';
import { AppoloRequestContext } from '../List';

class UserGridFilter extends Component {
  static propTypes = {
    onReset: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    countries: PropTypes.object.isRequired,
    teams: PropTypes.arrayOf(PropTypes.hierarchyBranch).isRequired,
    desks: PropTypes.arrayOf(PropTypes.hierarchyBranch).isRequired,
    branchesLoading: PropTypes.bool.isRequired,
    operators: PropTypes.operatorsList.isRequired,
    operatorsLoading: PropTypes.bool.isRequired,
    initialValues: PropTypes.object,
  };

  static defaultProps = {
    initialValues: null,
  }

  state = {
    teams: this.props.teams,
    isDeskSelected: false,
    filteredOperators: null,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState.isDeskSelected && !isEqual(nextProps.teams, prevState.teams)) {
      return {
        teams: nextProps.teams,
      };
    }

    return null;
  }

  filterOperators = async (value, formChange) => {
    const { client, operators, notify } = this.props;
    let desksTeamsOperators = [];

    formChange(fieldNames.repIds, null);
    this.setState({ branchOperatorsLoading: true });

    const { data: { hierarchy: { usersByBranch: { data, error } } } } = await client.query({
      query: getUsersByBranch,
      variables: { uuid: value },
    });

    if (error) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.FAILED'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });

      return;
    }

    desksTeamsOperators = data && data.map(({ uuid }) => uuid);

    const filteredOperators = operators.filter(operator => desksTeamsOperators.indexOf(operator.uuid) !== -1);
    this.setState({ filteredOperators, branchOperatorsLoading: false });
  }

  isValueInForm = (formValues, field) => !!(formValues && formValues[field]);

  handleFieldChange = (fieldName, value, formChange, formValues) => {
    const { teams, operators } = this.props;

    if (fieldName === fieldNames.desk) {
      let deskTeams = null;
      let isDeskSelected = false;

      if (value) {
        deskTeams = teams.filter(team => value === get(team, 'parentBranch.uuid'));
        isDeskSelected = true;
      }

      this.setState(
        {
          ...(deskTeams && { teams: deskTeams }),
          isDeskSelected,
        },
        value ? () => formChange(fieldNames.team, null) : null,
      );
    }

    switch (true) {
      case (!!value): {
        this.filterOperators(value, formChange);
        break;
      }
      case (fieldName === fieldNames.team
        && this.isValueInForm(formValues, fieldNames.desk)
      ): {
        this.filterOperators(formValues[fieldNames.desk], formChange);
        break;
      }
      case (fieldName === fieldNames.desk
        && this.isValueInForm(formValues, fieldNames.team)
      ): {
        this.filterOperators(formValues[fieldNames.team], formChange);
        break;
      }
      default: this.setState({ filteredOperators: operators });
    }

    formChange(fieldName, value || null);
  }

  render() {
    const {
      onSubmit,
      onReset,
      countries,
      desks,
      branchesLoading,
      operatorsLoading,
      operators,
      initialValues,
    } = this.props;

    const { teams, filteredOperators, branchOperatorsLoading } = this.state;

    return (
      <AppoloRequestContext.Consumer>
        {requestInProgress => (
          <ListFilterForm
            onSubmit={onSubmit}
            initialValues={initialValues}
            onReset={onReset}
            filterSetType={filterSetTypes.CLIENT}
            fields={filterFields(
              countries,
              desks,
              teams,
              branchesLoading,
              filteredOperators || operators,
              operatorsLoading || branchOperatorsLoading,
            )}
            onFieldChange={this.handleFieldChange}
            queryRequestInProgress={requestInProgress}
          />
        )}
      </AppoloRequestContext.Consumer>
    );
  }
}

export default UserGridFilter;
