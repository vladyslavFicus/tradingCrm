import React, { Component } from 'react';
import { isEqual } from 'lodash';
import I18n from 'i18n-js';
import { getUsersByBranch } from 'graphql/queries/hierarchy';
import PropTypes from 'constants/propTypes';
import { withStorage } from 'providers/StorageProvider';
import { filterSetTypes } from 'constants/filterSet';
import ListFilterForm from 'components/ListFilterForm';
import { filterFields, fieldNames } from '../attributes';

class UserGridFilter extends Component {
  static propTypes = {
    onReset: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    teams: PropTypes.arrayOf(PropTypes.hierarchyBranch).isRequired,
    desks: PropTypes.arrayOf(PropTypes.hierarchyBranch).isRequired,
    branchesLoading: PropTypes.bool.isRequired,
    isFetchingProfileData: PropTypes.bool.isRequired,
    operators: PropTypes.operatorsList.isRequired,
    operatorsLoading: PropTypes.bool.isRequired,
    partners: PropTypes.partnersList.isRequired,
    partnersLoading: PropTypes.bool.isRequired,
    initialValues: PropTypes.object,
    auth: PropTypes.auth.isRequired,
  };

  static defaultProps = {
    initialValues: null,
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
    const { client, operators, notify } = this.props;
    let desksTeamsOperators = [];

    formChange(fieldNames.operators, null);
    this.setState({ branchOperatorsLoading: true });

    const { data: { hierarchy: { usersByBranch: { data, error } } } } = await client.query({
      query: getUsersByBranch,
      variables: { uuids: value },
    });

    if (error) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });

      return;
    }

    desksTeamsOperators = data && data.map(({ uuid }) => uuid);

    const filteredOperators = operators.filter(operator => desksTeamsOperators.indexOf(operator.uuid) !== -1);
    this.setState({ filteredOperators, branchOperatorsLoading: false });
  };

  isValueInForm = (formValues, field) => !!(formValues && formValues[field]);

  handleFieldChange = (fieldName, value, formChange, formValues) => {
    const { teams, operators } = this.props;

    if (fieldName === fieldNames.desks) {
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
  };

  handleResetForm = () => {
    const { teams, onReset } = this.props;

    this.setState({
      teams,
      filteredOperators: null,
    }, onReset);
  };

  render() {
    const {
      desks,
      onSubmit,
      operators,
      initialValues,
      branchesLoading,
      operatorsLoading,
      isFetchingProfileData,
      partners,
      partnersLoading,
      auth,
    } = this.props;

    const { teams, filteredOperators, branchOperatorsLoading } = this.state;

    return (
      <ListFilterForm
        onSubmit={onSubmit}
        initialValues={initialValues}
        onReset={this.handleResetForm}
        filterSetType={filterSetTypes.CLIENT}
        fields={filterFields(
          desks,
          teams,
          branchesLoading,
          filteredOperators || operators,
          operatorsLoading || branchOperatorsLoading,
          partners,
          partnersLoading,
          auth,
        )}
        onFieldChange={this.handleFieldChange}
        isFetchingProfileData={isFetchingProfileData}
      />
    );
  }
}

export default withStorage(['auth'])(UserGridFilter);
