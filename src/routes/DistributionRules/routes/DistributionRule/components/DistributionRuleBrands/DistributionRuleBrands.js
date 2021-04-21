import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { withApollo, compose } from 'react-apollo';
import { withRequests } from 'apollo';
import { withModals } from 'hoc';
import PropTypes from 'constants/propTypes';
import MigrationButton from './components/MigrationButton';
import MigrationBrandCard from './components/MigrationBrandCard';
import AddSourceBrandModal from './components/AddSourceBrandModal';
import AddTargetBrandModal from './components/AddTargetBrandModal';
import { distributionRuleClientsAmountQuery } from '../../graphql';
import BrandsQuery from './graphql/BrandsQuery';
import './DistributionRuleBrands.scss';

class DistributionRuleBrands extends PureComponent {
  static propTypes = {
    modals: PropTypes.shape({
      addSourceBrandModal: PropTypes.modalType,
      addTargetBrandModal: PropTypes.modalType,
    }).isRequired,
    allowedBaseUnits: PropTypes.arrayOf(PropTypes.string).isRequired,
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
      registrationDateRange: PropTypes.shape({
        from: PropTypes.string,
        to: PropTypes.string,
      }),
      lastNotePeriodInHours: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),
      lastNoteDateRange: PropTypes.shape({
        from: PropTypes.string,
        to: PropTypes.string,
      }),
      executionType: PropTypes.string,
      executionPeriodInHours: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),
      languages: PropTypes.arrayOf(PropTypes.string),
      affiliateUuids: PropTypes.arrayOf(PropTypes.string),
      firstTimeDeposit: PropTypes.bool,
    }).isRequired,
    sourceBrandConfig: PropTypes.ruleSourceBrandConfigsType,
    targetBrandConfig: PropTypes.ruleSourceBrandConfigsType,
    handleSourceBrandConfig: PropTypes.func.isRequired,
    handleTargetBrandConfig: PropTypes.func.isRequired,
    addSourceBrandEnabled: PropTypes.bool.isRequired,
    addTargetBrandEnabled: PropTypes.bool.isRequired,
    handleRemoveBrandCard: PropTypes.func.isRequired,
    client: PropTypes.shape({
      query: PropTypes.func.isRequired,
    }).isRequired,
    brandsQuery: PropTypes.query({
      brands: PropTypes.arrayOf(PropTypes.brandConfig),
    }).isRequired,
  }

  static defaultProps = {
    sourceBrandConfig: null,
    targetBrandConfig: null,
  }

  state = {
    sourceBrandAbsoluteClientsCount: null,
    targetBrandAbsoluteClientsCount: null,
  };

  componentDidUpdate(prevProps) {
    // Calculate source brand absolute clients count
    if (!prevProps.sourceBrandConfig && this.props.sourceBrandConfig) {
      this.calculateSourceBrandAbsoluteClientsCount();
    }

    // Calculate target brand absolute clients count
    if (!prevProps.targetBrandConfig && this.props.targetBrandConfig) {
      this.calculateTargetBrandAbsoluteClientsCount();
    }
  }

  calculateSourceBrandAbsoluteClientsCount = async () => {
    const {
      brand: sourceBrand,
      desks,
      teams,
      distributionUnit: { quantity: sourceBrandQuantity, baseUnit },
    } = this.props.sourceBrandConfig;

    // Clear source brand absolute clients count if base unit isn't percentage
    if (baseUnit !== 'PERCENTAGE') {
      this.setState({ sourceBrandAbsoluteClientsCount: null });
      return;
    }

    const count = await this.fetchAvailableClientsAmount({ sourceBrand, desks, teams });

    const sourceBrandAbsoluteClientsCount = Math.floor(count / 100 * sourceBrandQuantity);

    this.setState({ sourceBrandAbsoluteClientsCount });
  };

  calculateTargetBrandAbsoluteClientsCount = async () => {
    const {
      brand: sourceBrand,
      desks,
      teams,
      distributionUnit: { quantity: sourceBrandQuantity },
    } = this.props.sourceBrandConfig;

    const {
      brand: targetBrand,
      distributionUnit: { quantity: targetBrandQuantity, baseUnit: targetBrandBaseUnit },
    } = this.props.targetBrandConfig;

    // Clear target brand absolute clients count if base unit isn't percentage
    if (targetBrandBaseUnit !== 'PERCENTAGE') {
      this.setState({ targetBrandAbsoluteClientsCount: null });
      return;
    }

    const count = await this.fetchAvailableClientsAmount({ sourceBrand, desks, teams }, targetBrand);

    const sourceBrandAbsoluteClientsCount = Math.floor(count / 100 * sourceBrandQuantity);
    const targetBrandAbsoluteClientsCount = Math.floor(sourceBrandAbsoluteClientsCount / 100 * targetBrandQuantity);

    this.setState({ targetBrandAbsoluteClientsCount });
  };

  handleAddSourceBrand = () => {
    const {
      modals: { addSourceBrandModal },
      handleSourceBrandConfig,
      allowedBaseUnits,
      sourceBrandConfig,
      brandsQuery,
    } = this.props;

    const brands = brandsQuery?.data?.brands || [];

    addSourceBrandModal.show({
      brands,
      allowedBaseUnits,
      ...sourceBrandConfig && {
        initialValues: sourceBrandConfig,
      },
      fetchAvailableClientsAmount: this.fetchAvailableClientsAmount,
      handleSubmit: (values) => {
        handleSourceBrandConfig(values);
        addSourceBrandModal.hide();

        this.calculateSourceBrandAbsoluteClientsCount();
        this.setState({ targetBrandAbsoluteClientsCount: null });
      },
    });
  };

  handleAddTargetBrand = () => {
    const {
      modals: {
        addTargetBrandModal,
      },
      handleTargetBrandConfig,
      sourceBrandConfig: {
        brand: sourceBrand,
        distributionUnit: {
          quantity: sourceBrandQuantity,
          baseUnit: sourceBrandBaseUnit,
        },
        desks,
        teams,
      },
      targetBrandConfig,
      brandsQuery,
    } = this.props;

    const brands = brandsQuery?.data?.brands || [];

    addTargetBrandModal.show({
      brands,
      sourceBrand,
      sourceBrandQuantity,
      initialValues: {
        ...targetBrandConfig,
        distributionUnit: {
          quantity: targetBrandConfig?.distributionUnit?.quantity,
          baseUnit: sourceBrandBaseUnit,
        },
        operator: targetBrandConfig?.operatorEntity?.uuid,
      },
      fetchAvailableClientsAmount: targetBrandId => (
        this.fetchAvailableClientsAmount({ sourceBrand, desks, teams }, targetBrandId)
      ),
      handleSubmit: (values) => {
        handleTargetBrandConfig(values);
        addTargetBrandModal.hide();

        this.calculateTargetBrandAbsoluteClientsCount();
      },
    });
  };

  handleRemoveBrandCard = (type) => {
    // Clear source and target brand absolute clients count if source brand was removed
    if (type === 'source') {
      this.setState({
        sourceBrandAbsoluteClientsCount: null,
        targetBrandAbsoluteClientsCount: null,
      });
    }

    // Clear target brand absolute clients count if source brand was removed
    if (type === 'target') {
      this.setState({ targetBrandAbsoluteClientsCount: null });
    }

    this.props.handleRemoveBrandCard(type);
  };

  fetchAvailableClientsAmount = async ({ sourceBrand, desks, teams }, targetBrand) => {
    const {
      client,
      generalSettings: {
        salesStatuses,
        countries,
        languages,
        affiliateUuids,
        registrationPeriodInHours,
        registrationDateRange,
        lastNotePeriodInHours,
        lastNoteDateRange,
        executionPeriodInHours,
        firstTimeDeposit,
      },
    } = this.props;

    try {
      const { data: { distributionRuleClientsAmount } } = await client.query({
        query: distributionRuleClientsAmountQuery,
        fetchPolicy: 'network-only',
        variables: {
          sourceBrand,
          targetBrand,
          salesStatuses,
          countries,
          languages,
          affiliateUuids,
          registrationPeriodInHours,
          registrationDateRange,
          lastNotePeriodInHours,
          lastNoteDateRange,
          executionPeriodInHours,
          firstTimeDeposit,
          desks,
          teams,
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
      brandsQuery,
    } = this.props;

    const brands = brandsQuery?.data?.brands || [];

    const sourceBrand = sourceBrandConfig && brands.find(brand => brand.brandId === sourceBrandConfig.brand);
    const targetBrand = targetBrandConfig && brands.find(brand => brand.brandId === targetBrandConfig.brand);

    return (
      <div className="DistributionRuleBrands">
        <div className="DistributionRuleBrands__headline">
          {I18n.t('CLIENTS_DISTRIBUTION.RULE.BRANDS_FOR_MIGRATION')}
        </div>
        <div className="DistributionRuleBrands__columns-wrapper">
          <div className="DistributionRuleBrands__column">
            <div className="DistributionRuleBrands__column-label">
              {I18n.t('CLIENTS_DISTRIBUTION.RULE.SOURCE_BRAND')}
            </div>
            <div className="DistributionRuleBrands__column-inner">
              <Choose>
                <When condition={sourceBrandConfig}>
                  <MigrationBrandCard
                    className="DistributionRuleBrands__card"
                    handleEditBrandCard={this.handleAddSourceBrand}
                    handleRemoveBrandCard={() => this.handleRemoveBrandCard('source')}
                    brandType="source"
                    {...sourceBrandConfig}
                    brand={sourceBrand}
                    absoluteClientsCount={this.state.sourceBrandAbsoluteClientsCount}
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
              {I18n.t('CLIENTS_DISTRIBUTION.RULE.TARGET_BRAND')}
            </div>
            <div className="DistributionRuleBrands__column-inner">
              <Choose>
                <When condition={targetBrandConfig}>
                  <MigrationBrandCard
                    className="DistributionRuleBrands__card"
                    handleEditBrandCard={this.handleAddTargetBrand}
                    handleRemoveBrandCard={() => this.handleRemoveBrandCard('target')}
                    brandType="target"
                    {...targetBrandConfig}
                    brand={targetBrand}
                    absoluteClientsCount={this.state.targetBrandAbsoluteClientsCount}
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
  withRequests({
    brandsQuery: BrandsQuery,
  }),
  withModals({
    addSourceBrandModal: AddSourceBrandModal,
    addTargetBrandModal: AddTargetBrandModal,
  }),
)(DistributionRuleBrands);
