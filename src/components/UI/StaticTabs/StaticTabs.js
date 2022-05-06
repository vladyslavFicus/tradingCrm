import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from 'components/UI';
import StaticTabsItem from './StaticTabsItem';
import './StaticTabs.scss';

class StaticTabs extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.element),
      PropTypes.element,
    ]).isRequired,
    navClassName: PropTypes.string,
    navItemClassName: PropTypes.string,
    navActiveItemClassName: PropTypes.string,
    contentClassName: PropTypes.string,
    onTabChanged: PropTypes.func,
    hideIfOne: PropTypes.bool, // Hide tab button if only one tab provided
  }

  static defaultProps = {
    navClassName: null,
    navItemClassName: null,
    navActiveItemClassName: null,
    contentClassName: null,
    hideIfOne: false,
    onTabChanged: () => {},
  };

  state = {
    activeIndex: 0,
  };

  onTabChanged = (activeIndex) => {
    // Notify parent when tab changed
    if (this.state.activeIndex !== activeIndex) {
      this.props.onTabChanged();
    }

    this.setState({ activeIndex });
  };

  render() {
    const {
      children,
      navClassName,
      navItemClassName,
      navActiveItemClassName,
      contentClassName,
      hideIfOne,
    } = this.props;

    const { activeIndex } = this.state;

    const _children = React.Children
      .toArray(children)
      .filter(child => child.type === StaticTabsItem);

    return (
      <div className="StaticTabs">
        {/* Show tab buttons only if hideIfOne flag not provided */}
        <If condition={!(hideIfOne && _children.length === 1)}>
          <div className={classNames('StaticTabs__nav', navClassName)}>
            {_children.map(({ props: { label, ...rest } }, index) => (
              <Button
                key={index}
                className={classNames('StaticTabs__nav-item', navItemClassName, {
                  'StaticTabs__nav-item--active': activeIndex === index,
                  [navActiveItemClassName]: activeIndex === index,
                })}
                onClick={() => this.onTabChanged(index)}
                {...rest}
              >
                {label}
              </Button>
            ))}
          </div>
        </If>
        <div className={classNames('StaticTabs__content', contentClassName)}>
          {_children.filter((_, index) => activeIndex === index)}
        </div>
      </div>
    );
  }
}

export default StaticTabs;
