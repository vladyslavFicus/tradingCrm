import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import { Button } from 'components/UI';
import Uuid from 'components/Uuid';
import MigrationSettings from './components/MigrationSettings';
import MigrationBrands from './components/MigrationBrands';
import {
  ClientsDistributionRuleQuery,
  ClientsDistributionRuleUpdate,
  OperatorsQuery,
} from './graphql';
import './ClientsDistributionRule.scss';

class ClientsDistributionRule extends PureComponent {
  static propTypes = {
    ruleQuery: PropTypes.query({
      distributionRule: PropTypes.object,
    }).isRequired,
    updateRule: PropTypes.func.isRequired,
    operatorsQuery: PropTypes.query({
      operators: PropTypes.pageable(PropTypes.shape({
        uuid: PropTypes.string,
        fullName: PropTypes.string,
      })),
    }).isRequired,
  }

  static getDerivedStateFromProps({ ruleQuery: { data, loading } }, state) {
    if (!loading && !ClientsDistributionRule.initSettingsAreSet) {
      const {
        countries,
        salesStatuses,
        targetSalesStatus,
        registrationPeriodInHours,
        executionType,
        executionPeriodInHours,
        sourceBrandConfigs = [],
        targetBrandConfigs = [],
      } = data?.distributionRule || {};

      const sourceBrandConfig = sourceBrandConfigs[0];
      const targetBrandConfig = targetBrandConfigs[0];

      ClientsDistributionRule.initSettingsAreSet = true;
      ClientsDistributionRule.initialState = {
        ...ClientsDistributionRule.initialState,
        generalSettings: {
          countries,
          salesStatuses,
          targetSalesStatus,
          registrationPeriodInHours,
          executionType,
          executionPeriodInHours,
        },
        sourceBrandConfig,
        targetBrandConfig,
      };

      return JSON.parse(JSON.stringify(ClientsDistributionRule.initialState));
    }

    const { initialState } = ClientsDistributionRule;

    const settingsWasChanged = JSON.stringify({
      generalSettings: state.generalSettings,
      sourceBrandConfig: state.sourceBrandConfig,
      targetBrandConfig: state.targetBrandConfig,
    }) !== JSON.stringify({
      generalSettings: initialState.generalSettings,
      sourceBrandConfig: initialState.sourceBrandConfig,
      targetBrandConfig: initialState.targetBrandConfig,
    });

    return {
      settingsWasChanged,
    };
  }

  static initialState = {
    generalSettings: {},
    sourceBrandConfig: null,
    targetBrandConfig: null,
    addSourceBrandEnabled: false,
    addTargetBrandEnabled: false,
    settingsWasChanged: false,
    isSubmitting: false,
  };

  state = {
    ...this.constructor.initialState,
  };

  resetToInitialState = () => {
    this.setState(JSON.parse(JSON.stringify(ClientsDistributionRule.initialState)));
  }

  handleUpdateRule = async () => {
    const {
      ruleQuery: {
        data: ruleData,
      },
      updateRule,
    } = this.props;

    const {
      generalSettings,
      sourceBrandConfig,
      targetBrandConfig,
    } = this.state;

    const { uuid, name: ruleName } = ruleData.distributionRule;

    this.setState({ isSubmitting: true });

    try {
      await updateRule({
        variables: {
          args: {
            uuid,
            ruleName,
            sourceBrandConfig,
            targetBrandConfig,
            ...generalSettings,
          },
        },
      });

      ClientsDistributionRule.initialState = JSON.parse(JSON.stringify({
        ...this.state,
        isSubmitting: false,
      }));
    } catch {
      // ...
    } finally {
      this.setState({ isSubmitting: false });
    }
  };

  handleGeneralSettings = (isValid, generalSettings) => {
    this.setState({
      generalSettings,
      sourceBrandConfig: null,
      targetBrandConfig: null,
      addSourceBrandEnabled: isValid,
      addTargetBrandEnabled: false,
    });
  };

  handleSourceBrandConfig = ({ quantity, baseUnit, ...brandSettings }) => {
    this.setState({
      sourceBrandConfig: {
        ...brandSettings,
        distributionUnit: {
          quantity,
          baseUnit,
        },
      },
      addSourceBrandEnabled: false,
      addTargetBrandEnabled: true,
    });
  };

  handleTargetBrandConfig = ({ quantity, baseUnit, ...brandSettings }) => {
    this.setState({
      targetBrandConfig: {
        ...brandSettings,
        distributionUnit: {
          quantity,
          baseUnit,
        },
      },
      addTargetBrandEnabled: false,
    });
  };

  handleRemoveBrandCard = key => (
    key === 'source'
      ? this.setState({
        sourceBrandConfig: null,
        addSourceBrandEnabled: true,
        addTargetBrandEnabled: false,
      })
      : this.setState(({ sourceBrandConfig }) => ({
        targetBrandConfig: null,
        addTargetBrandEnabled: !!sourceBrandConfig,
      }))
  );

  render() {
    const {
      ruleQuery: {
        data: ruleData,
        loading: ruleLoading,
      },
      operatorsQuery,
    } = this.props;

    const {
      generalSettings,
      sourceBrandConfig,
      targetBrandConfig,
      addSourceBrandEnabled,
      addTargetBrandEnabled,
      isSubmitting,
      settingsWasChanged,
    } = this.state;

    const { name, createdBy } = ruleData?.distributionRule || {};

    const resetDisabled = ruleLoading
      || isSubmitting
      || !settingsWasChanged;

    const submitDisabled = ruleLoading
      || isSubmitting
      || !settingsWasChanged
      || !sourceBrandConfig
      || !targetBrandConfig;

    return (
      <div className="ClientsDistributionRule card">
        <div className="ClientsDistributionRule__header card-heading">
          <div className="ClientsDistributionRule__headline">Rule {name}</div>
          <If condition={createdBy}><Uuid uuid={createdBy} /></If>
        </div>
        <div className="card-body">
          <MigrationSettings
            generalSettings={generalSettings}
            handleGeneralSettings={this.handleGeneralSettings}
          />
          <MigrationBrands
            sourceBrandConfig={sourceBrandConfig}
            targetBrandConfig={targetBrandConfig}
            handleSourceBrandConfig={this.handleSourceBrandConfig}
            handleTargetBrandConfig={this.handleTargetBrandConfig}
            addSourceBrandEnabled={addSourceBrandEnabled}
            addTargetBrandEnabled={addTargetBrandEnabled}
            handleRemoveBrandCard={this.handleRemoveBrandCard}
            operatorsQuery={operatorsQuery}
          />
        </div>
        <div className="ClientsDistributionRule__actions">
          <Button
            className="ClientsDistributionRule__actions-btn"
            onClick={this.resetToInitialState}
            disabled={resetDisabled}
            commonOutline
          >
            {I18n.t('COMMON.CANCEL')}
          </Button>
          <Button
            className="ClientsDistributionRule__actions-btn"
            onClick={this.handleUpdateRule}
            disabled={submitDisabled}
            primary
          >
            {I18n.t('COMMON.SAVE')}
          </Button>
        </div>
      </div>
    );
  }
}

export default withRequests({
  ruleQuery: ClientsDistributionRuleQuery,
  updateRule: ClientsDistributionRuleUpdate,
  operatorsQuery: OperatorsQuery,
})(ClientsDistributionRule);
