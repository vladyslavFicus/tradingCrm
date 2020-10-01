import React, { PureComponent } from 'react';
import MigrationSettings from './components/MigrationSettings';
import MigrationBrands from './components/MigrationBrands';

class ClientsDistributionRule extends PureComponent {
  state = {
    generalSettings: null,
    addSourceBrandEnabled: false,
    addTargetBrandEnabled: false,
    sourceBrandSettings: null,
    targetBrandSettings: null,
  };

  handleGeneralSettings = (isValid, generalSettings) => {
    if (isValid) {
      const { sourceBrandSettings } = this.state;

      this.setState({
        generalSettings,
        addSourceBrandEnabled: !sourceBrandSettings,
        addTargetBrandEnabled: !!sourceBrandSettings,
      });
    }
  };

  handleSourceBrandSettings = (brandSettings) => {
    this.setState(({ sourceBrandSettings, generalSettings, ...state }) => ({
      ...state,
      generalSettings: null,
      sourceBrandSettings: {
        ...sourceBrandSettings,
        ...generalSettings,
        ...brandSettings,
      },
      addSourceBrandEnabled: false,
    }));
  };

  handleTargetBrandSettings = (brandSettings) => {
    this.setState(({ targetBrandSettings, generalSettings, ...state }) => ({
      ...state,
      generalSettings: null,
      targetBrandSettings: {
        ...targetBrandSettings,
        ...generalSettings,
        ...brandSettings,
      },
      addTargetBrandEnabled: false,
    }));
  };

  render() {
    const {
      generalSettings,
      sourceBrandSettings,
      targetBrandSettings,
      addSourceBrandEnabled,
      addTargetBrandEnabled,
    } = this.state;

    return (
      <div className="card">
        <div className="card-heading">Rule 11110000</div>
        <div className="card-body">
          <MigrationSettings
            generalSettings={generalSettings}
            handleGeneralSettings={this.handleGeneralSettings}
          />
          <MigrationBrands
            sourceBrandSettings={sourceBrandSettings}
            targetBrandSettings={targetBrandSettings}
            handleSourceBrandSettings={this.handleSourceBrandSettings}
            handleTargetBrandSettings={this.handleTargetBrandSettings}
            addSourceBrandEnabled={addSourceBrandEnabled}
            addTargetBrandEnabled={addTargetBrandEnabled}
          />
        </div>
        <div className="card-footer">Rule 11110000</div>
      </div>
    );
  }
}

export default ClientsDistributionRule;
