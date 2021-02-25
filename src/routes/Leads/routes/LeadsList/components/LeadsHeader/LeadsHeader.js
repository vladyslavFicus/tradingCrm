import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import ReactPlaceholder from 'react-placeholder';
import { TextRow } from 'react-placeholder/lib/placeholders';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { withNotifications, withModals } from 'hoc';
import PropTypes from 'constants/propTypes';
import { userTypes, deskTypes } from 'constants/hierarchyTypes';
import { Button } from 'components/UI';
import RepresentativeUpdateModal from 'modals/RepresentativeUpdateModal';
import { MAX_SELECTED_LEADS } from '../../constants';
import LeadsUploadModal from '../LeadsUploadModal';
import './LeadsHeader.scss';

class LeadsHeader extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    leadsQuery: PropTypes.query({
      leads: PropTypes.pageable(PropTypes.lead),
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
      leadsQuery,
      touchedRowsIds,
      allRowsSelected,
    } = this.props;

    let rowsLength = touchedRowsIds.length;

    if (allRowsSelected) {
      const totalElements = get(leadsQuery, 'data.leads.totalElements');
      const searchLimit = get(location, 'state.filters.searchLimit') || Infinity;

      rowsLength = Math.min(searchLimit, totalElements, MAX_SELECTED_LEADS) - rowsLength;
    }

    return rowsLength;
  }

  handleOpenRepresentativeModal = () => {
    const {
      leadsQuery,
      touchedRowsIds,
      allRowsSelected,
      location: { state },
      updateLeadsListState,
      modals: { representativeUpdateModal },
    } = this.props;

    const leads = get(leadsQuery, 'data.leads.content') || [];

    representativeUpdateModal.show({
      uuids: touchedRowsIds.map(index => leads[index].uuid),
      userType: userTypes.LEAD_CUSTOMER,
      type: deskTypes.SALES,
      configs: {
        allRowsSelected,
        selectedRowsLength: this.selectedRowsLength,
        multiAssign: true,
        ...state && {
          searchParams: state.filters,
          sorts: state.sorts,
        },
      },
      onSuccess: () => {
        leadsQuery.refetch();
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
      leadsQuery,
      modals: {
        leadsUploadModal,
      },
    } = this.props;

    leadsUploadModal.show({
      onSuccess: leadsQuery.refetch,
    });
  };

  render() {
    const {
      leadsQuery,
      location: {
        state,
      },
    } = this.props;

    const totalElements = get(leadsQuery, 'data.leads.totalElements') || null;
    const searchLimit = get(state, 'filters.searchLimit');

    const leadsListCount = (searchLimit && searchLimit < totalElements)
      ? searchLimit
      : totalElements;

    return (
      <div className="LeadsHeader">
        <div className="LeadsHeader__left">
          <ReactPlaceholder
            ready={!leadsQuery.loading}
            customPlaceholder={(
              <div>
                <TextRow
                  className="animated-background"
                  style={{ width: '220px', height: '20px' }}
                />
                <TextRow
                  className="animated-background"
                  style={{ width: '220px', height: '12px' }}
                />
              </div>
            )}
          >
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
          </ReactPlaceholder>
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
