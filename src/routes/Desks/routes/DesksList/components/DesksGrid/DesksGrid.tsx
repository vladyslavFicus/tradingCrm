import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { withModals } from 'hoc';
import { Modal } from 'types';
import { HierarchyBranch } from '__generated__/types';
import { usePermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import { Link } from 'components/Link';
import Uuid from 'components/Uuid';
import { Table, Column } from 'components/Table';
import { EditButton, TrashButton } from 'components/Buttons';
import UpdateDeskModal, { UpdateDeskModalProps } from 'modals/UpdateDeskModal';
import DeleteBranchModal from 'modals/DeleteBranchModal';
import './DesksGrid.scss';
import { useModal } from 'providers/ModalProvider';

type Props = {
  loading: boolean,
  desksList: Array<HierarchyBranch>,
  modals: {
    deleteBranchModal: Modal,
  },
  onRefetch: () => void,
};

const DesksGrid = (props: Props) => {
  const {
    loading,
    desksList,
    modals: {
      deleteBranchModal,
    },
    onRefetch,
  } = props;

  const permission = usePermission();

  const isAllowUpdateBranch = permission.allows(permissions.HIERARCHY.UPDATE_BRANCH);
  const isAllowDeleteBranch = permission.allows(permissions.HIERARCHY.DELETE_BRANCH);
  const isAllowActions = isAllowUpdateBranch || isAllowDeleteBranch;

  // ===== Modals ===== //
  const updateDeskModal = useModal<UpdateDeskModalProps>(UpdateDeskModal);

  // ===== Handlers ===== //
  const handleEditClick = (desk: HierarchyBranch) => {
    updateDeskModal.show({
      data: desk,
      onSuccess: onRefetch,
    });
  };

  const handleDeleteClick = ({ uuid, name }: HierarchyBranch) => {
    deleteBranchModal.show({
      uuid,
      name,
      onSuccess: onRefetch,
    });
  };

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

  const renderOfficeCell = ({ parentBranch }: HierarchyBranch) => {
    if (!parentBranch) {
      return <span>&mdash;</span>;
    }

    return (
      <>
        <div className="DesksGrid__cell-primary">{parentBranch.name}</div>

        <div className="DesksGrid__cell-secondary">
          <Uuid uuid={parentBranch.uuid} uuidPrefix="OF" />
        </div>
      </>
    );
  };

  const renderDeskTypesCell = ({ deskType }: HierarchyBranch) => (
    <div className="DesksGrid__cell-primary">
      {I18n.t(`MODALS.ADD_DESK_MODAL.LABELS.DESK_TYPE_OPTIONS.${deskType}`)}
    </div>
  );

  const renderActions = (desk: HierarchyBranch) => (
    <>
      <If condition={isAllowUpdateBranch}>
        <EditButton
          onClick={() => handleEditClick(desk)}
          className="DesksGrid__edit-button"
        />
      </If>

      <If condition={isAllowDeleteBranch}>
        <TrashButton onClick={() => handleDeleteClick(desk)} />
      </If>
    </>
  );

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

export default compose(
  React.memo,
  withModals({
    deleteBranchModal: DeleteBranchModal,
  }),
)(DesksGrid);
