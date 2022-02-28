import React from 'react';
import I18n from 'i18n-js';
import { useHistory } from 'react-router-dom';
import ReactPlaceholder from 'react-placeholder';
import { TextRow } from 'react-placeholder/lib/placeholders';
import permissions from 'config/permissions';
import { Button } from 'components/UI';
import PermissionContent from 'components/PermissionContent';
import { GroupsQueryQueryResult } from '../../graphql/__generated__/GroupsQuery';
import './GroupsHeader.scss';

interface Props {
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
        <ReactPlaceholder
          ready={!loading}
          customPlaceholder={(
            <div>
              <TextRow
                className="animated-background"
                style={{ width: '220px', height: '20px' }}
              />
            </div>
          )}
        >
          <div className="GroupsHeader__title">
            <strong>{totalElements} </strong>
            {I18n.t('TRADING_ENGINE.GROUPS.HEADLINE')}
          </div>
        </ReactPlaceholder>
      </div>

      <PermissionContent permissions={permissions.WE_TRADING.CREATE_GROUP}>
        <div className="GroupsHeader__right">
          <Button
            onClick={handleCreateClick}
            commonOutline
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
