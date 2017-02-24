import React, { Component, PropTypes } from 'react';
import ReactSwitch from 'react-toggle-switch'

class Switch extends Component {
  state = {
    active: false
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.active !== this.props.active) {
      this.setState({
        active: nextProps.active
      });
    }
  }

  handleSwitch = () => {
    this.setState({
      active: !this.state.active,
    }, () => {
      this.props.handleSwitch(this.state.active)
    });
  };

  render() {
    return (
      <ReactSwitch
        on={this.state.active}
        onClick={this.handleSwitch}
        className='small-switch'
      />
    );
  }
}

Switch.propTypes = {
  handleSwitch: PropTypes.func.isRequired,
};

export default Switch;
