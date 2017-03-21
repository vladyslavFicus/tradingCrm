import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Personal from '../../../../../components/Information/Personal';
import Departments from '../../../../../components/Information/Departments';
import IpList from '../../../../../components/Information/IpList';
import '../../../../../components/Information/Information.scss';

class Information extends Component {
  static propTypes = {
    data: PropTypes.object,
    ips: PropTypes.array.isRequired,
  };

  render() {
    const {
      data,
      ips,
    } = this.props;

    return (
      <div
        className={classNames('player__account__details row panel-body profile-information')}
      >
        <Personal data={data} />
        <Departments
          authorities={data.authorities}
        />
        <IpList ips={ips} />
      </div>
    );
  }
}

export default Information;
