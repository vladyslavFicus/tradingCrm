import React, { PureComponent } from 'react';
import { Tooltip } from 'reactstrap';

const components = {
  UncontrolledTooltip: Tooltip,
};

Object.keys(components).forEach((key) => {
  const Tag = components[key];

  class Uncontrolled extends PureComponent {
    state = {
      isOpen: false,
    };

    toggle = () => {
      this.setState(({ isOpen }) => ({ isOpen: !isOpen }));
    };

    render() {
      return <Tag isOpen={this.state.isOpen} toggle={this.toggle} {...this.props} />;
    }
  }

  Uncontrolled.displayName = key;

  components[key] = Uncontrolled;
});

const { UncontrolledTooltip } = components;

export {
  UncontrolledTooltip,
};
