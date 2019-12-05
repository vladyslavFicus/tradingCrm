import React from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import renderLabel from '../../../../../../../utils/renderLabel';
import { departmentsLabels, rolesLabels } from '../../../../../../../constants/operators';

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
                  <span key={authority.id} className="badge badge-black">
                    <div className="badge-department">
                      { I18n.t(renderLabel(authority.department, departmentsLabels)) }
                    </div>
                    <div className="badge-role">
                      { I18n.t(renderLabel(authority.role, rolesLabels)) }
                    </div>
                  </span>
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
  authorities: PropTypes.arrayOf(PropTypes.shape({
    department: PropTypes.string,
    id: PropTypes.number,
    role: PropTypes.string,
  })),
};

Departments.defaultProps = {
  authorities: [],
};

export default Departments;
