import React, { PureComponent } from 'react';
import SalesRules from 'components/SalesRules';

class OperatorSalesRulesTab extends PureComponent {
  render() {
    return <SalesRules type="OPERATOR" isTab />;
  }
}

export default OperatorSalesRulesTab;
