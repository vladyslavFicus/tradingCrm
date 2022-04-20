import React from 'react';
import DistributionRuleForm from './components/DistributionRuleForm';
import './DistributionRuleGeneral.scss';

const DistributionRuleGeneral = () => (
  <div className="DistributionRuleGeneral">
    <DistributionRuleForm />
  </div>
);

export default React.memo(DistributionRuleGeneral);
