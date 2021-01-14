import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { ReactComponent as SwitcherIcon } from './icons/switcher.svg';
import './FiltersToggler.scss';

class FiltersToggler extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    className: '',
  }

  state = {
    collapsed: true,
  };

  handleCollapse = () => {
    this.setState(({ collapsed }) => ({ collapsed: !collapsed }));
  };

  render() {
    const { children, className } = this.props;
    const { collapsed } = this.state;

    return (
      <div
        className={
          classNames('FiltersToggler', {
            'FiltersToggler--collapsed': collapsed,
            className,
          })
        }
      >
        <div className="FiltersToggler__actions">
          <div
            className="FiltersToggler__button"
            onClick={this.handleCollapse}
          >
            <SwitcherIcon className="FiltersToggler__icon" />
          </div>
        </div>

        <If condition={children && !collapsed}>
          {children}
        </If>
      </div>
    );
  }
}

export default FiltersToggler;
