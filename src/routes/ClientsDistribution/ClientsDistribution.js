import React, { PureComponent } from 'react';
import RulesSelection from './components/RulesSelection';
import BrandsSelection from './components/BrandsSelection';

class ClientsDistribution extends PureComponent {
  render() {
    return (
      <div className="card">
        <h2 className="card-heading">Clients Distribution</h2>
        <div className="card-body">
          <RulesSelection />
          <BrandsSelection />
        </div>
      </div>
    );
  }
}

export default ClientsDistribution;
