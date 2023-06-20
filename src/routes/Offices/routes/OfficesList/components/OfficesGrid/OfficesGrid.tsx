import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { withModals } from 'hoc';
import { Modal } from 'types';
import { HierarchyBranch } from '__generated__/types';
import { usePermission } from 'providers/PermissionsProvider';
import { useModal } from 'providers/ModalProvider';
import permissions from 'config/permissions';
import { Link } from 'components/Link';
import Uuid from 'components/Uuid';
import { Table, Column } from 'components/Table';
import { EditButton, TrashButton } from 'components/Buttons';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import UpdateOfficeModal, { UpdateOfficeModalProps } from 'modals/UpdateOfficeModal';
import DeleteBranchModal from 'modals/DeleteBranchModal';
import './OfficesGrid.scss';

type Props = {
  loading: boolean,
  officesList: Array<HierarchyBranch>,
  modals: {
    deleteBranchModal: Modal,
  },
  onRefetch: () => void,
};

const OfficesGrid = (props: Props) => {
  const {
    loading,
    officesList,
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
  const updateOfficeModal = useModal<UpdateOfficeModalProps>(UpdateOfficeModal);

  // ===== Handlers ===== //
  const handleEditClick = (data: HierarchyBranch) => {
    updateOfficeModal.show({
      data,
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
  const renderOfficeColumn = ({ name, uuid }: HierarchyBranch) => (
    <>
      <Link
        className="OfficesGrid__cell-primary"
        to={`/offices/${uuid}`}
      >
        {name}
      </Link>

      <div className="OfficesGrid__cell-secondary">
        <Uuid uuid={uuid} uuidPrefix="OF" />
      </div>
    </>
  );

  const renderCountryColumn = ({ country }: HierarchyBranch) => {
    if (!country) {
      return <span>&mdash;</span>;
    }

    return <CountryLabelWithFlag code={country} height="14" />;
  };


  const renderActions = (data: HierarchyBranch) => (
    <>
      <If condition={isAllowUpdateBranch}>
        <EditButton
          onClick={() => handleEditClick(data)}
          className="OfficesGrid__edit-button"
          data-testid="OfficesGrid-editButton"
        />
      </If>

      <If condition={isAllowDeleteBranch}>
        <TrashButton
          onClick={() => handleDeleteClick(data)}
          data-testid="OfficesGrid-trashButton"
        />
      </If>
    </>
  );

  return (
    <div className="OfficesGrid">
      <Table
        stickyFromTop={137}
        items={officesList}
        loading={loading}
      >
        <Column
          header={I18n.t('OFFICES.GRID_HEADER.OFFICE')}
          render={renderOfficeColumn}
        />

        <Column
          header={I18n.t('OFFICES.GRID_HEADER.COUNTRY')}
          render={renderCountryColumn}
        />

        <If condition={isAllowActions}>
          <Column
            header={I18n.t('OFFICES.GRID_HEADER.ACTIONS')}
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
)(OfficesGrid);
