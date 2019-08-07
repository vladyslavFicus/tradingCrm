import React, { PureComponent } from 'react';
import { graphql } from 'react-apollo';
import { get } from 'lodash';

/**
 * Workaround for refetch with stored state after re-render whole container component
 *
 * Description:
 * If you have an `options` with initial variables in graphql(query, { options: (props) => ({ variables: {...} }) })
 * and you want to do a query refetch with new variables --> it was works as expected until whole container
 * will re-render and provide new props to component. It's mean that all refetched data and variables will cleared
 * and will be replaced by default initial variables and respectively replaced with new data depends on variables.
 *
 * IMPORTANT: Be careful! If you did a refetch with new variables and after that you change a variables from highest
 * component --> this variables will ignored, because refetch variables has highest priority over the props variables.
 *
 * Example:
 * // Container.js (props size=3)
 * graphql(query, { options: (props) => ({ variables: { size: props.size } }) })(Component)
 *
 * // Component.js
 * ...
 * handleChangeSize() {
 *   this.data.refetch({ size: 2000 });
 * }
 * ...
 *
 * Flow:
 *  1. Get size variable from props -> make a query with size 3.
 *  2. handleChangeSize() -> make a query with size 2000.
 *  3. We receive new size prop from highest component --> it will ignored (will be used size=3 from refetch).
 *
 *
 * @param document
 * @param operationOptions
 * @return {function(*=): {React.Component: {React.Element}}}
 */
export default (document, operationOptions) => WrappedComponent => class extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      variables: {},
    };

    this.cachedComponent = null;
  }

  /**
   * Get options from operationOptions each time with new props
   *
   * @return {*}
   */
  getOptions = () => {
    const optionsFactory = get(operationOptions, 'options', {});

    return typeof optionsFactory === 'function' ? optionsFactory(this.props) : optionsFactory;
  };

  /**
   * Refetch factory method which accept original `refetch` from component and returns custom refetch method
   *
   * If refetch execution from component was without variables --> use default apollo refetch method
   * If refetch execution from component was with variables --> change variables state and re-render component
   *
   * @param originalRefetch {Function}
   *
   * @return {Function}
   */
  refetchFactory = originalRefetch => (newVariables) => {
    if (!newVariables) {
      originalRefetch();
    }

    this.setState(({ variables }) => ({ variables: { ...variables, ...newVariables } }));
  };

  /**
   * Render `WrappedComponent` through anonym proxy component which replaces `refetch` method to custom
   *
   * @param props
   *
   * @return {React.Element}
   */
  proxyComponent = (props) => {
    const propName = operationOptions.name || 'data';

    const newProps = {
      ...props,
      [propName]: {
        ...props[propName],
        refetch: this.refetchFactory(props[propName].refetch),
      },
    };

    return React.createElement(WrappedComponent, newProps);
  };

  /**
   * Render graphql HOC with custom options parameter as a function
   * to get variables from closure (from current LexicalEnvironment) each times when it's re-renders
   * and merge it with custom `refetch` variables state
   *
   * @return {React.Element}
   */
  render() {
    if (!this.cachedComponent) {
      const newOperationOptions = {
        ...operationOptions,
        options: () => {
          const options = this.getOptions();

          return {
            ...options,
            variables: { ...options.variables, ...this.state.variables },
          };
        },
      };

      this.cachedComponent = graphql(document, newOperationOptions)(this.proxyComponent);
    }

    return React.createElement(this.cachedComponent, this.props);
  }
};
