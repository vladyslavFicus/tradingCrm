import React, { PureComponent } from 'react';

export default class FreeSpinView extends PureComponent {
  render() {
    const { uuid } = this.props;

    return (
      <div className="row">
        {uuid}
        TODO FREE SPIN VIEW
      </div>
    );
  }
}
