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
  }

  state = {
    activeIndex: 0,
  };

  render() {
    const { activeIndex } = this.state;
    const children = React.Children
      .toArray(this.props.children)
      .filter(child => child.type === StaticTabsItem);

    return (
      <div className="StaticTabs">
        <div className="StaticTabs__nav">
          {children.map(({ props: { label } }, index) => (
            <Button
              key={index}
              className={classNames('StaticTabs__nav-item', {
                'StaticTabs__nav-item--active': activeIndex === index,
              })}
              onClick={() => this.setState({ activeIndex: index })}
            >
              {label}
            </Button>
          ))}
        </div>
        <div className="StaticTabs__content">
          {children.filter((_, index) => activeIndex === index)}
        </div>
      </div>
    );
  }
}

export default StaticTabs;
