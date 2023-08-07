import React, { useCallback } from 'react';
import I18n from 'i18n-js';
import { HierarchyBranch } from '__generated__/types';
import Link from 'components/Link';
import Uuid from 'components/Uuid';
import { Table, Column } from 'components/Table';
import { EditButton, TrashButton } from 'components';
import useTeamsGrid from 'routes/Teams/hooks/useTeamsGrid';
import './TeamsGrid.scss';

type Props = {
  loading: boolean,
  teamsList: Array<HierarchyBranch>,
  onRefetch: () => void,
};

const TeamsGrid = (props: Props) => {
  const { loading, teamsList, onRefetch } = props;

  const {
    isAllowUpdateBranch,
    isAllowDeleteBranch,
    isAllowActions,
    handleEditClick,
    handleDeleteClick,
  } = useTeamsGrid({ onRefetch });

  // ===== Renders ===== //
  const renderTeamCell = useCallback(({ name, uuid }: HierarchyBranch) => (
    <>
      <div className="TeamsGrid__cell-primary">
        <Link to={`/teams/${uuid}`}>{name}</Link>
      </div>

      <div className="TeamsGrid__cell-secondary">
        <Uuid uuid={uuid} uuidPrefix="TE" />
      </div>
    </>
  ), []);

  const renderOfficeCell = useCallback(({ parentBranch }: HierarchyBranch) => {
    const office = parentBranch?.parentBranch;

    if (!office) {
      return <span>&mdash;</span>;
    }

    return (
      <>
        <div className="TeamsGrid__cell-primary">{office.name}</div>

        <div className="TeamsGrid__cell-secondary">
          <Uuid uuid={office.uuid} uuidPrefix="OF" />
        </div>
      </>
    );
  }, []);

  const renderDeskCell = useCallback(({ parentBranch }: HierarchyBranch) => {
    if (!parentBranch) {
      return <span>&mdash;</span>;
    }

    return (
      <>
        <div className="TeamsGrid__cell-primary">{parentBranch.name}</div>

        <div className="TeamsGrid__cell-secondary">
          <Uuid uuid={parentBranch.uuid} uuidPrefix="DE" />
        </div>
      </>
    );
  }, []);

  const renderActions = useCallback((data: HierarchyBranch) => (
    <>
      <If condition={isAllowUpdateBranch}>
        <EditButton
          onClick={() => handleEditClick(data)}
          className="TeamsGrid__edit-button"
          data-testid="TeamsGrid-editButton"
        />
      </If>

      <If condition={isAllowDeleteBranch}>
        <TrashButton
          data-testid="TeamsGrid-trashButton"
          onClick={() => handleDeleteClick(data)}
        />
      </If>
    </>
  ), [isAllowUpdateBranch, isAllowDeleteBranch]);

  return (
    <div className="TeamsGrid">
      <Table
        stickyFromTop={137}
        items={teamsList}
        loading={loading}
      >
        <Column
          header={I18n.t('TEAMS.GRID_HEADER.TEAM')}
          render={renderTeamCell}
        />

        <Column
          header={I18n.t('TEAMS.GRID_HEADER.OFFICE')}
          render={renderOfficeCell}
        />

        <Column
          header={I18n.t('TEAMS.GRID_HEADER.DESK')}
          render={renderDeskCell}
        />

        <If condition={isAllowActions}>
          <Column
            header={I18n.t('TEAMS.GRID_HEADER.ACTIONS')}
            render={renderActions}
          />
        </If>
      </Table>
    </div>
  );
};

export default React.memo(TeamsGrid);
