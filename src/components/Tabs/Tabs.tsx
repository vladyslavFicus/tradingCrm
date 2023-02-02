import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { usePermission } from 'providers/PermissionsProvider';
import { Link } from 'components/Link';
import './Tabs.scss';

type Props = {
  items: Array<{
    label: string,
    url: string,
    permissions?: string,
  }>,
  className?: string,
};

const Tabs = (props: Props) => {
  const {
    items,
    className,
  } = props;

  const permission = usePermission();

  const { id } = useParams<{ id: string }>();

  const { pathname } = useLocation();

  const tabs = items.filter(item => !item.permissions || permission.allows(item.permissions));

  return (
    <div className={classNames('Tabs', className)}>
      {
        tabs.map((tab, key) => {
          const url = tab.url.replace(/:id/, id);

          return (
            <Link
              key={key}
              className={
                classNames('Tabs__item', {
                  'Tabs__item--active': pathname.indexOf(url) === 0,
                })
              }
              to={url}
            >
              {I18n.t(tab.label)}
            </Link>
          );
        })
      }
    </div>
  );
};

export default React.memo(Tabs);
