import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import { Button } from 'components/UI';
import Uuid from 'components/Uuid';
import DistributionRuleInfo from './components/DistributionRuleInfo';
import DistributionRuleSettings from './components/DistributionRuleSettings';
import DistributionRuleBrands from './components/DistributionRuleBrands';
import {
  DistributionRuleQuery,
  DistributionRuleUpdate,
  OperatorsQuery,
} from './graphql';
import {
  checkEqualityOfDataObjects,
  deepCopyOfDataObject,
} from './utils';
import './DistributionRule.scss';

class DistributionRule extends PureComponent {
  static propTypes = {
    ruleQuery: PropTypes.query({
      distributionRule: PropTypes.ruleClientsDistributionType,
    }).isRequired,
    updateRule: PropTypes.func.isRequired,
    operatorsQuery: PropTypes.query({
      operators: PropTypes.pageable(PropTypes.shape({
        uuid: PropTypes.string,
        fullName: PropTypes.string,
      })),
    }).isRequired,
    notify: PropTypes.func.isRequired,
  }

  static getDerivedStateFromProps({ ruleQuery: { data, loading } }, state) {
    if (!loading && !DistributionRule.initSettingsAreSet) {
      const {
        countries,
        salesStatuses,
        targetSalesStatus,
        registrationPeriodInHours,
        executionType,
        executionPeriodInHours,
        sourceBrandConfigs,
        targetBrandConfigs,
      } = data?.distributionRule || {};

      const sourceBrandConfig = sourceBrandConfigs && sourceBrandConfigs[0];
      const targetBrandConfig = sourceBrandConfigs && targetBrandConfigs[0];

      const { initialState } = DistributionRule;

      DistributionRule.initSettingsAreSet = true;
      DistributionRule.initialState = {
        ...initialState,
        generalSettings: {
          countries,
          salesStatuses,
          targetSalesStatus,
          registrationPeriodInHours,
          executionType: executionType || initialState.generalSettings.executionType,
          executionPeriodInHours,
        },
        sourceBrandConfig,
        targetBrandConfig,
      };

      return deepCopyOfDataObject(DistributionRule.initialState);
    }

    const { initialState } = DistributionRule;

    const settingsWasChanged = !checkEqualityOfDataObjects(
      {
        generalSettings: state.generalSettings,
        sourceBrandConfig: state.sourceBrandConfig,
        targetBrandConfig: state.targetBrandConfig,
      },
      {
        generalSettings: initialState.generalSettings,
        sourceBrandConfig: initialState.sourceBrandConfig,
        targetBrandConfig: initialState.targetBrandConfig,
      },
    );

    return {
      settingsWasChanged,
    };
  }

  static nullState = {
    generalSettings: { executionType: 'MANUAL' },
    sourceBrandConfig: null,
    targetBrandConfig: null,
    addSourceBrandEnabled: false,
    addTargetBrandEnabled: false,
    settingsWasChanged: false,
    isSubmitting: false,
  };

  static initialState = {
    ...this.constructor.nullState,
  };

  state = {
    ...this.constructor.nullState,
  };

  componentWillUnmount() {
    this.constructor.initialState = this.constructor.nullState;

    this.resetToInitialState();

    DistributionRule.initSettingsAreSet = false;
  }

  resetToInitialState = () => {
    this.setState(deepCopyOfDataObject(this.constructor.initialState));
  };

  handleUpdateRule = async () => {
    const {
      ruleQuery: {
        data: ruleData,
      },
      updateRule,
      notify,
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

      this.constructor.initialState = deepCopyOfDataObject({
        ...this.state,
        isSubmitting: false,
      });

      notify({
        level: 'success',
        title: I18n.t('CLIENTS_DISTRIBUTION.RULE.UPDATE.SUCCESS_TITLE'),
        message: I18n.t('CLIENTS_DISTRIBUTION.RULE.UPDATE.SUCCESS_MESSAGE'),
      });
    } catch {
      notify({
        level: 'error',
        title: I18n.t('CLIENTS_DISTRIBUTION.RULE.UPDATE.ERROR_TITLE'),
        message: I18n.t('CLIENTS_DISTRIBUTION.RULE.UPDATE.ERROR_MESSAGE'),
      });
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
        targetBrandConfig: null,
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
      generalSettings: {
        executionType,
      },
      sourceBrandConfig,
      targetBrandConfig,
      addSourceBrandEnabled,
      addTargetBrandEnabled,
      isSubmitting,
      settingsWasChanged,
    } = this.state;

    const {
      name,
      createdBy,
      status,
      createdAt,
      updatedAt,
      statusChangedAt,
      latestMigration,
    } = ruleData?.distributionRule || { name: '' };

    const headerProps = {
      status,
      createdAt,
      updatedAt,
      statusChangedAt,
      latestMigration,
    };

    const allowedBaseUnit = executionType === 'MANUAL' ? 'AMOUNT' : 'PERCENTAGE';

    const resetDisabled = ruleLoading
      || isSubmitting
      || !settingsWasChanged;

    const submitDisabled = ruleLoading
      || isSubmitting
      || !settingsWasChanged
      || !sourceBrandConfig
      || !targetBrandConfig;

    return (
      <div className="DistributionRule card">
        <div className="DistributionRule__header card-heading">
          <div className="DistributionRule__headline">{I18n.t('CLIENTS_DISTRIBUTION.RULE.TITLE', { name })}</div>
          <If condition={createdBy}><Uuid uuid={createdBy} /></If>
        </div>
        <DistributionRuleInfo {...headerProps} />
        <div className="card-body">
          <DistributionRuleSettings
            generalSettings={generalSettings}
            handleGeneralSettings={this.handleGeneralSettings}
          />
          <DistributionRuleBrands
            allowedBaseUnit={allowedBaseUnit}
            generalSettings={generalSettings}
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
        <div className="DistributionRule__actions">
          <Button
            className="DistributionRule__actions-btn"
            onClick={this.resetToInitialState}
            disabled={resetDisabled}
            commonOutline
          >
            {I18n.t('COMMON.CANCEL')}
          </Button>
          <Button
            className="DistributionRule__actions-btn"
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

export default compose(
  withNotifications,
  withRequests({
    ruleQuery: DistributionRuleQuery,
    updateRule: DistributionRuleUpdate,
    operatorsQuery: OperatorsQuery,
  }),
)(DistributionRule);
