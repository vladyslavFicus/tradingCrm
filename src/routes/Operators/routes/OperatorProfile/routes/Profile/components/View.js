import React, { Component, PropTypes } from 'react';

export default class OperatorProfile extends Component {
  render() {
    console.log(this.props);
    return (
      <div>Operator profile {this.props.params.id}</div>
    );
  }
}

OperatorProfile.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
