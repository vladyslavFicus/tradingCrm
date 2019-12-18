import React, { PureComponent } from 'react';
import { get } from 'lodash';
import PropTypes from 'constants/propTypes';
import history from 'router/history';
import { getActiveBrandConfig } from 'config';
import { getUsersByBranch } from 'graphql/queries/hierarchy';
import { statusMapper } from 'constants/payment';
import ListFilterForm from 'components/ListFilterForm';
import { filterFields } from 'utils/paymentHelpers';

class PaymentFilterFields extends PureComponent {
  static propTypes = {
    hierarchy: PropTypes.shape({
      hierarchy: PropTypes.shape({
        data: PropTypes.shape({
          TEAM: PropTypes.arrayOf(PropTypes.hierarchyBranch).isRequired,
          DESK: PropTypes.arrayOf(PropTypes.hierarchyBranch).isRequired,
        }),
        error: PropTypes.object,
      }),
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    operators: PropTypes.shape({
      operators: PropTypes.shape({
        data: PropTypes.shape({
          content: PropTypes.operatorsList.isRequired,
        }),
        error: PropTypes.object,
      }),
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    paymentMethods: PropTypes.shape({
      paymentMethods: PropTypes.shape({
        data: PropTypes.paymentMethods,
        error: PropTypes.object,
      }),
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    accountType: PropTypes.string,
    isClientView: PropTypes.bool,
  };

  static defaultProps = {
    accountType: 'LIVE',
    isClientView: false,
  };

  state = {
    filteredTeams: null,
    filteredAgents: null,
    disabledFilteredAgents: false,
  };

  filterOriginalAgents = async (value, formChange) => {
    const {
      client,
      operators: { operators },
    } = this.props;

    const originalAgents = get(operators, 'data.content') || [];

    formChange('originalAgents', null);

    this.setState({
      disabledFilteredAgents: true,
    });

    const {
      data: {
        hierarchy: {
          usersByBranch: { data, error: filteredAgentsError },
        },
      },
    } = await client.query({
      query: getUsersByBranch,
      variables: { uuids: value },
    });

    const fetchedUUIDs = (data && data.map(({ uuid }) => uuid)) || [];

    const filteredAgents = originalAgents.filter(
      originalAgent => fetchedUUIDs.indexOf(originalAgent.uuid) !== -1,
    );

    this.setState({
      filteredAgents,
      disabledFilteredAgents: !!filteredAgentsError,
    });
  };

  isValueInForm = (formValues, field) => !!(formValues && formValues[field]);

  syncBranchFilter = (fieldName, value, formChange, formValues) => {
    const { hierarchy: { hierarchy } } = this.props;
    const teams = get(hierarchy, 'userBranchHierarchy.data.TEAM') || [];

    if (fieldName === 'desks') {
      let filteredTeams = null;

      if (value) {
        filteredTeams = teams.filter(({ parentBranch: { uuid: teamUUID } }) => (
          value.some(uuid => uuid === teamUUID)
        ));
      }

      this.setState(
        { filteredTeams },
        value ? () => formChange('teams', null) : null,
      );
    }

    switch (true) {
      case !!value: {
        this.filterOriginalAgents(value, formChange);
        break;
      }
      case fieldName === 'teams'
        && this.isValueInForm(formValues, 'desks'): {
        this.filterOriginalAgents(formValues.desks, formChange);
        break;
      }
      case fieldName === 'desks'
        && this.isValueInForm(formValues, 'teams'): {
        this.filterOriginalAgents(formValues.teams, formChange);
        break;
      }
      default:
        this.setState({ filteredAgents: null });
    }

    formChange(fieldName, value || null);
  };

  handleFormChange = (data = {}) => {
    let statuses = null;

    if (Array.isArray(data.statuses)) {
      statuses = data.statuses.map(item => statusMapper[item]).flat(Infinity);
    }

    history.replace({
      query: {
        filters: {
          ...data,
          ...data.firstTimeDeposit && { firstTimeDeposit: !!(+data.firstTimeDeposit) },
          ...statuses && { statuses },
          ...data.originalAgents && { agentIds: data.originalAgents },
        },
      },
    });
  };

  handleFormReset = () => {
    this.setState(
      {
        filteredTeams: null,
        filteredAgents: null,
        disabledFilteredAgents: false,
      },
      () => history.replace({}),
    );
  };

  render() {
    const {
      hierarchy: {
        hierarchy,
        loading: hierarchyLoading,
      },
      operators: {
        operators,
        loading: originalAgentsLoading,
      },
      paymentMethods: {
        paymentMethods,
        loading: methodsLoading,
      },
      accountType,
      isClientView,
    } = this.props;

    const {
      filteredTeams,
      filteredAgents,
      disabledFilteredAgents,
    } = this.state;

    const teams = get(hierarchy, 'userBranchHierarchy.data.TEAM') || [];
    const desks = get(hierarchy, 'userBranchHierarchy.data.DESK') || [];
    const hierarchyError = get(hierarchy, 'userBranchHierarchy.error');
    const disabledHierarchy = hierarchyLoading || hierarchyError;
    const originalAgents = get(operators, 'data.content') || [];
    const originalAgentsError = get(operators, 'error');
    const disabledOriginalAgents = originalAgentsLoading || originalAgentsError || disabledFilteredAgents;
    const methods = get(paymentMethods, 'data') || [];
    const methodsError = get(paymentMethods, 'error');
    const disabledPaymentMethods = methodsLoading || methodsError;

    const currencies = getActiveBrandConfig().currencies.supported;

    return (
      <ListFilterForm
        onSubmit={this.handleFormChange}
        onReset={this.handleFormReset}
        initialValues={{ accountType }}
        fields={filterFields({
          currencies,
          desks,
          teams: filteredTeams || teams,
          disabledHierarchy,
          originalAgents: filteredAgents || originalAgents,
          disabledOriginalAgents,
          paymentMethods: methods,
          disabledPaymentMethods,
        }, isClientView)}
        onFieldChange={this.syncBranchFilter}
      />
    );
  }
}

export default PaymentFilterFields;
