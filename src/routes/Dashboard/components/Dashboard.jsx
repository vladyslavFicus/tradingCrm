import React, { Fragment } from 'react';
import { I18n } from 'react-redux-i18n';
import { charts } from '../constants';
import './Dashboard.scss';

const Dashboard = () => (
  <Fragment>
    <div className="font-size-20 margin-bottom-15" id="users-list-header">
      {I18n.t('COMMON.DASHBOARD')}
    </div>
    <div className="row">
      <div className="col-md-4">
        {charts.map(({ component: Chart, name }) => (
          <Chart key={name} />
        ))}
      </div>
    </div>
  </Fragment>
);

export default Dashboard;
