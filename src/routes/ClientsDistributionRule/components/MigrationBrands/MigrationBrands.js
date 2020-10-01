import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withModals } from 'hoc';
import MigrationButton from './components/MigrationButton';
import MigrationBrandCard from './components/MigrationBrandCard';
import AddSourceBrandModal from './components/AddSourceBrandModal';
import AddTargetBrandModal from './components/AddTargetBrandModal';
import './MigrationBrands.scss';

class MigrationBrands extends PureComponent {
  static propTypes = {
    modals: PropTypes.shape({
      addSourceBrandModal: PropTypes.object,
      addTargetBrandModal: PropTypes.object,
    }).isRequired,
    sourceBrandSettings: PropTypes.object,
    targetBrandSettings: PropTypes.object,
    handleSourceBrandSettings: PropTypes.func.isRequired,
    handleTargetBrandSettings: PropTypes.func.isRequired,
    addSourceBrandEnabled: PropTypes.bool.isRequired,
    addTargetBrandEnabled: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    sourceBrandSettings: null,
    targetBrandSettings: null,
  }

  handleAddSourceBrand = () => {
    const {
      modals: { addSourceBrandModal },
      handleSourceBrandSettings,
    } = this.props;

    addSourceBrandModal.show({
      handleSubmit: (values) => {
        handleSourceBrandSettings(values);
        addSourceBrandModal.hide();
      },
    });
  };

  handleAddTargetBrand = () => {
    const {
      modals: { addTargetBrandModal },
      handleTargetBrandSettings,
    } = this.props;

    addTargetBrandModal.show({
      handleSubmit: (values) => {
        handleTargetBrandSettings(values);
        addTargetBrandModal.hide();
      },
    });
  };

  render() {
    const {
      addSourceBrandEnabled,
      addTargetBrandEnabled,
      sourceBrandSettings,
      targetBrandSettings,
    } = this.props;

    return (
      <div className="MigrationBrands">
        <div className="MigrationBrands__headline">Brands for migration</div>
        <div className="MigrationBrands__columns-wrapper">
          <div className="MigrationBrands__column">
            <div className="MigrationBrands__column-label">From brand</div>
            <div className="MigrationBrands__column-inner">
              <Choose>
                <When condition={sourceBrandSettings}>
                  <MigrationBrandCard
                    className="MigrationBrands__card"
                    {...sourceBrandSettings}
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
          <div className="MigrationBrands__column">
            <div className="MigrationBrands__column-label">To brand</div>
            <div className="MigrationBrands__column-inner">
              <Choose>
                <When condition={targetBrandSettings}>
                  <MigrationBrandCard
                    className="MigrationBrands__card"
                    {...targetBrandSettings}
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
})(MigrationBrands);
