import React, { useCallback } from 'react';
import I18n from 'i18n-js';
import { HierarchyBranch } from '__generated__/types';
import Link from 'components/Link';
import Uuid from 'components/Uuid';
import { Table, Column } from 'components/Table';
import { EditButton, TrashButton } from 'components/Buttons';
import useDesksGrid from 'routes/Desks/routes/hooks/useDesksGrid';
import useDesks from 'routes/Desks/routes/hooks/useDesks';
import './DesksGrid.scss';

const DesksGrid = () => {
  const {
    loading,
    desksList,
    refetch,
  } = useDesks();

  const {
    isAllowUpdateBranch,
    isAllowDeleteBranch,
    isAllowActions,
    handleEditClick,
    handleDeleteClick,
  } = useDesksGrid();

  // ===== Renders ===== //
  const renderDeskCell = ({ name, uuid }: HierarchyBranch) => (
    <>
      <div className="DesksGrid__cell-primary">
        <Link to={`/desks/${uuid}`}>{name}</Link>
      </div>

      <div className="DesksGrid__cell-secondary">
        <Uuid uuid={uuid} uuidPrefix="DE" />
      </div>
    </>
  );

  const renderOfficeCell = useCallback(({ parentBranch }: HierarchyBranch) => {
    if (!parentBranch) {
      return <>&mdash;</>;
    }

    return (
      <>
        <div className="DesksGrid__cell-primary">{parentBranch.name}</div>

        <div className="DesksGrid__cell-secondary">
          <Uuid uuid={parentBranch.uuid} uuidPrefix="OF" />
        </div>
      </>
    );
  }, []);

  const renderDeskTypesCell = useCallback(({ deskType }: HierarchyBranch) => (
    <div className="DesksGrid__cell-primary">
      {I18n.t(`MODALS.ADD_DESK_MODAL.LABELS.DESK_TYPE_OPTIONS.${deskType}`)}
    </div>
  ), []);

  const renderActions = useCallback((desk: HierarchyBranch) => (
    <>
      <If condition={isAllowUpdateBranch}>
        <EditButton
          onClick={() => handleEditClick(desk, refetch)}
          className="DesksGrid__edit-button"
          data-testid="DesksGrid-editButton"
        />
      </If>

      <If condition={isAllowDeleteBranch}>
        <TrashButton
          data-testid="DesksGrid-trashButton"
          onClick={() => handleDeleteClick(desk, refetch)}
        />
      </If>
    </>
  ), []);

  return (
    <div className="DesksGrid">
      <Table
        stickyFromTop={137}
        items={desksList}
        loading={loading}
      >
        <Column
          header={I18n.t('DESKS.GRID_HEADER.DESK')}
          render={renderDeskCell}
        />

        <Column
          header={I18n.t('DESKS.GRID_HEADER.OFFICE')}
          render={renderOfficeCell}
        />

        <Column
          header={I18n.t('DESKS.GRID_HEADER.DESK_TYPE')}
          render={renderDeskTypesCell}
        />

        <If condition={isAllowActions}>
          <Column
            header={I18n.t('DESKS.GRID_HEADER.ACTIONS')}
            render={renderActions}
          />
        </If>
      </Table>
    </div>
  );
};

export default React.memo(DesksGrid);
