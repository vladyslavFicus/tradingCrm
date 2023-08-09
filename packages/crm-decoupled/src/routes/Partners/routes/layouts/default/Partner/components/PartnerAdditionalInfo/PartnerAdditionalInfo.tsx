import React from 'react';
import I18n from 'i18n-js';
import { Utils } from '@crm/common';
import { Authority } from '__generated__/types';
import { departmentsLabels, rolesLabels } from 'constants/operators';
import './PartnerAdditionalInfo.scss';

type Props = {
  authorities: Array<Authority>,
};

const PartnerAdditionalInfo = (props: Props) => {
  const { authorities } = props;

  return (
    <div className="PartnerAdditionalInfo">
      <div className="PartnerAdditionalInfo__title">
        {I18n.t('PARTNER_PROFILE.DETAILS.LABEL.ADDITIONAL_INFORMATION')}
      </div>

      <div className="PartnerAdditionalInfo__content">
        <If condition={!!authorities.length}>
          <div className="PartnerAdditionalInfo__content-title">
            {I18n.t('PARTNER_PROFILE.DETAILS.LABEL.DEPARTMENTS')}
          </div>

          <div className="PartnerAdditionalInfo__authorities">
            {
              authorities.map(({ id, department, role }) => (
                <div key={id} className="PartnerAdditionalInfo__authority">
                  <div className="PartnerAdditionalInfo__authority-department">
                    {I18n.t(Utils.renderLabel(department, departmentsLabels))}
                  </div>

                  <div className="PartnerAdditionalInfo__authority-role">
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

export default React.memo(PartnerAdditionalInfo);
