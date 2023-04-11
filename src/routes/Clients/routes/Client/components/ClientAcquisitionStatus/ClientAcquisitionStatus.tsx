import React from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import classNames from 'classnames';
import {
  Profile,
  Operator,
  AcquisitionStatusTypes__Enum as AcquisitionStatusEnum,
} from '__generated__/types';
import permissions from 'config/permissions';
import { withStorage } from 'providers/StorageProvider';
import { usePermission } from 'providers/PermissionsProvider';
import { useModal } from 'providers/ModalProvider';
import { aquisitionStatuses } from 'constants/aquisitionStatuses';
import { salesStatusesColor, salesStatuses } from 'constants/salesStatuses';
import { retentionStatusesColor, retentionStatuses } from 'constants/retentionStatuses';
import HideText from 'components/HideText';
import UpdateRepresentativeModal, { UpdateRepresentativeModalProps } from 'modals/UpdateRepresentativeModal';
import './ClientAcquisitionStatus.scss';

type AcquisitionItem = {
  label: string,
  isActive: boolean,
  statusTitle: string,
  color: string,
  acquisitionType: AcquisitionStatusEnum,
  availableToUpdate: boolean,
  status?: string,
  operator?: Operator,
};

type Props = {
  profile: Profile,
  auth: { department: string },
};

const ClientAcquisitionStatus = (props: Props) => {
  const { profile, auth: { department } } = props;

  const { uuid, acquisition } = profile;
  const { salesStatus, salesOperator, retentionStatus, retentionOperator, acquisitionStatus } = acquisition || {};

  // ===== Permissions ===== //
  const permission = usePermission();

  const changeAcquisition = permission.allows(permissions.USER_PROFILE.CHANGE_ACQUISITION);

  const acquisitionItems = {
    SALES: {
      status: salesStatus,
      statusTitle: salesStatuses[salesStatus as string],
      color: salesStatusesColor[salesStatus as string],
      operator: salesOperator,
      availableToUpdate: department !== 'RETENTION',
      isActive: acquisitionStatus === 'SALES',
    },
    RETENTION: {
      status: retentionStatus,
      statusTitle: retentionStatuses[retentionStatus as string],
      color: retentionStatusesColor[retentionStatus as string],
      operator: retentionOperator,
      availableToUpdate: department !== 'SALES',
      isActive: acquisitionStatus === 'RETENTION',
    },
  };

  // ===== Modals ===== //
  const updateRepresentativeModal = useModal<UpdateRepresentativeModalProps>(UpdateRepresentativeModal);

  // ===== Handlers ===== //
  const handleShowModal = (acquisitionType: AcquisitionStatusEnum, availableToUpdate: boolean) => {
    if (changeAcquisition && availableToUpdate) {
      updateRepresentativeModal.show({
        isClient: true,
        uuid,
        type: acquisitionType,
        header: I18n.t('CLIENT_PROFILE.MODALS.REPRESENTATIVE_UPDATE.HEADER', {
          type: acquisitionType.toLowerCase(),
        }),
      });
    }
  };

  // ===== Renders ===== //
  const renderAcquisitionItem = (item: AcquisitionItem) => {
    let team = null;
    let desk = null;

    const {
      label,
      status,
      operator,
      isActive,
      statusTitle,
      color,
      acquisitionType,
      availableToUpdate,
    } = item;

    if (operator) {
      const branches = operator?.hierarchy?.parentBranches;

      team = branches?.find(branch => branch.branchType === 'TEAM');
      desk = team ? team.parentBranch : branches?.find(branch => branch.branchType === 'DESK');
    }

    return (
      <div
        key={acquisitionType}
        className={
          classNames(
            'ClientAcquisitionStatus__item',
            `ClientAcquisitionStatus__item--${color}`, {
              'ClientAcquisitionStatus__item--active': isActive,
            },
          )
        }
        onClick={() => handleShowModal(acquisitionType, availableToUpdate)}
      >
        <div className="ClientAcquisitionStatus__left">
          {I18n.t(label)}

          <Choose>
            <When condition={!!status}>
              <div className={classNames(
                'ClientAcquisitionStatus__status',
                `ClientAcquisitionStatus__status--${color}`,
              )}
              >
                {I18n.t(statusTitle)}
              </div>
            </When>

            <Otherwise>
              <div className="ClientAcquisitionStatus__status">
                {I18n.t('COMMON.NONE')}
              </div>
            </Otherwise>
          </Choose>
        </div>

        <div className="ClientAcquisitionStatus__right">
          <Choose>
            <When condition={!!operator}>
              <b className="ClientAcquisitionStatus__operator">{operator?.fullName}</b>
            </When>

            <Otherwise>
              &mdash;
            </Otherwise>
          </Choose>

          <If condition={!!desk}>
            <div className="ClientAcquisitionStatus__branch">
              <b>{I18n.t('COMMON.DESK')}:</b>

              <HideText text={desk?.name || ''} />
            </div>
          </If>

          <If condition={!!team}>
            <div className="ClientAcquisitionStatus__branch">
              <b>{I18n.t('COMMON.TEAM')}:</b>

              <HideText text={team?.name || ''} />
            </div>
          </If>
        </div>
      </div>
    );
  };

  return (
    <div className="ClientAcquisitionStatus">
      <div className="ClientAcquisitionStatus__title">
        {I18n.t('CLIENT_PROFILE.CLIENT.ACQUISITION.TITLE')}
      </div>

      <div className="ClientAcquisitionStatus__content">
        {
          aquisitionStatuses.map(({ label, value }) => (
            renderAcquisitionItem({
              label,
              acquisitionType: value, // Sales / Retention
              ...acquisitionItems[value],
            } as AcquisitionItem)
          ))
        }
      </div>
    </div>
  );
};

export default compose(
  React.memo,
  withStorage(['auth']),
)(ClientAcquisitionStatus);
