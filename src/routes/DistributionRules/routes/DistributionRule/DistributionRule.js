import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import { withRequests, parseErrors } from 'apollo';
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
} from './graphql';
import {
  checkEqualityOfDataObjects,
  deepCopyOfDataObject,
} from './utils';
import './DistributionRule.scss';

class DistributionRule extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
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
        languages,
        salesStatuses,
        targetSalesStatus,
        registrationPeriodInHours,
        executionType,
        executionPeriodInHours,
        sourceBrandConfigs,
        targetBrandConfigs,
        affiliateUuid,
      } = data?.distributionRule || {};

      const sourceBrandConfig = sourceBrandConfigs && sourceBrandConfigs[0];
      const targetBrandConfig = sourceBrandConfigs && targetBrandConfigs[0];

      const { initialState } = DistributionRule;

      DistributionRule.initSettingsAreSet = true;
      DistributionRule.initialState = {
        ...initialState,
        generalSettings: {
          countries,
          languages,
          salesStatuses,
          targetSalesStatus,
          registrationPeriodInHours,
          executionType: executionType || initialState.generalSettings.executionType,
          executionPeriodInHours,
          affiliateUuid,
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
    this.constructor.initSettingsAreSet = false;

    EventEmitter.off(DISTRIBUTION_RULE_CHANGED, this.refetchRule);
  }

  refetchRule = () => {
    this.props.ruleQuery.refetch();
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
      history,
    } = this.props;

    const {
      generalSettings,
      sourceBrandConfig,
      targetBrandConfig: {
        operatorEntity,
        ...targetBrandConfig
      },
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
            targetBrandConfig: {
              ...targetBrandConfig,
              operator: operatorEntity?.uuid,
            },
            ...generalSettings,
          },
        },
      });

      history.push('/distribution');
    } catch (e) {
      const { error } = parseErrors(e);

      notify({
        level: 'error',
        title: I18n.t('CLIENTS_DISTRIBUTION.RULE.UPDATE.ERROR_TITLE'),
        message: error === 'error.entity.already.exist'
          ? I18n.t('CLIENTS_DISTRIBUTION.RULE.UPDATE.ALREADY_EXIST')
          : I18n.t('CLIENTS_DISTRIBUTION.RULE.UPDATE.ERROR_MESSAGE'),
      });

      this.setState({ isSubmitting: false });
    }
  };

  handleCancel = () => {
    this.props.history.push('/distribution');
  };

  updateRuleStatus = async (ruleStatus) => {
    const {
      ruleQuery: {
        data: ruleData,
      },
      updateRuleStatus,
      notify,
    } = this.props;

    const { uuid, name } = ruleData.distributionRule;

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
    } catch (e) {
      const { error } = parseErrors(e);

      notify({
        level: 'error',
        title: I18n.t('CLIENTS_DISTRIBUTION.RULE.UPDATE.ERROR_TITLE'),
        message: error === 'error.entity.not.complete'
          ? I18n.t('CLIENTS_DISTRIBUTION.RULE.UPDATE.INCOMPLETE_STATUS', { name })
          : I18n.t('CLIENTS_DISTRIBUTION.RULE.UPDATE.ERROR_MESSAGE'),
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
      status,
      createdAt,
      updatedAt,
      statusChangedAt,
      latestMigration,
    } = ruleData?.distributionRule || { name: '' };

    const allowedBaseUnits = executionType === 'MANUAL' ? ['AMOUNT', 'PERCENTAGE'] : ['PERCENTAGE'];

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
          />
        </div>
        <div className="DistributionRule__actions">
          <Button
            className="DistributionRule__actions-btn"
            onClick={this.handleCancel}
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
  }),
)(DistributionRule);
