import React from 'react';
import { useLocation } from 'react-router-dom';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { withModals } from 'hoc';
import { Modal, State } from 'types';
import { usePermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import { Button } from 'components/UI';
import CreateDeskModal from 'modals/CreateDeskModal';
import DesksGridFilter from './components/DesksGridFilter';
import DesksGrid from './components/DesksGrid';
import { useDesksListQuery, DesksListQueryVariables } from './graphql/__generated__/DesksListQuery';
import './DesksList.scss';

type Props = {
  modals: {
    createDeskModal: Modal,
  },
};

const DesksList = (props: Props) => {
  const { modals: { createDeskModal } } = props;

  const { state } = useLocation<State<DesksListQueryVariables>>();

  const permission = usePermission();
  const allowCreateBranch = permission.allows(permissions.HIERARCHY.CREATE_BRANCH);

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

export default compose(
  React.memo,
  withModals({
    createDeskModal: CreateDeskModal,
  }),
)(DesksList);
