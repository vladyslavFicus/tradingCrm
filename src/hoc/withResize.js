import React, { Component } from 'react';

export default function WithResize(InnerComponent) {
  return class extends Component {
    constructor(props) {
      super(props);

      this.resizeObserver = new ResizeObserver((entries) => {
        const { width } = entries[0].contentRect;

        /*
        * The width from contentRect has more than 2 decimal places,
        * so with this hack we get the width of the element to hundredths to get the most accurate width
        */
        this.setState({ elementWidth: Math.round(width * 100) / 100 });
      });
    }

    state = {
      elementWidth: null,
    };

    componentWillUnmount() {
      this.resizeObserver.disconnect();
    }

    render() {
      return (
        <InnerComponent elementWidth={this.state.elementWidth} observerSize={this.resizeObserver} {...this.props} />
      );
    }
  };
}
