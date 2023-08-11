import React from 'react';
import I18n from 'i18n-js';
import { useLocation, matchPath } from 'react-router-dom';
import { routesPermissions } from '../../config';
import { usePermission } from '../../providers';
import './ForbiddenChecker.scss';

type Props = {
  children: React.ReactNode,
};

/**
 * Check if access forbidden for current location
 *
 * @param props
 */
const ForbiddenChecker = (props: Props) => {
  const location = useLocation();
  const permission = usePermission();

  // Looking for matched route in route permissions
  const matchedRoute = Object.keys(routesPermissions).find(route => matchPath(route, location.pathname));

  return (
    <Choose>
      <When condition={!!matchedRoute && !permission.allowsAll(routesPermissions[matchedRoute])}>
        <div className="ForbiddenChecker">
          <h1 className="ForbiddenChecker__title">{I18n.t('FORBIDDEN.TITLE')}</h1>
          <p className="ForbiddenChecker__subtitle">{I18n.t('FORBIDDEN.DESCRIPTION')}</p>
        </div>
      </When>

      <Otherwise>
        {props.children}
      </Otherwise>
    </Choose>
  );
};

export default React.memo(ForbiddenChecker);
