import React, { PureComponent } from 'react';
import PropTypes from 'constants/propTypes';
import history from 'router/history';
import { getActiveBrandConfig } from 'config';
import { getUsersByBranch } from 'graphql/queries/hierarchy';
import { statusMapper } from 'constants/payment';
import ListFilterForm from 'components/ListFilterForm';
import { filterFields } from 'utils/paymentHelpers';

class PaymentFilterFields extends PureComponent {
  static propTypes = {
    desks: PropTypes.arrayOf(PropTypes.hierarchyBranch).isRequired,
    teams: PropTypes.arrayOf(PropTypes.hierarchyBranch).isRequired,
    disabledBranches: PropTypes.bool.isRequired,
    originalAgents: PropTypes.arrayOf(PropTypes.paymentOriginalAgent)
      .isRequired,
    disabledOriginalAgents: PropTypes.bool.isRequired,
    accountType: PropTypes.string,
    isClientView: PropTypes.bool,
  };

  static defaultProps = {
    accountType: 'LIVE',
    isClientView: false,
  };

  state = {
    teams: null,
    originalAgents: null,
    disabledOriginalAgents: false,
  };

  filterOriginalAgents = async (value, formChange) => {
    const { client, originalAgents } = this.props;

    formChange('originalAgents', null);

    this.setState({
      disabledOriginalAgents: true,
    });

    const {
      data: {
        hierarchy: {
          usersByBranch: { data, error: originalAgentsError },
        },
      },
    } = await client.query({
      query: getUsersByBranch,
      variables: { uuids: value },
    });

    const fetchedUUIDs = (data && data.map(({ uuid }) => uuid)) || [];

    const filteredOriginalAgents = originalAgents.filter(
      originalAgent => fetchedUUIDs.indexOf(originalAgent.uuid) !== -1,
    );

    this.setState({
      originalAgents: filteredOriginalAgents,
      disabledOriginalAgents: !!originalAgentsError,
    });
  };

  isValueInForm = (formValues, field) => !!(formValues && formValues[field]);

  syncBranchFilter = (fieldName, value, formChange, formValues) => {
    const { teams, originalAgents } = this.props;

    if (fieldName === 'desks') {
      let filteredTeams = null;

      if (value) {
        filteredTeams = teams.filter(({ parentBranch: { uuid: teamUUID } }) => (
          value.some(uuid => uuid === teamUUID)
        ));
      }

      this.setState(
        {
          ...(filteredTeams && { teams: filteredTeams }),
        },
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
        this.setState({ originalAgents });
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
        teams: null,
        originalAgents: null,
        disabledOriginalAgents: false,
      },
      () => history.replace({}),
    );
  };

  render() {
    const {
      desks,
      teams,
      disabledBranches,
      originalAgents,
      disabledOriginalAgents,
      accountType,
      isClientView,
    } = this.props;

    const {
      teams: filteredTeams,
      originalAgents: filteredOriginalAgents,
      disabledOriginalAgents: disabledFilteredOriginalAgents,
    } = this.state;

    const currencies = getActiveBrandConfig().currencies.supported;

    return (
      <ListFilterForm
        onSubmit={this.handleFormChange}
        onReset={this.handleFormReset}
        initialValues={{ accountType }}
        fields={filterFields({
          currencies,
          disabledBranches,
          desks,
          teams: filteredTeams || teams,
          originalAgents: filteredOriginalAgents || originalAgents,
          disabledOriginalAgents:
            disabledFilteredOriginalAgents || disabledOriginalAgents,
        }, isClientView)}
        onFieldChange={this.syncBranchFilter}
      />
    );
  }
}

export default PaymentFilterFields;
