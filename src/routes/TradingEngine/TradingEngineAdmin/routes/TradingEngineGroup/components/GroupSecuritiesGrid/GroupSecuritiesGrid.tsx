import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { FormikProps } from 'formik';
import { withModals } from 'hoc';
import { Modal } from 'types';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import { Table, Column } from 'components/Table';
import { EditButton, Button } from 'components/UI';
import GroupNewSecurityModal from '../../modals/GroupNewSecurityModal';
import GroupSecurityCustomizationModal from '../../modals/GroupSecurityCustomizationModal';
import {
  Group,
  GroupSecurity,
  Security,
  GroupCommissionType,
  GroupCommissionLots,
  SpreadDiff,
  LotMin,
  LotMax,
  LotStep,
} from '../../types';
import './GroupSecuritiesGrid.scss';

interface ConfirmationModalProps {
  onSubmit: (id: number) => void,
  modalTitle: string,
  actionText: string,
  submitButtonLabel: string,
}

interface GroupNewSecurityModalProps {
  onSuccess: (security: Security) => void,
  groupSecurities: GroupSecurity[],
}

interface GroupSecurityCustomizationModalProps {
  onSuccess: (groupSecurity: GroupSecurity) => void,
  groupSecurity: GroupSecurity,
}

interface Props {
  formik: FormikProps<Group>,
  modals: {
    confirmationModal: Modal<ConfirmationModalProps>,
    groupNewSecurityModal: Modal<GroupNewSecurityModalProps>,
    groupSecurityCustomizationModal: Modal<GroupSecurityCustomizationModalProps>,
  },
}

const GroupSecuritiesGrid = ({ modals, formik }: Props) => {
  const { groupNewSecurityModal, groupSecurityCustomizationModal, confirmationModal } = modals;
  const { values, setFieldValue } = formik;
  const groupSecurities = values?.groupSecurities || [];
  const groupMargins = values?.groupMargins || [];

  const handleNewGroupSecurity = (security: Security) => {
    setFieldValue('groupSecurities', [...groupSecurities, {
      security,
      show: true,
      spreadDiff: SpreadDiff.SPREAD_0,
      lotMin: LotMin.MIN_0_01,
      lotMax: LotMax.MAX_100_0,
      lotStep: LotStep.STEP_0_01,
      commissionBase: 0,
      commissionType: GroupCommissionType.PIPS,
      commissionLots: GroupCommissionLots.LOT,
    }]);
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
    const modifiedGroupMargins = groupMargins.filter(groupMargin => groupMargin.securityId !== id);

    setFieldValue('groupSecurities', modifiedGroupSecurities);
    setFieldValue('groupMargins', modifiedGroupMargins);

    confirmationModal.hide();
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
    confirmationModal.show({
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
          onClick={handleNewGroupSecurityModal}
          commonOutline
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
          stickyFromTop={0}
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
                  onClick={() => handleEditGroupSecurityModal(security)}
                  className="GroupSecuritiesGrid__edit-button"
                />
                <Button
                  transparent
                  onClick={() => handleDeleteGroupSecurityModal(security)}
                >
                  <i className="fa fa-trash btn-transparent color-danger" />
                </Button>
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
    confirmationModal: ConfirmActionModal,
    groupNewSecurityModal: GroupNewSecurityModal,
    groupSecurityCustomizationModal: GroupSecurityCustomizationModal,
  }),
)(GroupSecuritiesGrid);
