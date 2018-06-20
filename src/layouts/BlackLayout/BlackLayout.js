import React, { Component } from 'react';
import PropTypes from 'prop-types';
import config from '../../config/index';
import './BlackLayout.scss';

class BlackLayout extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
  };

  componentWillMount() {
    document.body.classList.add('black-layout');
  }

  componentWillUnmount() {
    document.body.classList.remove('black-layout');
  }

  render() {
    const { children } = this.props;
    const backgroundClassName = config.market === 'crm'
      ? 'crm-background'
      : 'casino-background';

    return (
      <div className={backgroundClassName}>
        {children}
      </div>
    );
  }
}

export default BlackLayout;
