import React, { PureComponent, Suspense } from 'react';
import I18n from 'i18n-js';
import { isEqual, cloneDeep } from 'lodash';
import { compose } from 'react-apollo';
import { Redirect, Switch } from 'react-router-dom';
import { withRequests, parseErrors } from 'apollo';
import { withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import { distributionRuleTabs } from 'config/menu';
import EventEmitter, { DISTRIBUTION_RULE_CHANGED } from 'utils/EventEmitter';
import { Button } from 'components/UI';
import ShortLoader from 'components/ShortLoader';
import Tabs from 'components/Tabs';
import Route from 'components/Route';
import DistributionRuleHeader from './components/DistributionRuleHeader';
import DistributionRuleInfo from './components/DistributionRuleInfo';
import DistributionRuleSettings from './components/DistributionRuleSettings';
import DistributionRuleBrands from './components/DistributionRuleBrands';
import DistributionRuleFeedsTab from './routes/DistributionRuleFeedsTab';
import {
  DistributionRuleQuery,
  DistributionRuleUpdate,
  DistributionRuleUpdateStatus,
} from './graphql';
import './DistributionRule.scss';

class DistributionRule extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    match: PropTypes.shape({
      url: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
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
        registrationDateRange,
        lastNotePeriodInHours,
        lastNoteDateRange,
        executionType,
        executionPeriodInHours,
        sourceBrandConfigs,
        targetBrandConfigs,
        affiliateUuids,
        firstTimeDeposit,
      } = data?.distributionRule || {};

      const sourceBrandConfig = sourceBrandConfigs && sourceBrandConfigs[0];
      const targetBrandConfig = sourceBrandConfigs && targetBrandConfigs[0];

      const { initialState } = DistributionRule;

      DistributionRule.initSettingsAreSet = true;
      DistributionRule.initialState = {
        ...initialState,
        generalSettings: {
          countries: countries && countries.sort((a, b) => a.localeCompare(b)),
          languages: languages && languages.sort((a, b) => a.localeCompare(b)),
          salesStatuses: salesStatuses && salesStatuses.sort((a, b) => a.localeCompare(b)),
          targetSalesStatus,
          registrationPeriodInHours,
          registrationDateRange,
          lastNotePeriodInHours,
          lastNoteDateRange,
          executionType: executionType || initialState.generalSettings.executionType,
          executionPeriodInHours,
          affiliateUuids,
          firstTimeDeposit,
        },
        sourceBrandConfig,
        targetBrandConfig,
      };

      return cloneDeep(DistributionRule.initialState);
    }

    const { initialState } = DistributionRule;

    const settingsWasChanged = !isEqual(
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

  handleSourceBrandConfig = ({ quantity, baseUnit, affiliateUuids, ...brandSettings }) => {
    const { generalSettings } = this.state;

    this.setState({
      sourceBrandConfig: {
        ...brandSettings,
        affiliateUuids,
        distributionUnit: {
          quantity,
          baseUnit,
        },
      },
      generalSettings,
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
      generalSettings: {
        registrationPeriodInHours,
        registrationDateRange,
        lastNotePeriodInHours,
        lastNoteDateRange,
        ...generalSettings
      },
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
            ...registrationPeriodInHours
              ? { registrationPeriodInHours }
              : { registrationDateRange },
            ...lastNotePeriodInHours
              ? { lastNotePeriodInHours }
              : { lastNoteDateRange },
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
        url,
        path,
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

    if (ruleLoading) {
      return <ShortLoader />;
    }

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

        <Tabs items={distributionRuleTabs} />

        <Suspense fallback={null}>
          <Switch>
            {/* General information tab */}
            <Route path={`${path}/general`}>
              <div className="card-body">
                <DistributionRuleSettings
                  loading={ruleLoading}
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
                  submitting={isSubmitting}
                  primary
                >
                  {I18n.t('COMMON.SAVE')}
                </Button>
              </div>
            </Route>

            {/* Feeds tab */}
            <Route path={`${path}/feed`} component={DistributionRuleFeedsTab} />

            <Redirect to={`${url}/general`} />
          </Switch>
        </Suspense>
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
