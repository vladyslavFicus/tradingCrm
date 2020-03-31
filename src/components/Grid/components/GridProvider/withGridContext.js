import React from 'react';
import { GridConsumer } from './GridProvider';

const withGridContext = Component => props => (
  <GridConsumer>
    {context => <Component {...context} {...props} />}
  </GridConsumer>
);

export default withGridContext;
