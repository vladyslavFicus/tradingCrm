import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { FormikProps } from 'formik';
import { withModals } from 'hoc';
import { Modal } from 'types';
import {
  Commission__Type__Enum as GroupCommissionType,
  Commission__Lots__Enum as GroupCommissionLots,
} from '__generated__/types';
import { useModal } from 'providers/ModalProvider';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import { Table, Column } from 'components/Table';
import { EditButton, TrashButton, Button } from 'components/Buttons';
import GroupNewSecurityModal from '../../modals/GroupNewSecurityModal';
import GroupSecurityCustomizationModal from '../../modals/GroupSecurityCustomizationModal';
import {
  FormValues,
  GroupSecurity,
  Security,
  SpreadDiff,
  LotMin,
  LotMax,
  LotStep,
} from '../../types';
import './GroupSecuritiesGrid.scss';

interface GroupNewSecurityModalProps {
  onSuccess: (securities: Security[]) => void,
  groupSecurities: GroupSecurity[],
}

interface GroupSecurityCustomizationModalProps {
  onSuccess: (groupSecurity: GroupSecurity) => void,
  groupSecurity: GroupSecurity,
}

type Props = {
  formik: FormikProps<FormValues>,
  modals: {
    groupNewSecurityModal: Modal<GroupNewSecurityModalProps>,
    groupSecurityCustomizationModal: Modal<GroupSecurityCustomizationModalProps>,
  },
}

const GroupSecuritiesGrid = ({ modals, formik }: Props) => {
  const {
    groupNewSecurityModal,
    groupSecurityCustomizationModal,
  } = modals;

  const { values, setFieldValue } = formik;

  const groupSecurities = values?.groupSecurities || [];
  const groupSymbols = values?.groupSymbols || [];
  const archived = !values.enabled;

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);

  const handleNewGroupSecurity = (securities: Security[]) => {
    const newSecurities = securities.map(security => ({
      security: { id: security.id, name: security.name },
      show: true,
      spreadDiff: SpreadDiff.SPREAD_0,
      lotMin: LotMin.MIN_0_01,
      lotMax: LotMax.MAX_100_0,
      defaultLots: true,
      lotStep: LotStep.STEP_0_01,
      commissionBase: 0,
      commissionType: GroupCommissionType.PIPS,
      commissionLots: GroupCommissionLots.LOT,
    }));

    setFieldValue('groupSecurities', [...groupSecurities, ...newSecurities]);
  };

  const handleEditGroupSecurity = (groupSecurity: GroupSecurity) => {
    const modifiedGroupSecurities = groupSecurities.map(_groupSecurity => (
      _groupSecurity.security.id === groupSecurity.security.id
        ? groupSecurity
        : _groupSecurity
    ));
    setFieldValue('groupSecurities', modifiedGroupSecurities);
  };

  const handleDeleteGroupSecurity = (id: number) => {
    const modifiedGroupSecurities = groupSecurities.filter(groupSecurity => groupSecurity.security.id !== id);
    const modifiedGroupSymbols = groupSymbols.filter(groupSymbol => groupSymbol.securityId !== id);

    setFieldValue('groupSecurities', modifiedGroupSecurities);
    setFieldValue('groupSymbols', modifiedGroupSymbols);

    confirmActionModal.hide();
  };

  const handleNewGroupSecurityModal = () => {
    groupNewSecurityModal.show({
      onSuccess: handleNewGroupSecurity,
      groupSecurities,
    });
  };

  const handleEditGroupSecurityModal = (groupSecurity: GroupSecurity) => {
    groupSecurityCustomizationModal.show({
      groupSecurity,
      onSuccess: handleEditGroupSecurity,
    });
  };

  const handleDeleteGroupSecurityModal = ({ security: { name, id } }: GroupSecurity) => {
    confirmActionModal.show({
      onSubmit: () => handleDeleteGroupSecurity(id),
      modalTitle: I18n.t('TRADING_ENGINE.GROUP.SECURITIES_TABLE.CONFIRMATION.DELETE.TITLE'),
      actionText: I18n.t('TRADING_ENGINE.GROUP.SECURITIES_TABLE.CONFIRMATION.DELETE.DESCRIPTION', { name }),
      submitButtonLabel: I18n.t('COMMON.OK'),
    });
  };

  return (
    <div className="GroupSecuritiesGrid">
      <div className="GroupSecuritiesGrid__header">
        <span className="GroupSecuritiesGrid__title">
          {I18n.t('TRADING_ENGINE.GROUP.SECURITIES_TABLE.TITLE')}
        </span>
        <Button
          disabled={archived}
          onClick={handleNewGroupSecurityModal}
          data-testid="GroupSecuritiesGrid-addSecurityButton"
          tertiary
          small
        >
          {I18n.t('TRADING_ENGINE.GROUP.SECURITIES_TABLE.ADD_SECURITY')}
        </Button>
      </div>
      <div
        id="group-securities-table-scrollable-target"
        className="GroupSecuritiesGrid__scrollableTarget"
      >
        <Table
          maxHeightColumns={300}
          items={groupSecurities}
          scrollableTarget="group-securities-table-scrollable-target"
        >
          <Column
            header={I18n.t('TRADING_ENGINE.GROUP.SECURITIES_TABLE.TYPE')}
            render={({ security }: GroupSecurity) => (
              <div className="GroupsGrid__cell-primary">
                {security.name}
              </div>
            )}
          />
          <Column
            header={I18n.t('TRADING_ENGINE.GROUP.SECURITIES_TABLE.SPREAD')}
            render={({ spreadDiff }: GroupSecurity) => (
              <div className="GroupsGrid__cell-primary">
                {spreadDiff}
              </div>
            )}
          />
          <Column
            header={I18n.t('TRADING_ENGINE.GROUP.SECURITIES_TABLE.COMMISSION')}
            render={({ commissionBase, commissionType, commissionLots }: GroupSecurity) => (
              <div className="GroupsGrid__cell-primary">
                {`
                ${commissionBase} ${I18n.t(`TRADING_ENGINE.GROUP.${commissionType}`)} /
                ${I18n.t(`TRADING_ENGINE.GROUP.PER_${commissionLots}`)}
              `}
              </div>
            )}
          />
          <Column
            width={120}
            header={I18n.t('TRADING_ENGINE.GROUP.SECURITIES_TABLE.ACTIONS')}
            render={(security: GroupSecurity) => (
              <>
                <EditButton
                  disabled={archived}
                  onClick={() => handleEditGroupSecurityModal(security)}
                  className="GroupSecuritiesGrid__edit-button"
                  data-testid="GroupSecuritiesGrid-editButton"
                />
                <TrashButton
                  disabled={archived}
                  onClick={() => handleDeleteGroupSecurityModal(security)}
                  className="GroupSecuritiesGrid__delete-button"
                  data-testid="GroupSecuritiesGrid-trashButton"
                />
              </>
            )}
          />
        </Table>
      </div>
    </div>
  );
};

export default compose(
  React.memo,
  withModals({
    groupNewSecurityModal: GroupNewSecurityModal,
    groupSecurityCustomizationModal: GroupSecurityCustomizationModal,
  }),
)(GroupSecuritiesGrid);
