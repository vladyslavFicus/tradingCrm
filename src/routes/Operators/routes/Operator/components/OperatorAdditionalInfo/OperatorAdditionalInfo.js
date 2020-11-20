import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import renderLabel from 'utils/renderLabel';
import { departmentsLabels, rolesLabels } from 'constants/operators';
import './OperatorAdditionalInfo.scss';

class OperatorAdditionalInfo extends PureComponent {
  static propTypes = {
    authorities: PropTypes.arrayOf(PropTypes.authorityEntity).isRequired,
  };

  render() {
    const { authorities } = this.props;

    return (
      <div className="OperatorAdditionalInfo">
        <div className="OperatorAdditionalInfo__title">
          {I18n.t('OPERATOR_PROFILE.DETAILS.LABEL.ADDITIONAL_INFORMATION')}
        </div>
        <div className="OperatorAdditionalInfo__content">
          <If condition={authorities.length}>
            <div className="OperatorAdditionalInfo__content-title">
              {I18n.t('OPERATOR_PROFILE.DETAILS.LABEL.DEPARTMENTS')}
            </div>

            <div className="OperatorAdditionalInfo__authorities">
              {
                authorities.map(({ id, department, role }) => (
                  <div key={id} className="OperatorAdditionalInfo__authority">
                    <div className="OperatorAdditionalInfo__authority-department">
                      {I18n.t(renderLabel(department, departmentsLabels))}
                    </div>
                    <div className="OperatorAdditionalInfo__authority-role">
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

export default OperatorAdditionalInfo;
