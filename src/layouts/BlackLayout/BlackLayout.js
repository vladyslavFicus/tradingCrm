import { Component } from 'react';
import PropTypes from 'prop-types';
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

    return children;
  }
}

export default BlackLayout;
