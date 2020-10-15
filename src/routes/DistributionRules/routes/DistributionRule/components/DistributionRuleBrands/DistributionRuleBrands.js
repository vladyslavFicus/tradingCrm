import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { withApollo, compose } from 'react-apollo';
import { withModals } from 'hoc';
import PropTypes from 'constants/propTypes';
import MigrationButton from './components/MigrationButton';
import MigrationBrandCard from './components/MigrationBrandCard';
import AddSourceBrandModal from './components/AddSourceBrandModal';
import AddTargetBrandModal from './components/AddTargetBrandModal';
import { distributionRuleClientsAmountQuery } from '../../graphql';
import './DistributionRuleBrands.scss';

class DistributionRuleBrands extends PureComponent {
  static propTypes = {
    modals: PropTypes.shape({
      addSourceBrandModal: PropTypes.modalType,
      addTargetBrandModal: PropTypes.modalType,
    }).isRequired,
    allowedBaseUnit: PropTypes.string.isRequired,
    generalSettings: PropTypes.shape({
      countries: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.string,
      ]),
      salesStatuses: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.string,
      ]),
      targetSalesStatus: PropTypes.string,
      registrationPeriodInHours: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),
      executionType: PropTypes.string,
      executionPeriodInHours: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),
    }).isRequired,
    sourceBrandConfig: PropTypes.ruleSourceBrandConfigsType,
    targetBrandConfig: PropTypes.ruleSourceBrandConfigsType,
    handleSourceBrandConfig: PropTypes.func.isRequired,
    handleTargetBrandConfig: PropTypes.func.isRequired,
    addSourceBrandEnabled: PropTypes.bool.isRequired,
    addTargetBrandEnabled: PropTypes.bool.isRequired,
    handleRemoveBrandCard: PropTypes.func.isRequired,
    operatorsQuery: PropTypes.query({
      operators: PropTypes.pageable(PropTypes.shape({
        uuid: PropTypes.string,
        fullName: PropTypes.string,
      })),
    }).isRequired,
    client: PropTypes.shape({
      query: PropTypes.func.isRequired,
    }).isRequired,
  }

  static defaultProps = {
    sourceBrandConfig: null,
    targetBrandConfig: null,
  }

  handleAddSourceBrand = () => {
    const {
      modals: { addSourceBrandModal },
      handleSourceBrandConfig,
      allowedBaseUnit,
      sourceBrandConfig,
    } = this.props;

    addSourceBrandModal.show({
      allowedBaseUnit,
      ...sourceBrandConfig && {
        initialValues: sourceBrandConfig,
      },
      fetchAvailableClientsAmount: this.fetchAvailableClientsAmount,
      handleSubmit: (values) => {
        handleSourceBrandConfig(values);
        addSourceBrandModal.hide();
      },
    });
  };

  handleAddTargetBrand = () => {
    const {
      modals: { addTargetBrandModal },
      handleTargetBrandConfig,
      allowedBaseUnit,
      sourceBrandConfig: { brand: sourceBrand },
      targetBrandConfig,
      operatorsQuery: {
        data: operatorsData,
        loading: operatorsLoading,
      },
    } = this.props;

    const operators = operatorsData?.operators?.content || [];

    addTargetBrandModal.show({
      operators,
      operatorsLoading,
      sourceBrand,
      allowedBaseUnit,
      ...targetBrandConfig && {
        initialValues: targetBrandConfig,
      },
      fetchAvailableClientsAmount: this.fetchAvailableClientsAmount,
      handleSubmit: (values) => {
        handleTargetBrandConfig(values);
        addTargetBrandModal.hide();
      },
    });
  };

  fetchAvailableClientsAmount = async (sourceBrand, targetBrand) => {
    const {
      client,
      generalSettings: {
        salesStatuses,
        countries,
        registrationPeriodInHours,
        executionPeriodInHours,
      },
    } = this.props;

    try {
      const { data: { distributionRuleClientsAmount } } = await client.query({
        query: distributionRuleClientsAmountQuery,
        variables: {
          sourceBrand,
          targetBrand,
          salesStatuses,
          countries,
          registrationPeriodInHours,
          executionPeriodInHours,
        },
      });

      return distributionRuleClientsAmount;
    } catch {
      // ...
    }

    return null;
  };

  render() {
    const {
      addSourceBrandEnabled,
      addTargetBrandEnabled,
      sourceBrandConfig,
      targetBrandConfig,
      handleRemoveBrandCard,
      operatorsQuery: {
        data: operatorsData,
      },
    } = this.props;

    const operators = operatorsData?.operators?.content || [];

    return (
      <div className="DistributionRuleBrands">
        <div className="DistributionRuleBrands__headline">
          {I18n.t('CLIENTS_DISTRIBUTION.RULE.BRANDS_FOR_MIGRATION')}
        </div>
        <div className="DistributionRuleBrands__columns-wrapper">
          <div className="DistributionRuleBrands__column">
            <div className="DistributionRuleBrands__column-label">
              {I18n.t('CLIENTS_DISTRIBUTION.RULE.FROM_BRAND')}
            </div>
            <div className="DistributionRuleBrands__column-inner">
              <Choose>
                <When condition={sourceBrandConfig}>
                  <MigrationBrandCard
                    className="DistributionRuleBrands__card"
                    handleEditBrandCard={this.handleAddSourceBrand}
                    handleRemoveBrandCard={() => handleRemoveBrandCard('source')}
                    brandType="source"
                    {...sourceBrandConfig}
                  />
                </When>
                <Otherwise>
                  <MigrationButton
                    onClick={this.handleAddSourceBrand}
                    disabled={!addSourceBrandEnabled}
                  />
                </Otherwise>
              </Choose>
            </div>
          </div>
          <div className="DistributionRuleBrands__column">
            <div className="DistributionRuleBrands__column-label">
              {I18n.t('CLIENTS_DISTRIBUTION.RULE.TO_BRAND')}
            </div>
            <div className="DistributionRuleBrands__column-inner">
              <Choose>
                <When condition={targetBrandConfig}>
                  <MigrationBrandCard
                    className="DistributionRuleBrands__card"
                    handleEditBrandCard={this.handleAddTargetBrand}
                    handleRemoveBrandCard={() => handleRemoveBrandCard('target')}
                    operators={operators}
                    brandType="target"
                    {...targetBrandConfig}
                  />
                </When>
                <Otherwise>
                  <MigrationButton
                    onClick={this.handleAddTargetBrand}
                    disabled={!addTargetBrandEnabled}
                  />
                </Otherwise>
              </Choose>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  withApollo,
  withModals({
    addSourceBrandModal: AddSourceBrandModal,
    addTargetBrandModal: AddTargetBrandModal,
  }),
)(DistributionRuleBrands);
