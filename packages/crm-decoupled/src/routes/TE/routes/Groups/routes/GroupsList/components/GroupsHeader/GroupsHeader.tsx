import React from 'react';
import I18n from 'i18n-js';
import { useNavigate } from 'react-router-dom';
import permissions from 'config/permissions';
import { usePermission } from 'providers/PermissionsProvider';
import { Button } from 'components/Buttons';
import Placeholder from 'components/Placeholder';
import { GroupsQueryQueryResult } from '../../graphql/__generated__/GroupsQuery';
import './GroupsHeader.scss';

type Props = {
  groupsListQuery: GroupsQueryQueryResult,
}

const GroupsHeader = ({ groupsListQuery }: Props) => {
  const navigate = useNavigate();
  const { loading, data: groupsListData } = groupsListQuery || {};
  const { totalElements } = groupsListData?.tradingEngine.groups || {};

  const handleCreateClick = () => {
    navigate('/trading-engine/groups/new');
  };

  const permission = usePermission();


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

      <If condition={permission.allows(permissions.WE_TRADING.CREATE_GROUP)}>
        <div className="GroupsHeader__right">
          <Button
            data-testid="GroupsHeader-newGroupButton"
            onClick={handleCreateClick}
            tertiary
            small
          >
            {I18n.t('TRADING_ENGINE.GROUPS.NEW_GROUP')}
          </Button>
        </div>
      </If>
    </div>
  );
};

export default React.memo(GroupsHeader);
