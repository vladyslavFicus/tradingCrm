import React, { Component } from 'react';

const styles = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  width: '100%',
  height: '24px',
};

class DebugPanel extends Component {
  state = {
    reduxLocked: false,
  };

  componentDidMount() {
    if (window.isFrame) {
      window.addEventListener('redux.lock', this.handleReduxLock);
      window.addEventListener('redux.unlock', this.handleReduxUnLock);
    }
  }

  componentWillUnmount() {
    if (window.isFrame) {
      window.removeEventListener('redux.lock', this.handleReduxLock);
      window.removeEventListener('redux.unlock', this.handleReduxLock);
    }
  }

  handleReduxLock = () => {
    this.setState({ reduxLocked: true });
  };

  handleReduxUnLock = () => {
    this.setState({ reduxLocked: false });
  };

  render() {
    const { reduxLocked } = this.state;

    if (window.isFrame) {
      return null;
    }

    return (
      <div style={{ ...styles, background: reduxLocked ? 'red' : 'green' }}>
        Locked: {reduxLocked ? 'True' : 'False'}
        {' | '}
        Version: {window.version}
      </div>
    );
  }
}

export default DebugPanel;
