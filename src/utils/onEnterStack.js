const onEnterCreator = (route, hooks) => (nextState, replace, done) => {
  let isReplaceCalled = false;
  const onReplace = (state) => {
    replace(state);

    isReplaceCalled = true;
  };
  const hookCaller = hook => next => (state, replace) => {
    if (isReplaceCalled || next === null) {
      return done();
    }

    hook(state, replace, (err) => {
      if (err) {
        next(state, replace);
      } else {
        done();
      }
    });
  };

  return hooks
    .filter(item => !!item)
    .reduce((result, current) => hookCaller(current)(result), done)(nextState, onReplace);
};

export default function onEnterStack(route, onEnterCallback) {
  if (!route.indexRoute) {
    route.onEnter = onEnterCreator(route, [
      ...(
        Array.isArray(onEnterCallback) ?
          onEnterCallback :
          [onEnterCallback]
      ),
      route.onEnter,
    ]);
  }

  if (Array.isArray(route.childRoutes) && route.childRoutes.length > 0) {
    route
      .childRoutes
      .map((childRoute) => onEnterStack(childRoute, onEnterCallback));
  }

  return route;
}
