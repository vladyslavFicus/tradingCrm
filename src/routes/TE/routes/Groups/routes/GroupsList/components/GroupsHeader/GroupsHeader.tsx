import React from 'react';
import I18n from 'i18n-js';
import { useHistory } from 'react-router-dom';
import permissions from 'config/permissions';
import { Button } from 'components/Buttons';
import PermissionContent from 'components/PermissionContent';
import Placeholder from 'components/Placeholder';
import { GroupsQueryQueryResult } from '../../graphql/__generated__/GroupsQuery';
import './GroupsHeader.scss';

type Props = {
  groupsListQuery: GroupsQueryQueryResult,
}

const GroupsHeader = ({ groupsListQuery }: Props) => {
  const history = useHistory();
  const { loading, data: groupsListData } = groupsListQuery || {};
  const { totalElements } = groupsListData?.tradingEngine.groups || {};

  const handleCreateClick = () => {
    history.push('/trading-engine/groups/new');
  };

  return (
    <div className="GroupsHeader">
      <div className="GroupsHeader__left">
        <Placeholder
          ready={!loading}
          rows={[{ width: 220, height: 20 }]}
        >
          <div className="GroupsHeader__title">
            <strong>{totalElements} </strong>
            {I18n.t('TRADING_ENGINE.GROUPS.HEADLINE')}
          </div>
        </Placeholder>
      </div>

      <PermissionContent permissions={permissions.WE_TRADING.CREATE_GROUP}>
        <div className="GroupsHeader__right">
          <Button
            onClick={handleCreateClick}
            tertiary
            small
          >
            {I18n.t('TRADING_ENGINE.GROUPS.NEW_GROUP')}
          </Button>
        </div>
      </PermissionContent>
    </div>
  );
};

export default React.memo(GroupsHeader);
