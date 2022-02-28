import React from 'react';
import { Redirect, Switch, useRouteMatch } from 'react-router-dom';
import Route from 'components/Route';
import SymbolsList from './routes/SymbolsList';
import SymbolNew from './routes/SymbolNew';
import SymbolEdit from './routes/SymbolEdit';

const Symbols = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path} component={SymbolsList} />
      <Route path={`${path}/new`} component={SymbolNew} />
      <Route path={`${path}/:id`} component={SymbolEdit} />
      <Redirect to={path} />
    </Switch>
  );
};

export default React.memo(Symbols);
