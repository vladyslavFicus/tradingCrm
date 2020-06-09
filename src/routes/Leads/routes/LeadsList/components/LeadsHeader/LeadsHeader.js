import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import I18n from 'i18n-js';
import { get, omit } from 'lodash';
import { withNotifications, withModals } from 'hoc';
import PropTypes from 'constants/propTypes';
import { userTypes, deskTypes } from 'constants/hierarchyTypes';
import { Button } from 'components/UI';
import RepresentativeUpdateModal from 'components/RepresentativeUpdateModal';
import { MAX_SELECTED_LEADS } from '../../constants';
import LeadsUploadModal from '../LeadsUploadModal';
import './LeadsHeader.scss';

class LeadsHeader extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    leadsData: PropTypes.query({
      leads: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.lead),
      }),
    }).isRequired,
    allRowsSelected: PropTypes.bool.isRequired,
    touchedRowsIds: PropTypes.arrayOf(PropTypes.number).isRequired,
    updateLeadsListState: PropTypes.func.isRequired,
    modals: PropTypes.shape({
      representativeUpdateModal: PropTypes.modalType,
      leadsUploadModal: PropTypes.modalType,
    }).isRequired,
  };

  get selectedRowsLength() {
    const {
      location,
      leadsData,
      touchedRowsIds,
      allRowsSelected,
    } = this.props;

    let rowsLength = touchedRowsIds.length;

    if (allRowsSelected) {
      const totalElements = get(leadsData, 'data.leads.data.totalElements') || null;
      const searchLimit = get(location, 'query.filters.size');

      const selectedLimit = searchLimit && (searchLimit < totalElements) ? searchLimit : totalElements;

      rowsLength = selectedLimit > MAX_SELECTED_LEADS
        ? MAX_SELECTED_LEADS - rowsLength
        : selectedLimit - rowsLength;
    }

    return rowsLength;
  }

  handleOpenRepresentativeModal = () => {
    const {
      leadsData,
      touchedRowsIds,
      allRowsSelected,
      location: { query },
      updateLeadsListState,
      modals: { representativeUpdateModal },
    } = this.props;

    const leads = get(leadsData, 'data.leads.data.content') || [];

    const selectedLeads = leads
      .filter((_, i) => touchedRowsIds.includes(i))
      .map(lead => ({
        uuid: lead.uuid,
        unassignFromOperator: get(lead, 'salesAgent.uuid') || null,
      }));

    representativeUpdateModal.show({
      leads: selectedLeads,
      userType: userTypes.LEAD_CUSTOMER,
      type: deskTypes.SALES,
      configs: {
        allRowsSelected,
        totalElements: this.selectedRowsLength,
        multiAssign: true,
        ...query && {
          searchParams: omit(query.filters, ['size', 'teams', 'desks']),
        },
      },
      onSuccess: () => {
        leadsData.refetch();
        updateLeadsListState();
      },
      header: (
        <>
          <div>{I18n.t('LEADS.LEADS_BULK_MODAL.HEADER')}</div>
          <div className="font-size-11 color-yellow">
            {this.selectedRowsLength} {I18n.t('LEADS.LEADS_SELECTED')}
          </div>
        </>
      ),
    });
  };

  handleOpenLeadsUploadModal = () => {
    const {
      leadsData,
      modals: {
        leadsUploadModal,
      },
    } = this.props;

    leadsUploadModal.show({
      onSuccess: leadsData.refetch,
    });
  };

  render() {
    const {
      leadsData,
      location: {
        query,
      },
    } = this.props;

    const totalElements = get(leadsData, 'data.leads.data.totalElements') || null;
    const searchLimit = get(query, 'filters.size');

    const leadsListCount = (searchLimit && searchLimit < totalElements)
      ? searchLimit
      : totalElements;

    return (
      <div className="LeadsHeader">
        <div className="LeadsHeader__left">
          <Choose>
            <When condition={leadsListCount}>
              <div>
                <div className="LeadsHeader__title">
                  <b>{leadsListCount} </b> {I18n.t('LEADS.LEADS_FOUND')}
                </div>

                <div className="LeadsHeader__selected">
                  <b>{this.selectedRowsLength}</b> {I18n.t('LEADS.LEADS_SELECTED')}
                </div>
              </div>
            </When>
            <Otherwise>
              <div className="LeadsHeader__title">
                {I18n.t('LEADS.LEADS')}
              </div>
            </Otherwise>
          </Choose>
        </div>

        <div className="LeadsHeader__right">
          <If condition={totalElements !== 0 && this.selectedRowsLength !== 0}>
            <div className="LeadsHeader__bulk">
              <div className="LeadsHeader__bulk-title">
                {I18n.t('LEADS.BULK_ACTIONS')}
              </div>

              <Button
                commonOutline
                onClick={this.handleOpenRepresentativeModal}
              >
                {I18n.t('COMMON.SALES')}
              </Button>
            </div>
          </If>
          <If condition={this.selectedRowsLength === 0}>
            <Button
              commonOutline
              onClick={this.handleOpenLeadsUploadModal}
            >
              {I18n.t('COMMON.UPLOAD')}
            </Button>
          </If>
        </div>
      </div>
    );
  }
}

export default compose(
  withRouter,
  withNotifications,
  withModals({
    representativeUpdateModal: RepresentativeUpdateModal,
    leadsUploadModal: LeadsUploadModal,
  }),
)(LeadsHeader);