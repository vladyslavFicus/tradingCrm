import React from 'react';
import PropTypes from 'prop-types';
import Route from '../Route';

const AppRoute = ({
  component: Component, layout: Layout, layoutProps, ...rest
}) => (
  <Route
    {...rest}
    render={(props) => {
      if (Layout) {
        return (
          <Layout {...layoutProps}>
            <Component {...props} />
          </Layout>
        );
      }

      return <Component {...props} />;
    }}
  />
);

AppRoute.propTypes = {
  component: PropTypes.func.isRequired,
  layout: PropTypes.func,
  layoutProps: PropTypes.object,
};

AppRoute.defaultProps = {
  layoutProps: {},
  layout: null,
};

export default AppRoute;

