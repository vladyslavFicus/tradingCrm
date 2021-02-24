import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './TabHeader.scss';

class TabHeader extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    className: PropTypes.string,
    children: PropTypes.node,
  };

  static defaultProps = {
    className: null,
    children: null,
  };

  render() {
    const {
      title,
      className,
      children,
    } = this.props;

    return (
      <div className={classNames('TabHeader', className, { 'TabHeader--has-content': children })}>
        <div className="TabHeader__title">
          {title}
        </div>
        <If condition={children}>
          {children}
        </If>
      </div>
    );
  }
}

export default TabHeader;
