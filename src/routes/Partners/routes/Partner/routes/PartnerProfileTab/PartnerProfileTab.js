import React, { PureComponent } from 'react';
import { get } from 'lodash';
import PropTypes from 'constants/propTypes';
import PartnerPersonalInfoForm from './components/PartnerPersonalInfoForm';
import Schedule from './components/Schedule';
import './PartnerProfileTab.scss';

class PartnerProfileTab extends PureComponent {
  static propTypes = {
    partnerData: PropTypes.query({
      partner: PropTypes.partner,
    }).isRequired,
  }

  render() {
    const { partnerData } = this.props;

    return (
      <div className="PartnerProfileTab">
        <PartnerPersonalInfoForm
          partnerData={partnerData}
          disabled={this.readOnly}
        />

        <Schedule affiliateUuid={get(partnerData, 'data.partner.uuid') || ''} />
      </div>
    );
  }
}

export default PartnerProfileTab;
