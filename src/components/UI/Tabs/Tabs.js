import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from 'components/UI';
import TabsItem from './TabsItem';
import './Tabs.scss';

class Tabs extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  state = {
    activeTabName: null,
  };

  componentDidMount() {
    this.setState({
      activeTabName: this.props.children[0].props.label,
    });
  }

  render() {
    const { activeTabName } = this.state;
    const children = React.Children
      .toArray(this.props.children)
      .filter(child => child.type === TabsItem);

    return (
      <div className="Tabs">
        <div className="Tabs__nav">
          {children.map(({ props: { label } }) => (
            <Button
              key={label}
              className={classNames('Tabs__nav-item', {
                'Tabs__nav-item--active': activeTabName === label,
              })}
              onClick={() => this.setState({ activeTabName: label })}
            >
              {label}
            </Button>
          ))}
        </div>
        <div className="Tabs__content">
          {children.filter(({ props: { label } }) => label === activeTabName)}
        </div>
      </div>
    );
  }
}

export default Tabs;
