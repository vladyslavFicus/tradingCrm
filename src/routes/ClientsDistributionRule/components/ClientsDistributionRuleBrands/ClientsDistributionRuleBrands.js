import React, { PureComponent } from 'react';
import { withModals } from 'hoc';
import PropTypes from 'constants/propTypes';
import MigrationButton from './components/MigrationButton';
import MigrationBrandCard from './components/MigrationBrandCard';
import AddSourceBrandModal from './components/AddSourceBrandModal';
import AddTargetBrandModal from './components/AddTargetBrandModal';
import './ClientsDistributionRuleBrands.scss';

class ClientsDistributionRuleBrands extends PureComponent {
  static propTypes = {
    modals: PropTypes.shape({
      addSourceBrandModal: PropTypes.object,
      addTargetBrandModal: PropTypes.object,
    }).isRequired,
    sourceBrandConfig: PropTypes.object,
    targetBrandConfig: PropTypes.object,
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
  }

  static defaultProps = {
    sourceBrandConfig: null,
    targetBrandConfig: null,
  }

  handleAddSourceBrand = () => {
    const {
      modals: { addSourceBrandModal },
      handleSourceBrandConfig,
      sourceBrandConfig,
    } = this.props;

    addSourceBrandModal.show({
      ...sourceBrandConfig && {
        initialValues: sourceBrandConfig,
      },
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
      ...targetBrandConfig && {
        initialValues: targetBrandConfig,
      },
      handleSubmit: (values) => {
        handleTargetBrandConfig(values);
        addTargetBrandModal.hide();
      },
    });
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
      <div className="ClientsDistributionRuleBrands">
        <div className="ClientsDistributionRuleBrands__headline">Brands for migration</div>
        <div className="ClientsDistributionRuleBrands__columns-wrapper">
          <div className="ClientsDistributionRuleBrands__column">
            <div className="ClientsDistributionRuleBrands__column-label">From brand</div>
            <div className="ClientsDistributionRuleBrands__column-inner">
              <Choose>
                <When condition={sourceBrandConfig}>
                  <MigrationBrandCard
                    className="ClientsDistributionRuleBrands__card"
                    handleEditBrandCard={this.handleAddSourceBrand}
                    handleRemoveBrandCard={() => handleRemoveBrandCard('source')}
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
          <div className="ClientsDistributionRuleBrands__column">
            <div className="ClientsDistributionRuleBrands__column-label">To brand</div>
            <div className="ClientsDistributionRuleBrands__column-inner">
              <Choose>
                <When condition={targetBrandConfig}>
                  <MigrationBrandCard
                    className="ClientsDistributionRuleBrands__card"
                    handleEditBrandCard={this.handleAddTargetBrand}
                    handleRemoveBrandCard={() => handleRemoveBrandCard('target')}
                    operators={operators}
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

export default withModals({
  addSourceBrandModal: AddSourceBrandModal,
  addTargetBrandModal: AddTargetBrandModal,
})(ClientsDistributionRuleBrands);
