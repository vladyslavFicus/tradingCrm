import React, { Component } from 'react';
import { isEqual } from 'lodash';
import { I18n } from 'react-redux-i18n';
import { getUsersByBranch } from 'graphql/queries/hierarchy';
import PropTypes from 'constants/propTypes';
import { filterSetTypes } from 'constants/filterSet';
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
    isFetchingProfileData: PropTypes.bool.isRequired,
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
      variables: { uuids: value },
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
        deskTeams = teams.filter(({ parentBranch: { uuid: teamUUID } }) => (
          value.some(uuid => uuid === teamUUID)
        ));
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

  handleResetForm = () => {
    const { teams, onReset } = this.props;

    this.setState({
      teams,
      filteredOperators: null,
    }, onReset);
  }

  render() {
    const {
      desks,
      onSubmit,
      countries,
      operators,
      initialValues,
      branchesLoading,
      operatorsLoading,
      isFetchingProfileData,
    } = this.props;

    const { teams, filteredOperators, branchOperatorsLoading } = this.state;

    return (
      <ListFilterForm
        onSubmit={onSubmit}
        initialValues={initialValues}
        onReset={this.handleResetForm}
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
        isFetchingProfileData={isFetchingProfileData}
      />
    );
  }
}

export default UserGridFilter;
