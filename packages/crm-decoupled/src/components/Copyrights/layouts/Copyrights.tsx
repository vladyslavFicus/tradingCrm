import React from 'react';
import { startCase } from 'lodash';
import moment from 'moment';
import { Config } from '@crm/common';
import './Copyrights.scss';

const Copyrights = () => (
  <div className="Copyrights">
    Copyright © {moment().year()} by {startCase(Config.getBackofficeBrand().id)}
  </div>
);

export default React.memo(Copyrights);
