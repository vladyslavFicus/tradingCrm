import React from 'react';
import { startCase } from 'lodash';
import { getBackofficeBrand } from 'config';

const year = (new Date()).getFullYear();

const Copyrights = () => (
  <div className="form-page__copyright">
    Copyright © {year} by {startCase(getBackofficeBrand().id)}
  </div>
);

export default Copyrights;
