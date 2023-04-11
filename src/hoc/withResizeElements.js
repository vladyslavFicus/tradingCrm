import React, { Component } from 'react';

export default function WithResize(InnerComponent) {
  return class extends Component {
    state = {
      columns: [],
      availableSizes: [],
    };

    initResizeObserver = (columnsName, elements) => {
      const firstColumns = columnsName.map((item) => {
        const header = item.toUpperCase();

        return { header, size: null };
      });
      this.setState({ columns: firstColumns });

      this.resizeObserver = new ResizeObserver((entries) => {
        const { columns } = this.state;
        const availableElements = [];

        const newColumns = columns.map(({ header, size }) => {
          const oneEntry = entries.find(item => item?.target?.innerText === header);

          if (oneEntry) {
            const { borderBoxSize: [{ inlineSize }] } = oneEntry;
            const resultSize = Math.round(inlineSize * 100) / 100;
            availableElements.push(resultSize);

            return { header, size: resultSize };
          }
          if (size && !oneEntry) {
            availableElements.push(size);
            return { header, size };
          }

          return { header, size };
        });

        this.setState({ columns: newColumns, availableSizes: availableElements });
      });

      [...elements || []].forEach((item) => {
        this.resizeObserver.observe(item);
      });
    };

    reopenResizeObserver = (columns, elements) => {
      this.resizeObserver.disconnect();

      this.initResizeObserver(columns, elements);
    };

    componentWillUnmount() {
      this.resizeObserver?.disconnect();
    }

    render() {
      return (
        <InnerComponent
          initResizeObserver={this.initResizeObserver}
          reopenResizeObserver={this.reopenResizeObserver}
          elementsWidth={this.state.availableSizes}
          {...this.props}
        />
      );
    }
  };
}
