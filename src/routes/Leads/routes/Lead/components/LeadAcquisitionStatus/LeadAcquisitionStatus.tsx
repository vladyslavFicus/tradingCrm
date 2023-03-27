import React from 'react';
import compose from 'compose-function';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { withModals } from 'hoc';
import { Modal } from 'types';
import { Lead } from '__generated__/types';
import { usePermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import { salesStatuses, salesStatusesColor } from 'constants/salesStatuses';
import RepresentativeUpdateModal from 'modals/RepresentativeUpdateModal';
import './LeadAcquisitionStatus.scss';

type Props = {
  lead: Lead,
  modals: {
    representativeUpdateModal: Modal,
  },
};

const LeadAcquisitionStatus = (props: Props) => {
  const {
    lead: {
      uuid,
      acquisition,
    },
    modals: {
      representativeUpdateModal,
    },
  } = props;

  const salesStatus = acquisition?.salesStatus;
  const color = salesStatus && salesStatusesColor[salesStatus];

  const salesOperator = acquisition?.salesOperator;
  const salesOperatorName = salesOperator?.fullName;

  let teamName = null;
  let deskName = null;

  if (salesOperator) {
    const branches = salesOperator?.hierarchy?.parentBranches;

    const team = branches?.find(branch => branch.branchType === 'TEAM');
    teamName = team?.name;

    const desk = team ? team.parentBranch : branches?.find(branch => branch.branchType === 'DESK');
    deskName = desk?.name;
  }

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowChangeAsquisitionStatus = permission.allows(permissions.USER_PROFILE.CHANGE_ACQUISITION);

  const handleChangeAsquisitionStatus = () => {
    if (allowChangeAsquisitionStatus) {
      representativeUpdateModal.show({
        uuid,
        type: 'SALES',
        userType: 'LEAD_CUSTOMER',
        header: I18n.t('LEAD_PROFILE.MODALS.REPRESENTATIVE_UPDATE.HEADER', {
          type: 'Sales',
        }),
      });
    }
  };

  return (
    <div className="LeadAcquisitionStatus">
      <div className="LeadAcquisitionStatus__title">
        {I18n.t('LEAD_PROFILE.ASQUISITION_STATUS.TITLE')}
      </div>

      <div className="LeadAcquisitionStatus__content">
        <div
          className={classNames('LeadAcquisitionStatus__item', `LeadAcquisitionStatus__item--${color}`)}
          onClick={handleChangeAsquisitionStatus}
        >
          <div className="LeadAcquisitionStatus__left">
            <div className="LeadAcquisitionStatus__representative">
              {I18n.t('LEAD_PROFILE.ASQUISITION_STATUS.SALES')}
            </div>

            <Choose>
              <When condition={!!salesStatus}>
                <div className={classNames(
                  'LeadAcquisitionStatus__status',
                  `LeadAcquisitionStatus__status--${color}`,
                )}
                >
                  {I18n.t(salesStatuses[salesStatus as string])}
                </div>
              </When>

              <Otherwise>
                &mdash;
              </Otherwise>
            </Choose>
          </div>

          <div className="LeadAcquisitionStatus__right">
            <Choose>
              <When condition={!!salesOperatorName}>
                <div className="LeadAcquisitionStatus__operator">{salesOperatorName}</div>
              </When>

              <Otherwise>
                &mdash;
              </Otherwise>
            </Choose>

            <If condition={!!deskName}>
              <div>
                <b>{I18n.t('COMMON.DESK')}:</b> {deskName}
              </div>
            </If>

            <If condition={!!teamName}>
              <div>
                <b>{I18n.t('COMMON.TEAM')}:</b> {teamName}
              </div>
            </If>
          </div>
        </div>
      </div>
    </div>
  );
};

export default compose(
  React.memo,
  withModals({
    representativeUpdateModal: RepresentativeUpdateModal,
  }),
)(LeadAcquisitionStatus);