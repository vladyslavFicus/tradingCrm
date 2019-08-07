import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectReducer } from '../store/reducers';

export default function asyncRoute(getComponent, getReducers, key) {
  return class AsyncRoute extends Component {
    static contextTypes = {
      store: PropTypes.shape({
        dispatch: PropTypes.func.isRequired,
      }),
    };

    constructor(props) {
      super(props);
      this.state = {
        reducersLoaded: false,
        RouteComponent: null,
        shouldLoadReducers: !!getReducers,
      };

      const { reducersLoaded, shouldLoadReducers } = this.state;
      const shouldLoad = !reducersLoaded && shouldLoadReducers;

      if (shouldLoad) {
        getReducers().then((module) => {
          if (this.isMounted) {
            injectReducer(this.context.store, { key, reducer: module.default });
            this.setState({ reducersLoaded: true });
          }
        });
      }

      getComponent().then((module) => {
        if (this.isMounted) {
          this.setState({ RouteComponent: module.default });
        }
      });
    }

    componentDidMount() {
      this.isMounted = true;
    }

    componentWillUnmount() {
      this.isMounted = false;
    }

    get isMounted() {
      return this.mounted;
    }

    set isMounted(value) {
      this.mounted = value;
    }

    render() {
      const { shouldLoadReducers, reducersLoaded, RouteComponent } = this.state;

      return (
        <If condition={RouteComponent && (!shouldLoadReducers || reducersLoaded)}>
          <RouteComponent {...this.props} />
        </If>
      );
    }
  };
}
