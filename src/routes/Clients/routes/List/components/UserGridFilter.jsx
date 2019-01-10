import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import { isEqual } from 'lodash';
import PropTypes from '../../../../../constants/propTypes';
import { getBranchChildren } from '../../../../../graphql/queries/hierarchy';
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
    client: PropTypes.object.isRequired,
  };

  state = {
    teams: this.props.teams,
    teamLoading: false,
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

  handleFieldChange = async (fieldName, value, formChange) => {
    const { client } = this.props;

    if (fieldName === fieldNames.desks) {
      this.setState({ teamLoading: true });
      let teams = null;
      let isDeskSelected = false;

      if (value) {
        const { data: { hierarchy: { branchChildren: { data: deskTeams, error } } } } = await client.query({
          query: getBranchChildren,
          variables: { uuid: value },
        });

        if (!error) {
          teams = deskTeams;
        }
        isDeskSelected = true;
      }

      this.setState(
        {
          ...(teams && { teams }),
          isDeskSelected,
          teamLoading: false,
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

    const {
      teams,
      teamLoading,
    } = this.state;

    return (
      <ListFilterForm
        onSubmit={onSubmit}
        onReset={onReset}
        fields={filterFields(
          countries,
          desks,
          teams,
          branchesLoading,
          teamLoading,
        )}
        onFieldChange={this.handleFieldChange}
      />
    );
  }
}

export default withApollo(UserGridFilter);
