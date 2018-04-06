import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class FreeSpinView extends PureComponent {
  render() {
    const { data: { uuid } } = this.props;

    return (
      <div className="row">
        {uuid}
        TODO FREE SPIN VIEW
      </div>
    );
  }
}
