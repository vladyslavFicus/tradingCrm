import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class BonusView extends PureComponent {
  render() {
    const { data: { uuid } } = this.props;

    return (
      <div className="row">
        {uuid}
        TODO BONUS VIEW
      </div>
    );
  }
}

