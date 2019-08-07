import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './BackToTop.scss';

class BackToTop extends Component {
  static propTypes = {
    positionChange: PropTypes.bool,
  };

  static defaultProps = {
    positionChange: false,
  };

  state = {
    isVisible: false,
  };

  mounted = false;

  componentDidMount() {
    this.mounted = true;

    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    this.mounted = false;

    window.removeEventListener('scroll', this.handleScroll);
  }

  updateState = (...args) => {
    if (this.mounted) {
      this.setState(...args);
    }
  };

  handleScroll = () => {
    if (
      document.documentElement.scrollTop > document.documentElement.clientHeight
      || document.body.scrollTop > document.body.clientHeight
    ) {
      this.updateState({ isVisible: true });
    } else {
      this.updateState({ isVisible: false });
    }
  };

  scrollToTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  render() {
    const { positionChange } = this.props;
    const { isVisible } = this.state;

    return (
      <button
        type="button"
        className={classNames(
          'fa fa-caret-up back-to-top',
          { 'is-visible': isVisible },
          { positionChange },
        )}
        onClick={this.scrollToTop}
      />
    );
  }
}

export default BackToTop;
