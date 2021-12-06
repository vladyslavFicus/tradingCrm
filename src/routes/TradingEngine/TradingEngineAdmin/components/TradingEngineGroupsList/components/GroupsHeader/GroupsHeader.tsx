import React from 'react';
import I18n from 'i18n-js';
import ReactPlaceholder from 'react-placeholder';
import { TextRow } from 'react-placeholder/lib/placeholders';
import { Button } from 'components/UI';
import { GroupsQueryResult } from '../../types/group';
import './GroupsHeader.scss';

interface Props {
  groupsListQuery: GroupsQueryResult,
}

function GroupsHeader({ groupsListQuery }: Props) {
  const { loading, data: groupsListData } = groupsListQuery || {};
  const { totalElements } = groupsListData?.tradingEngineGroupsList || {};

  const handleCreateClick = () => {
    // TODO: handleCreate
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
              <TextRow
                className="animated-background"
                style={{ width: '220px', height: '12px' }}
              />
            </div>
          )}
        >
          <Choose>
            <When condition={Boolean(totalElements)}>
              <div className="GroupsHeader__title">
                <b>{totalElements} </b> {I18n.t('TRADING_ENGINE.GROUPS.GROUPS_FOUND')}
              </div>
            </When>
            <Otherwise>
              <div className="GroupsHeader__title">
                {I18n.t('TRADING_ENGINE.GROUPS.HEADLINE')}
              </div>
            </Otherwise>
          </Choose>
        </ReactPlaceholder>
      </div>

      <div className="GroupsHeader__right">
        <Button
          onClick={handleCreateClick}
          commonOutline
          small
        >
          {I18n.t('TRADING_ENGINE.GROUPS.NEW_GROUP')}
        </Button>
      </div>
    </div>
  );
}

export default React.memo(GroupsHeader);
