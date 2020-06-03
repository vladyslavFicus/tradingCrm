/* eslint-disable react/no-unused-state */
import React, { PureComponent } from 'react';
import { compose, withApollo } from 'react-apollo';
import { isEqual, get } from 'lodash';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import { withStorage } from 'providers/StorageProvider';
import PropTypes from 'constants/propTypes';
import { filterSetTypes } from 'constants/filterSet';
import ListFilterForm from 'components/ListFilterForm';
import {
  OperatorsQuery,
  PartnersQuery,
  UserBranchHierarchyQuery,
  usersByBranchQuery,
} from './graphql';
import { filterFields, fieldNames } from '../attributes';

class ClientsGridFilter extends PureComponent {
  static propTypes = {
    onReset: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isFetchingProfileData: PropTypes.bool.isRequired,
    initialValues: PropTypes.object,
    auth: PropTypes.auth.isRequired,
    userBranchHierarchy: PropTypes.query({
      hierarchy: PropTypes.shape({
        data: PropTypes.shape({
          TEAM: PropTypes.arrayOf(PropTypes.hierarchyBranch),
          DESK: PropTypes.arrayOf(PropTypes.hierarchyBranch),
        }),
      }),
    }).isRequired,
    operators: PropTypes.query({
      operators: PropTypes.shape({
        data: PropTypes.shape({
          content: PropTypes.operatorsList,
        }),
      }),
    }).isRequired,
    partners: PropTypes.query({
      partners: PropTypes.shape({
        data: PropTypes.shape({
          content: PropTypes.partnersList,
        }),
      }),
    }).isRequired,
    notify: PropTypes.func.isRequired,
    client: PropTypes.shape({
      query: PropTypes.func.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    initialValues: null,
  };

  static getDerivedStateFromProps(
    { userBranchHierarchy: { data: nextHierarchyData } },
    { teams, isDeskSelected },
  ) {
    const nextTeams = get(nextHierarchyData, 'hierarchy.userBranchHierarchy.data.TEAM') || [];

    if (!isDeskSelected && !isEqual(nextTeams, teams)) {
      return {
        teams: nextTeams,
      };
    }

    return null;
  }

  constructor(props) {
    super(props);

    const { userBranchHierarchy: { data: hierarchyData } } = this.props;
    const teams = get(hierarchyData, 'hierarchy.userBranchHierarchy.data.TEAM') || [];

    this.state = {
      teams,
      isDeskSelected: false,
      filteredOperators: null,
    };
  }

  filterOperators = async (value, formChange) => {
    const {
      client,
      notify,
      operators: {
        data: operatorsData,
      },
    } = this.props;

    const operators = get(operatorsData, 'operators.data.content') || [];

    let desksTeamsOperators = [];

    formChange(fieldNames.operators, null);
    this.setState({ branchOperatorsLoading: true });

    const {
      data: {
        hierarchy: {
          usersByBranch: { data, error },
        },
      },
    } = await client.query({
      query: usersByBranchQuery,
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
    const {
      userBranchHierarchy: {
        data: hierarchyData,
      },
      operators: {
        data: operatorsData,
      },
    } = this.props;

    const teams = get(hierarchyData, 'hierarchy.userBranchHierarchy.data.TEAM') || [];
    const operators = get(operatorsData, 'operators.data.content') || [];

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
    const {
      userBranchHierarchy: {
        data: hierarchyData,
      },
      onReset,
    } = this.props;

    const teams = get(hierarchyData, 'hierarchy.userBranchHierarchy.data.TEAM') || [];

    this.setState({
      teams,
      filteredOperators: null,
    }, onReset);
  };

  render() {
    const {
      auth,
      onSubmit,
      initialValues,
      isFetchingProfileData,
      userBranchHierarchy: {
        data: hierarchyData,
        loading: hierarchyLoading,
      },
      operators: {
        data: operatorsData,
        loading: operatorsLoading,
      },
      partners: {
        data: partnersData,
        loading: partnersLoading,
      },
    } = this.props;

    const desks = get(hierarchyData, 'hierarchy.userBranchHierarchy.data.DESK') || [];
    const operators = get(operatorsData, 'operators.data.content') || [];
    const partners = get(partnersData, 'partners.data.content') || [];

    const { teams, filteredOperators, branchOperatorsLoading } = this.state;

    return (
      <ListFilterForm
        onSubmit={onSubmit}
        initialValues={initialValues}
        onReset={this.handleResetForm}
        filterSetType={filterSetTypes.CLIENT}
        fields={filterFields({
          desks,
          teams,
          hierarchyLoading,
          operators: filteredOperators || operators,
          operatorsLoading: operatorsLoading || branchOperatorsLoading,
          partners,
          partnersLoading,
          auth,
        })}
        onFieldChange={this.handleFieldChange}
        isDataLoading={isFetchingProfileData}
      />
    );
  }
}

export default compose(
  withApollo,
  withNotifications,
  withStorage(['auth']),
  withRequests({
    userBranchHierarchy: UserBranchHierarchyQuery,
    operators: OperatorsQuery,
    partners: PartnersQuery,
  }),
)(ClientsGridFilter);
