import React from 'react';
import I18n from 'i18n-js';
import renderLabel from 'utils/renderLabel';
import PropTypes from 'constants/propTypes';
import { departmentsLabels, rolesLabels } from 'constants/operators';

const Departments = ({ authorities }) => (
  <div className="account-details__additional-info">
    <span className="account-details__label">
      {I18n.t('OPERATOR_PROFILE.DETAILS.LABEL.ADDITIONAL_INFORMATION')}
    </span>
    <div className="card">
      <div className="card-body">
        <span className="account-details__additional-info__label">
          {I18n.t('OPERATOR_PROFILE.DETAILS.LABEL.DEPARTMENTS')}
        </span>
        {
          !!authorities.length
          && (
            <div className="margin-top-5">
              {
                authorities.map(authority => (
                  <div key={authority.id} className="badge badge-black">
                    <div className="badge-department">
                      { I18n.t(renderLabel(authority.department, departmentsLabels)) }
                    </div>
                    <div className="badge-role">
                      { I18n.t(renderLabel(authority.role, rolesLabels)) }
                    </div>
                  </div>
                ))
              }
            </div>
          )
        }
      </div>
    </div>
  </div>
);

Departments.propTypes = {
  authorities: PropTypes.arrayOf(PropTypes.authorityEntity),
};

Departments.defaultProps = {
  authorities: [],
};

export default Departments;
