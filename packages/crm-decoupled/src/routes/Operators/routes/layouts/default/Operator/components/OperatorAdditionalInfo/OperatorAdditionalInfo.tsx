import React from 'react';
import I18n from 'i18n-js';
import { Utils } from '@crm/common';
import { Authority } from '__generated__/types';
import { departmentsLabels, rolesLabels } from 'constants/operators';
import './OperatorAdditionalInfo.scss';

type Props = {
  authorities: Array<Authority>,
};

const OperatorAdditionalInfo = (props: Props) => {
  const { authorities } = props;

  return (
    <div className="OperatorAdditionalInfo">
      <div className="OperatorAdditionalInfo__title">
        {I18n.t('OPERATOR_PROFILE.DETAILS.LABEL.ADDITIONAL_INFORMATION')}
      </div>

      <div className="OperatorAdditionalInfo__content">
        <If condition={!!authorities.length}>
          <div className="OperatorAdditionalInfo__content-title">
            {I18n.t('OPERATOR_PROFILE.DETAILS.LABEL.DEPARTMENTS')}
          </div>

          <div className="OperatorAdditionalInfo__authorities">
            {
              authorities.map(({ id, department, role }) => (
                <div key={id} className="OperatorAdditionalInfo__authority">
                  <div className="OperatorAdditionalInfo__authority-department">
                    {I18n.t(Utils.renderLabel(department, departmentsLabels))}
                  </div>

                  <div className="OperatorAdditionalInfo__authority-role">
                    {I18n.t(Utils.renderLabel(role, rolesLabels))}
                  </div>
                </div>
              ))
            }
          </div>
        </If>
      </div>
    </div>
  );
};

export default React.memo(OperatorAdditionalInfo);
