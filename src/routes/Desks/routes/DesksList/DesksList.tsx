import React from 'react';
import { useLocation } from 'react-router-dom';
import I18n from 'i18n-js';
import { State } from 'types';
import { usePermission } from 'providers/PermissionsProvider';
import { useModal } from 'providers/ModalProvider';
import permissions from 'config/permissions';
import { Button } from 'components/Buttons';
import CreateDeskModal, { CreateDeskModalProps } from 'modals/CreateDeskModal';
import DesksGridFilter from './components/DesksGridFilter';
import DesksGrid from './components/DesksGrid';
import { useDesksListQuery, DesksListQueryVariables } from './graphql/__generated__/DesksListQuery';
import './DesksList.scss';

const DesksList = () => {
  const { state } = useLocation<State<DesksListQueryVariables>>();

  const permission = usePermission();
  const allowCreateBranch = permission.allows(permissions.HIERARCHY.CREATE_BRANCH);

  // ===== Modals ===== //
  const createDeskModal = useModal<CreateDeskModalProps>(CreateDeskModal);

  // ===== Requests ===== //
  const { data, loading, refetch } = useDesksListQuery({
    variables: {
      ...state?.filters as DesksListQueryVariables,
      branchType: 'desk',
    },
  });

  const desksList = data?.branch || [];
  const totalCount = desksList.length || 0;

  // ===== Handlers ===== //
  const handleOpenAddDeskModal = () => {
    createDeskModal.show({
      onSuccess: refetch,
    });
  };

  return (
    <div className="DesksList">
      <div className="DesksList__header">
        <div className="DesksList__title">
          <strong>{totalCount} </strong>

          {I18n.t('DESKS.DESKS')}
        </div>

        <If condition={allowCreateBranch}>
          <Button
            data-testid="DesksList-addDeskButton"
            onClick={handleOpenAddDeskModal}
            tertiary
          >
            {I18n.t('DESKS.ADD_DESK')}
          </Button>
        </If>
      </div>

      <DesksGridFilter onRefetch={refetch} />

      <DesksGrid loading={loading} desksList={desksList} onRefetch={refetch} />
    </div>
  );
};

export default React.memo(DesksList);
