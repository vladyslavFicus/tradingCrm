import React, { Component } from 'react';
import { isEqual, get } from 'lodash';
import PropTypes from '../../../../../constants/propTypes';
import ListFilterForm from '../../../../../components/ListFilterForm';
import { filterFields, fieldNames } from './attributes';

class UserGridFilter extends Component {
  static propTypes = {
    onReset: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    countries: PropTypes.object.isRequired,
    teams: PropTypes.arrayOf(PropTypes.hierarchyBranch).isRequired,
    desks: PropTypes.arrayOf(PropTypes.hierarchyBranch).isRequired,
    branchesLoading: PropTypes.bool.isRequired,
  };

  state = {
    teams: this.props.teams,
    isDeskSelected: false,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState.isDeskSelected && !isEqual(nextProps.teams, prevState.teams)) {
      return {
        teams: nextProps.teams,
      };
    }

    return null;
  }

  handleFieldChange = (fieldName, value, formChange) => {
    const { teams } = this.props;

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
        value ? null : () => formChange(fieldNames.teams, null),
      );
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
    } = this.props;

    const { teams } = this.state;

    return (
      <ListFilterForm
        onSubmit={onSubmit}
        onReset={onReset}
        fields={filterFields(
          countries,
          desks,
          teams,
          branchesLoading,
        )}
        onFieldChange={this.handleFieldChange}
      />
    );
  }
}

export default UserGridFilter;
