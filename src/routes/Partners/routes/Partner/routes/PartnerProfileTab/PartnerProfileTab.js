import React, { PureComponent } from 'react';
import PropTypes from 'constants/propTypes';
import PartnerPersonalInfoForm from './components/PartnerPersonalInfoForm';
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
      </div>
    );
  }
}

export default PartnerProfileTab;
