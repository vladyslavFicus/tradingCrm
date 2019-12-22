import React from 'react';
import { startCase } from 'lodash';
import { getBackofficeBrand } from 'config';
import './copyrights.scss';

const year = (new Date()).getFullYear();

const Copyrights = () => (
  <div className="copyrights">
    Copyright © {year} by {startCase(getBackofficeBrand().id)}
  </div>
);

export default Copyrights;
