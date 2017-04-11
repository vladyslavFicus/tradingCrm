import React, { Component, PropTypes } from 'react';

class PersonalInformationItem extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.any,
    verified: PropTypes.bool,
  };

  static defaultProps = {
    value: null,
    verified: false,
  };

  render() {
    const {
      label,
      value,
      verified,
    } = this.props;

    if (!value) {
      return null;
    }

    return (
      <div>
        <strong>{label}</strong>: {value}
        {' '}
        {verified && <i className="fa fa-check text-success" />}
      </div>
    );
  }
}

export default PersonalInformationItem;
