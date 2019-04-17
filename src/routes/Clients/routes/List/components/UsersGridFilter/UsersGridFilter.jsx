import React, { Component } from 'react';
import { isEqual, get } from 'lodash';
import { I18n } from 'react-redux-i18n';
import { getUsersByBranch } from 'graphql/queries/hierarchy';
import PropTypes from 'constants/propTypes';
import ListFilterForm from 'components/ListFilterForm';
import { filterFields, fieldNames } from '../attributes';

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
  };

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
    const { client, operators, setDesksTeamsOperators, notify } = this.props;
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
    setDesksTeamsOperators(desksTeamsOperators);

    const filteredOperators = operators.filter(operator => desksTeamsOperators.indexOf(operator.uuid) !== -1);
    this.setState({ filteredOperators, branchOperatorsLoading: false });
  }

  isValueInForm = (formValues, field) => !!(formValues && formValues[field]);

  handleFieldChange = (fieldName, value, formChange, formValues) => {
    const { teams, operators } = this.props;

    if (fieldName === fieldNames.desks) {
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
        value ? () => formChange(fieldNames.teams, null) : null,
      );
    }

    switch (true) {
      case (!!value): {
        this.filterOperators(value, formChange);
        break;
      }
      case (fieldName === fieldNames.teams
        && this.isValueInForm(formValues, fieldNames.desks)
      ): {
        this.filterOperators(formValues[fieldNames.desks], formChange);
        break;
      }
      case (fieldName === fieldNames.desks
        && this.isValueInForm(formValues, fieldNames.teams)
      ): {
        this.filterOperators(formValues[fieldNames.teams], formChange);
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
    } = this.props;

    const { teams, filteredOperators, branchOperatorsLoading } = this.state;

    return (
      <ListFilterForm
        onSubmit={onSubmit}
        onReset={onReset}
        fields={filterFields(
          countries,
          desks,
          teams,
          branchesLoading,
          filteredOperators || operators,
          operatorsLoading || branchOperatorsLoading,
        )}
        onFieldChange={this.handleFieldChange}
      />
    );
  }
}

export default UserGridFilter;
