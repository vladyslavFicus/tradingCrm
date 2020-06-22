import React, { PureComponent } from 'react';
import SalesRules from 'components/SalesRules';

class PartnerSalesRulesTab extends PureComponent {
  render() {
    return <SalesRules type="PARTNER" isTab />;
  }
}

export default PartnerSalesRulesTab;
