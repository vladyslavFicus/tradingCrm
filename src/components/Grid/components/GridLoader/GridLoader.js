import React, { PureComponent } from 'react';
import ShortLoader from 'components/ShortLoader';
import './GridLoader.scss';

class GridLoader extends PureComponent {
  render() {
    return (
      <tr>
        <td className="GridLoader" colSpan="100%">
          <ShortLoader />
        </td>
      </tr>
    );
  }
}

export default GridLoader;
