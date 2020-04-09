import React, { PureComponent } from 'react';
import { startCase } from 'lodash';
import { getBackofficeBrand } from 'config';
import './Copyrights.scss';

class Copyrights extends PureComponent {
  render() {
    const year = (new Date()).getFullYear();

    return (
      <div className="Copyrights">
        Copyright © {year} by {startCase(getBackofficeBrand().id)}
      </div>
    );
  }
}

export default Copyrights;
