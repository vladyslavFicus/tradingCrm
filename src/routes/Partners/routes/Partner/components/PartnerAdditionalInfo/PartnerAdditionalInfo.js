import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import renderLabel from 'utils/renderLabel';
import { departmentsLabels, rolesLabels } from 'constants/operators';
import './PartnerAdditionalInfo.scss';

class PartnerAdditionalInfo extends PureComponent {
  static propTypes = {
    authorities: PropTypes.arrayOf(PropTypes.authorityEntity),
  };

  static defaultProps = {
    authorities: [],
  };

  render() {
    const { authorities } = this.props;

    return (
      <div className="PartnerAdditionalInfo">
        <div className="PartnerAdditionalInfo__title">
          {I18n.t('PARTNER_PROFILE.DETAILS.LABEL.ADDITIONAL_INFORMATION')}
        </div>
        <div className="PartnerAdditionalInfo__content">
          <If condition={authorities.length}>
            <div className="PartnerAdditionalInfo__content-title">
              {I18n.t('PARTNER_PROFILE.DETAILS.LABEL.DEPARTMENTS')}
            </div>

            <div className="PartnerAdditionalInfo__authorities">
              {
                authorities.map(({ id, department, role }) => (
                  <div key={id} className="PartnerAdditionalInfo__authority">
                    <div className="PartnerAdditionalInfo__authority-department">
                      {I18n.t(renderLabel(department, departmentsLabels))}
                    </div>
                    <div className="PartnerAdditionalInfo__authority-role">
                      {I18n.t(renderLabel(role, rolesLabels))}
                    </div>
                  </div>
                ))
              }
            </div>
          </If>
        </div>
      </div>
    );
  }
}

export default PartnerAdditionalInfo;
