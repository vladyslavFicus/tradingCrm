import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'reactstrap';

class DropDownWrapper extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      opened: false,
    };
  }

  toggle() {
    this.setState({
      opened: !this.state.opened,
    });
  }

  render() {
    const { opened } = this.state;
    const { children, className } = this.props;

    return (
      <Dropdown
        className={className}
        isOpen={opened}
        toggle={this.toggle}
      >
        {children}
      </Dropdown>
    );
  }
}

DropDownWrapper.propTypes = {
  className: PropTypes.string,
};

export default DropDownWrapper;
