import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from 'components/UI';
import './DownloadButton.scss';

class DownloadButton extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
  }

  static defaultProps = {
    className: '',
  }

  render() {
    const { className, ...props } = this.props;

    return (
      <Button
        className={classNames('DownloadButton', className)}
        {...props}
      >
        <i className="DownloadButton__icon fa fa-download" />
      </Button>
    );
  }
}

export default DownloadButton;
