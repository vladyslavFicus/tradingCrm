import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ReactSwitch from '../../../components/ReactSwitch';

class Switch extends Component {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    handleSwitch: PropTypes.func.isRequired,
  };

  state = {
    active: false,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.active !== this.props.active) {
      this.setState({
        active: nextProps.active,
      });
    }
  }

  toggle = () => {
    this.setState({
      active: !this.state.active,
    });
  }

  revert = _.debounce(this.toggle, 301);

  handleSwitch = async () => {
    this.toggle();

    const action = await this.props.handleSwitch(!this.state.active);
    if (action && action.error) {
      this.revert();
    }
  };

  render() {
    return (
      <ReactSwitch
        on={this.state.active}
        onClick={this.handleSwitch}
      />
    );
  }
}

export default Switch;
