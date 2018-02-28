import React, { Component } from 'react';
import '../../styles/style.scss';
import './BlackLayout.scss';

class BlackLayout extends Component {
  componentWillMount() {
    document.body.classList.add('black-layout');
  }

  componentWillUnmount() {
    document.body.classList.remove('black-layout');
  }

  render() {
    const { children } = this.props;

    return children;
  }
}

BlackLayout.propTypes = {
  children: React.PropTypes.element.isRequired,
};

export default BlackLayout;
