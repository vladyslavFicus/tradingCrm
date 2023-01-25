import React from 'react';
import { startCase } from 'lodash';
import moment from 'moment';
import { getBackofficeBrand } from 'config';
import './Copyrights.scss';

const Copyrights = () => (
  <div className="Copyrights">
    Copyright © {moment().year()} by {startCase(getBackofficeBrand().id)}
  </div>
);

export default Copyrights;
