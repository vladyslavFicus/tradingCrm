import React, { PureComponent } from 'react';
import { Tooltip } from 'reactstrap';
import PropTypes from 'prop-types';

const components = {
  UncontrolledTooltip: Tooltip,
};

Object.keys(components).forEach((key) => {
  const Tag = components[key];

  class Uncontrolled extends PureComponent {
    static propTypes = {
      isOpenDefault: PropTypes.bool,
    };

    static defaultProps = {
      isOpenDefault: false,
    }

    state = {
      isOpen: this.props.isOpenDefault,
    };

    toggle = () => {
      this.setState(({ isOpen }) => ({ isOpen: !isOpen }));
    };

    render() {
      const {
        isOpenDefault,
        ...props
      } = this.props;

      return <Tag isOpen={this.state.isOpen} toggle={this.toggle} {...props} />;
    }
  }

  Uncontrolled.displayName = key;

  components[key] = Uncontrolled;
});

const { UncontrolledTooltip } = components;

export {
  UncontrolledTooltip,
};
