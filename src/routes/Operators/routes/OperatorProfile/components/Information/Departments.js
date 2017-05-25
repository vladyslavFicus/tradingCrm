import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { renderLabel } from '../../../../utils';
import { departmentsLabels, rolesLabels } from '../../../../../../constants/operators';

class Departments extends Component {
  static propTypes = {
    authorities: PropTypes.arrayOf(PropTypes.shape({
      department: PropTypes.string,
      id: PropTypes.number,
      role: PropTypes.string,
    })),
  };

  render() {
    const { authorities } = this.props;

    return (
      <div className="player__account__details_additional">
        <span className="player__account__details-label">Additional information</span>
        <div className="panel">
          <div className="panel-body height-200">
            <small className="player__account__details_additional-label">
              {I18n.t('COMMON.DEPARTMENTS')}
            </small>
            {
              !!authorities.length &&
              <div className="row player__account__details_additional-departments">
                {
                  authorities.map(authority =>
                    <span key={authority.id} className="label label-black">
                      <div className="label-department">
                        { renderLabel(authority.department, departmentsLabels) }
                      </div>
                      <div className="label-role">
                        { renderLabel(authority.role, rolesLabels) }
                      </div>
                    </span>
                  )
                }
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Departments;
