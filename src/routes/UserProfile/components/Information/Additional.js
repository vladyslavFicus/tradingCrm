import React, { Component, PropTypes } from 'react';

class Additional extends Component {
  render() {
    return (
      <div className="player__account__details_additional col-md-3">
        <span className="player__account__details_additional-label">Additional information</span>
        <div className="panel panel-with-borders">
          <div className="panel-body padding-5">
            <small className="player__account__details_additional-label">
              Marketing
            </small>
            <div><b>SMS</b>: true</div>
            <div><b>News</b>: true</div>
            <div><b>Snail mail</b>: false</div>

            <small className="player__account__details_additional-label">
              Segments
            </small><br />
            <small className="label label-default">Bonus hater</small>
            <small className="label label-primary">Bonus hater</small>
            <small className="label label-danger">Bonus hater</small>
          </div>
        </div>
      </div>
    );
  }
}

Additional.propTypes = {};
Additional.defaultProps = {};

export default Additional;
