import React, { Component, PropTypes } from 'react';
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
        <span className="player__account__details_additional-label">Additional information</span>
        <div className="panel panel-with-borders">
          <div className="panel-body padding-5 height-200">
            <small className="player__account__details_additional-label">
              DEPARTMENTS
            </small>
            {
              !!authorities.length &&
              <div className="row padding-15">
                {
                  authorities.map(authority =>
                    <span key={authority.id} className="label label-black margin-inline">
                      { renderLabel(authority.department, departmentsLabels) }
                      {' - '}
                      { renderLabel(authority.role, rolesLabels) }
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
