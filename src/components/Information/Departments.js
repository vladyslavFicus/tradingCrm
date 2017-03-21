import React, { Component, PropTypes } from 'react';

class Departments extends Component {
  static propTypes = {
    authorities: PropTypes.array.isRequired,
  };

  render() {
    const { authorities } = this.props;

    return (
      <div className="player__account__details_additional col-md-3">
        <span className="player__account__details_additional-label">Additional information</span>
        <div className="panel panel-with-borders">
          <div className="panel-body padding-5 height-200">
            <small className="player__account__details_additional-label">
              DEPARTMENTS
            </small>
            {
              authorities.length &&
              <div className="row padding-15">
                {
                  authorities.map(authority =>
                    <span key={authority.id} className="label label-black margin-inline">
                      {`${authority.department} - ${authority.role}`}
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
