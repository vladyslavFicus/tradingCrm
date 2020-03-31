import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const GridContext = React.createContext();

class GridProvider extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  render() {
    return (
      <GridContext.Provider value={this.props}>
        {this.props.children}
      </GridContext.Provider>
    );
  }
}

export const GridConsumer = GridContext.Consumer;

export default GridProvider;
