import React from 'react';
import PropTypes from '../../../../../../constants/propTypes';

const IpList = ({ label, ips }) => (
  <div className="player__account__details_networking">
    <span className="player__account__details-label">{label}</span>
    <div className="panel">
      <div className="panel-body height-200">
        {
          ips.map(item => (
            <div key={item.ipAddress}>
              <i
                className={`fs-icon fs-${item.country.toLowerCase()}`}
                style={{ marginRight: 10 }}
              />
              {item.ipAddress}
            </div>
          ))
        }
      </div>
    </div>
  </div>
);
IpList.propTypes = {
  label: PropTypes.string.isRequired,
  ips: PropTypes.arrayOf(PropTypes.operatorIpEntity),
};
IpList.defaultProps = {
  ips: [],
};

export default IpList;
