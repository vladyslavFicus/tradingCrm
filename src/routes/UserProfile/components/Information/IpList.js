import React, { Component, PropTypes } from 'react';
import { v4 } from 'uuid';

class IpList extends Component {
  render() {
    const { ips } = this.props;

    return (
      <div className="player__account__details_networking col-md-2">
        <span className="player__account__details_networking-label">Last 10 ip's</span>
        <div className="panel panel-with-borders">
          <div className="panel-body">
            {
              ips.map((item) => (
                <div key={v4()}>
                  <i className="fs-icon fs-gb" style={{ marginRight: 10 }}></i>
                  {item.ipAddress}
                </div>
              ))
            }
          </div>
        </div>
      </div>
    );
  }
}

IpList.propTypes = {};
IpList.defaultProps = {};

export default IpList;
