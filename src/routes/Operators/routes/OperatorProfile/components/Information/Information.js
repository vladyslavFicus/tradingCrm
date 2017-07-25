import React from 'react';
import { I18n } from 'react-redux-i18n';
import Personal from './Personal';
import Departments from './Departments';
import IpList from './IpList';
import PropTypes from '../../../../../../constants/propTypes';
import './Information.scss';

const Information = ({ data, ips }) => (
  <div className="player__account__details">
    <div className="row">
      <div className="col-md-4">
        <Personal data={data} />
      </div>
      <div className="col-md-3">
        <Departments authorities={data.authorities} />
      </div>
      <div className="col-md-2">
        <IpList label={I18n.t('OPERATOR_PROFILE.IP_LIST.TITLE')} ips={ips} />
      </div>
    </div>
  </div>
);

Information.propTypes = {
  data: PropTypes.operatorProfile.isRequired,
  ips: PropTypes.array.isRequired,
};

export default Information;
