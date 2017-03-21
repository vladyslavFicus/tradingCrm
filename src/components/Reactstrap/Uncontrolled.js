import React, { Component } from 'react';
import { Tooltip } from 'reactstrap';

const components = {
  UncontrolledTooltip: Tooltip,
};

Object.keys(components).forEach((key) => {
  const Tag = components[key];
  const defaultValue = false;

  class Uncontrolled extends Component {
    constructor(props) {
      super(props);

      this.state = { isOpen: defaultValue };

      this.toggle = this.toggle.bind(this);
    }

    toggle() {
      this.setState({ isOpen: !this.state.isOpen });
    }

    render() {
      return <Tag isOpen={this.state.isOpen} toggle={this.toggle} {...this.props} />;
    }
  }

  Uncontrolled.displayName = key;

  components[key] = Uncontrolled;
});

const UncontrolledTooltip = components.UncontrolledTooltip;

export {
  UncontrolledTooltip,
};
