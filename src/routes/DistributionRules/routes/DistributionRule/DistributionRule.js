import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import EventEmitter, { DISTRIBUTION_RULE_CHANGED } from 'utils/EventEmitter';
import { Button } from 'components/UI';
import DistributionRuleHeader from './components/DistributionRuleHeader';
import DistributionRuleInfo from './components/DistributionRuleInfo';
import DistributionRuleSettings from './components/DistributionRuleSettings';
import DistributionRuleBrands from './components/DistributionRuleBrands';
import {
  DistributionRuleQuery,
  DistributionRuleUpdate,
  DistributionRuleUpdateStatus,
  OperatorsQuery,
} from './graphql';
import {
  checkEqualityOfDataObjects,
  deepCopyOfDataObject,
} from './utils';
import './DistributionRule.scss';

class DistributionRule extends PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
    }).isRequired,
    ruleQuery: PropTypes.query({
      distributionRule: PropTypes.ruleClientsDistributionType,
    }).isRequired,
    updateRule: PropTypes.func.isRequired,
    updateRuleStatus: PropTypes.func.isRequired,
    operatorsQuery: PropTypes.query({
      operators: PropTypes.pageable(PropTypes.shape({
        uuid: PropTypes.string,
        fullName: PropTypes.string,
      })),
    }).isRequired,
    notify: PropTypes.func.isRequired,
  }

  /**
   * This method has two prime points:
   * 1. Setting the <<< initialState >>> just once as a static prop to have its as a start point
   * 2. Setting the <<< settingsWasChanged >> flag of a state shape in all other cases
   */
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
    ...DistributionRule.nullState,
  };

  state = {
    ...DistributionRule.nullState,
  };

  componentDidMount() {
    EventEmitter.on(DISTRIBUTION_RULE_CHANGED, this.refetchRule);
  }

  componentWillUnmount() {
    this.constructor.initialState = this.constructor.nullState;

    this.resetToInitialState();

    DistributionRule.initSettingsAreSet = false;

    EventEmitter.off(DISTRIBUTION_RULE_CHANGED, this.refetchRule);
  }

  refetchRule = () => {
    this.props.ruleQuery.refetch();
  };

  resetToInitialState = () => {
    this.setState(deepCopyOfDataObject(this.constructor.initialState));
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
      targetBrandConfig: null,
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

  updateRuleStatus = async (ruleStatus) => {
    const {
      ruleQuery: {
        data: ruleData,
      },
      updateRuleStatus,
      notify,
    } = this.props;

    const { uuid } = ruleData.distributionRule;

    try {
      await updateRuleStatus({
        variables: {
          uuid,
          ruleStatus,
        },
      });

      notify({
        level: 'success',
        title: I18n.t('CLIENTS_DISTRIBUTION.RULE.UPDATE.SUCCESS_TITLE'),
        message: I18n.t('CLIENTS_DISTRIBUTION.RULE.UPDATE.SUCCESS_MESSAGE'),
      });

      EventEmitter.emit(DISTRIBUTION_RULE_CHANGED);
    } catch {
      notify({
        level: 'error',
        title: I18n.t('CLIENTS_DISTRIBUTION.RULE.UPDATE.ERROR_TITLE'),
        message: I18n.t('CLIENTS_DISTRIBUTION.RULE.UPDATE.ERROR_MESSAGE'),
      });
    }
  };

  render() {
    const {
      match: {
        params: { id: ruleUuid },
      },
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
      order,
      createdBy,
      status,
      createdAt,
      updatedAt,
      statusChangedAt,
      latestMigration,
    } = ruleData?.distributionRule || { name: '' };

    const allowedBaseUnits = [(executionType === 'MANUAL' && 'AMOUNT'), 'PERCENTAGE'].filter(Boolean);

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
        <DistributionRuleHeader
          ruleUuid={ruleUuid}
          ruleName={name}
          ruleOrder={order}
          createdBy={createdBy}
        />
        <DistributionRuleInfo
          status={status}
          createdAt={createdAt}
          updatedAt={updatedAt}
          statusChangedAt={statusChangedAt}
          latestMigration={latestMigration}
          updateRuleStatus={this.updateRuleStatus}
        />
        <div className="card-body">
          <DistributionRuleSettings
            generalSettings={generalSettings}
            handleGeneralSettings={this.handleGeneralSettings}
          />
          <DistributionRuleBrands
            allowedBaseUnits={allowedBaseUnits}
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
    updateRuleStatus: DistributionRuleUpdateStatus,
    operatorsQuery: OperatorsQuery,
  }),
)(DistributionRule);
