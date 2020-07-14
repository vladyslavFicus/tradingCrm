import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { withModals } from 'hoc';
import { withPermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import Permissions from 'utils/permissions';
import PropTypes from 'constants/propTypes';
import { salesStatuses, salesStatusesColor } from 'constants/salesStatuses';
import RepresentativeUpdateModal from 'components/RepresentativeUpdateModal';
import './LeadAcquisitionStatus.scss';

const changeAcquisitionStatus = new Permissions([permissions.USER_PROFILE.CHANGE_ACQUISITION_STATUS]);

class LeadAcquisitionStatus extends PureComponent {
  static propTypes = {
    lead: PropTypes.lead.isRequired,
    modals: PropTypes.shape({
      representativeUpdateModal: PropTypes.modalType,
    }).isRequired,
    permission: PropTypes.permission.isRequired,
  }

  handleChangeAsquisitionStatus = () => {
    const {
      permission: { permissions: currentPermissions },
      modals: { representativeUpdateModal },
      lead: { uuid },
    } = this.props;

    if (changeAcquisitionStatus.check(currentPermissions)) {
      representativeUpdateModal.show({
        type: 'SALES',
        userType: 'LEAD_CUSTOMER',
        leads: [{ uuid }],
        initialValues: { aquisitionStatus: 'SALES' },
        header: I18n.t('LEAD_PROFILE.MODALS.REPRESENTATIVE_UPDATE.HEADER', {
          type: 'Sales',
        }),
      });
    }
  }

  render() {
    const {
      lead: {
        salesStatus,
        salesAgent,
      },
    } = this.props;

    let team = null;
    let desk = null;

    if (salesAgent) {
      const branches = salesAgent?.hierarchy?.parentBranches;

      team = branches?.find(branch => branch.branchType === 'TEAM');
      desk = team ? team.parentBranch : branches?.find(branch => branch.branchType === 'DESK');
    }

    const colorClassName = salesStatus && salesStatusesColor[salesStatus];

    return (
      <div className="LeadAcquisitionStatus">
        <div className="LeadAcquisitionStatus__title">
          {I18n.t('LEAD_PROFILE.ASQUISITION_STATUS.TITLE')}
        </div>

        <div className="LeadAcquisitionStatus__content">
          <div
            className={classNames('LeadAcquisitionStatus__item', `border-${colorClassName}`)}
            onClick={this.handleChangeAsquisitionStatus}
          >
            <div className="LeadAcquisitionStatus__left">
              <div className="LeadAcquisitionStatus__representative">
                {I18n.t('LEAD_PROFILE.ASQUISITION_STATUS.SALES')}
              </div>
              <Choose>
                <When condition={salesStatus}>
                  <div className={classNames('LeadAcquisitionStatus__status', colorClassName)}>
                    {I18n.t(salesStatuses[salesStatus])}
                  </div>
                </When>
                <Otherwise>
                  <span>&mdash;</span>
                </Otherwise>
              </Choose>
            </div>

            <div className="LeadAcquisitionStatus__right">
              <Choose>
                <When condition={salesAgent}>
                  <div className="LeadAcquisitionStatus__operator">{salesAgent.fullName}</div>
                </When>
                <Otherwise>
                  <div>&mdash;</div>
                </Otherwise>
              </Choose>

              <If condition={desk}>
                <div>
                  <b>{I18n.t('COMMON.DESK')}:</b> {desk.name}
                </div>
              </If>
              <If condition={team}>
                <div>
                  <b>{I18n.t('COMMON.TEAM')}:</b> {team.name}
                </div>
              </If>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  withPermission,
  withModals({
    representativeUpdateModal: RepresentativeUpdateModal,
  }),
)(LeadAcquisitionStatus);
