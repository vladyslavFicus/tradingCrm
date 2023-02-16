import React from 'react';
import { RouteProps } from 'react-router-dom';

type Props = {
  layout?: React.ReactNode,
  disableScroll?: boolean,
  isPublic?: boolean,
  isPrivate?: boolean,
  path: string,
}

class Route extends React.PureComponent<Props & RouteProps, any> {}

export default Route;
