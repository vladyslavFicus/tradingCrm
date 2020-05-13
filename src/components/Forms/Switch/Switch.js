import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ReactSwitch from '../../ReactSwitch';

class Switch extends Component {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    handleSwitch: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    disabled: false,
  };

  state = {
    active: this.props.active,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.active !== nextProps.active) {
      return { active: nextProps.active };
    }

    return null;
  }

  revert = _.debounce(this.toggle, 301); // eslint-ignore-line

  toggle = () => {
    this.setState(({ active }) => ({
      active: !active,
    }));
  };

  handleSwitch = async () => {
    this.toggle();

    const action = await this.props.handleSwitch(!this.state.active);

    if (action && action.error) {
      this.revert();
    }
  };

  render() {
    const { active } = this.state;
    const { disabled } = this.props;

    return (
      <ReactSwitch
        on={active}
        onClick={this.handleSwitch}
        disabled={disabled}
      />
    );
  }
}

export default Switch;
