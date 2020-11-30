import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from 'components/UI';
import StaticTabsItem from './StaticTabsItem';
import './StaticTabs.scss';

class StaticTabs extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  state = {
    activeTabName: null,
  };

  componentDidMount() {
    const { children } = this.props;

    this.setState({
      activeTabName: children[0]?.props.label || children.props.label,
    });
  }

  render() {
    const { activeTabName } = this.state;
    const children = React.Children
      .toArray(this.props.children)
      .filter(child => child.type === StaticTabsItem);

    return (
      <div className="StaticTabs">
        <div className="StaticTabs__nav">
          {children.map(({ props: { label } }) => (
            <Button
              key={label}
              className={classNames('StaticTabs__nav-item', {
                'StaticTabs__nav-item--active': activeTabName === label,
              })}
              onClick={() => this.setState({ activeTabName: label })}
            >
              {label}
            </Button>
          ))}
        </div>
        <div className="StaticTabs__content">
          {children.filter(({ props: { label } }) => label === activeTabName)}
        </div>
      </div>
    );
  }
}

export default StaticTabs;
