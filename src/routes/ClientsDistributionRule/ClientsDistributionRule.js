import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { Button } from 'components/UI';
import MigrationSettings from './components/MigrationSettings';
import MigrationBrands from './components/MigrationBrands';
import './ClientsDistributionRule.scss';

class ClientsDistributionRule extends PureComponent {
  state = {
    generalSettings: null,
    addSourceBrandEnabled: false,
    addTargetBrandEnabled: false,
    sourceBrandSettings: null,
    targetBrandSettings: null,
  };

  handleGeneralSettings = (isValid, generalSettings) => {
    this.setState({
      generalSettings,
      sourceBrandSettings: null,
      targetBrandSettings: null,
      addSourceBrandEnabled: isValid,
      addTargetBrandEnabled: false,
    });
  };

  handleSourceBrandSettings = (brandSettings) => {
    this.setState(({ sourceBrandSettings, generalSettings, ...state }) => ({
      ...state,
      sourceBrandSettings: {
        ...sourceBrandSettings,
        ...generalSettings,
        ...brandSettings,
      },
      addSourceBrandEnabled: false,
      addTargetBrandEnabled: true,
    }));
  };

  handleTargetBrandSettings = (brandSettings) => {
    this.setState(({ targetBrandSettings, generalSettings, ...state }) => ({
      ...state,
      targetBrandSettings: {
        ...targetBrandSettings,
        ...generalSettings,
        ...brandSettings,
      },
      addTargetBrandEnabled: false,
    }));
  };

  handleRemoveBrandCard = key => (
    key === 'source'
      ? this.setState({
        sourceBrandSettings: null,
        addSourceBrandEnabled: true,
        addTargetBrandEnabled: false,
      })
      : this.setState(({ sourceBrandSettings }) => ({
        targetBrandSettings: null,
        addTargetBrandEnabled: !!sourceBrandSettings,
      }))
  );

  handleCreateRule = () => {};

  render() {
    const {
      generalSettings,
      sourceBrandSettings,
      targetBrandSettings,
      addSourceBrandEnabled,
      addTargetBrandEnabled,
    } = this.state;

    return (
      <div className="ClientsDistributionRule card">
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
            handleRemoveBrandCard={this.handleRemoveBrandCard}
          />
        </div>
        <div className="ClientsDistributionRule__actions">
          <Button
            className="ClientsDistributionRule__actions-btn"
            commonOutline
          >
            {I18n.t('COMMON.CANCEL')}
          </Button>
          <Button
            className="ClientsDistributionRule__actions-btn"
            onClick={this.handleCreateRule}
            disabled={!sourceBrandSettings || !targetBrandSettings}
            primary
          >
            {I18n.t('COMMON.SAVE')}
          </Button>
        </div>
      </div>
    );
  }
}

export default ClientsDistributionRule;
