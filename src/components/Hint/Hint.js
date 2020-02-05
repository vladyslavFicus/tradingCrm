import React, { PureComponent } from 'react';
import PropTypes from 'constants/propTypes';
import './Hint.scss';

class Hint extends PureComponent {
  static propTypes = {
    text: PropTypes.string.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    className: '',
  };

  render() {
    const { className, text } = this.props;

    return (
      <span className={`Hint ${className}`}>{text}</span>
    );
  }
}

export default Hint;
