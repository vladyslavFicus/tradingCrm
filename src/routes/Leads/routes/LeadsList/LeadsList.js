/* eslint-disable */
import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import LeadsHeader from './components/LeadsHeader';
import LeadsGridFilter from './components/LeadsGridFilter';
import LeadsGrid from './components/LeadsGrid';
import getLeadsQuery from './graphql/getLeadsQuery';
import './LeadsList.scss';

class LeadsList extends PureComponent {
  static propTypes = {
    leadsData: PropTypes.query({
      leads: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.lead),
      }),
    }).isRequired,
  };

  state = {
    allRowsSelected: false,
    touchedRowsIds: [],
  };

  updateLeadsListState = (
    allRowsSelected = false,
    touchedRowsIds = [],
  ) => {
    this.setState({ allRowsSelected, touchedRowsIds });
  };

  // # Filtration
  // handleFiltersChanged = async (filters = {}) => {
  //   this.props.updateLeadsListState();
  //   this.props.history.replace({ query: { filters } });
  // };

  // handleFilterReset = async () => {
  //   this.props.updateLeadsListState();
  //   this.props.history.replace({ query: null });
  // };


  render() {
    const { leadsData } = this.props;
    const { allRowsSelected, touchedRowsIds } = this.state;

    return (
      <div className="LeadsList">
        <LeadsHeader
          leadsData={leadsData}
          touchedRowsIds={touchedRowsIds}
          allRowsSelected={allRowsSelected}
          updateLeadsListState={this.updateLeadsListState}
        />

        <LeadsGridFilter />

        <LeadsGrid
          leadsData={leadsData}
          touchedRowsIds={touchedRowsIds}
          allRowsSelected={allRowsSelected}
          updateLeadsListState={this.updateLeadsListState}
        />
      </div>
    );
  }
}

export default compose(
  withRequests({
    leadsData: getLeadsQuery,
  })
)(LeadsList);



// import React, { Component, Fragment } from 'react';
// import moment from 'moment';
// import classNames from 'classnames';
// import I18n from 'i18n-js';
// import { get, omit } from 'lodash';
//
// import PropTypes from 'constants/propTypes';
// import { deskTypes, userTypes } from 'constants/hierarchyTypes';
//
//
// import { salesStatuses, salesStatusesColor } from 'constants/salesStatuses';
//
//
//
//
//
//
// import ConvertedBy from '../../../components/ConvertedBy';
// import { leadStatuses } from '../../../constants';
// import { getLeadsData } from './utils';
// import LeadsGridFilter from './LeadsGridFilter';

// const MAX_SELECTED_ROWS = 10000;

// class List extends Component {
//   static propTypes = {
//     ...PropTypes.router,
//     notify: PropTypes.func.isRequired,
//     leads: PropTypes.shape({
//       leads: PropTypes.shape({
//         data: PropTypes.pageable(PropTypes.lead),
//       }),
//       loadMore: PropTypes.func,
//       refetch: PropTypes.func,
//       loading: PropTypes.bool.isRequired,
//     }),
//     location: PropTypes.shape({
//       query: PropTypes.shape({
//         filters: PropTypes.object,
//       }),
//     }).isRequired,
//     modals: PropTypes.shape({
//       confirmationModal: PropTypes.modalType,
//       promoteInfoModal: PropTypes.modalType,
//       leadsUploadModal: PropTypes.modalType,
//     }).isRequired,
//     fileUpload: PropTypes.func.isRequired,
//   };

//   state = {
//     hierarchyOperators: [],
//   };

//   setDesksTeamsOperators = (hierarchyOperators) => {
//     this.setState({ hierarchyOperators });
//   };

//   handleUploadCSV = async ([file]) => {
//     const {
//       notify,
//       leads: { refetch },
//       modals: { leadsUploadModal },
//     } = this.props;

//     const { data: { upload: { leadCsvUpload: { error } } } } = await this.props.fileUpload({ variables: { file } });

//     if (error) {
//       notify({
//         level: 'error',
//         title: I18n.t('COMMON.UPLOAD_FAILED'),
//         message: error.error || error.fields_errors || I18n.t('COMMON.SOMETHING_WRONG'),
//       });

//       return;
//     }

//     leadsUploadModal.hide();

//     notify({
//       level: 'success',
//       title: I18n.t('COMMON.SUCCESS'),
//       message: I18n.t('COMMON.UPLOAD_SUCCESSFUL'),
//     });

//     refetch();
//   };

//   handleLeadsUploadModalClick = () => {
//     this.props.modals.leadsUploadModal.show({
//       onDropAccepted: this.handleUploadCSV,
//     });
//   };

//   handleTriggerRepModal = () => {
//     const {
//       modals: { representativeModal },
//       location: { query },
//       leads: { leads: { data: { content } } },
//     } = this.props;

//     const { allRowsSelected } = this.state;
//     const leads = getLeadsData(this.state, content);

//     const selectedRowsLength = this.getSelectedRowLength();

//     representativeModal.show({
//       leads,
//       userType: userTypes.LEAD_CUSTOMER,
//       type: deskTypes.SALES,
//       configs: {
//         allRowsSelected,
//         totalElements: selectedRowsLength,
//         multiAssign: true,
//         ...query && { searchParams: { ...omit(query.filters, ['size', 'teams', 'desks']) } },
//       },
//       onSuccess: this.handleSuccessUpdateLeadList,
//       header: (
//         <Fragment>
//           <div>{I18n.t(`CLIENTS.MODALS.${deskTypes.SALES}_MODAL.HEADER`)}</div>
//           <div className="font-size-11 color-yellow">{selectedRowsLength}{' '}{I18n.t('LEADS.LEADS_SELECTED')}</div>
//         </Fragment>
//       ),
//     });
//   };

//   handleSuccessUpdateLeadList = () => {
//     this.props.leads.refetch();

//     this.setState({
//       touchedRowsIds: [],
//       allRowsSelected: false,
//     });
//   };













//   getSelectedRowLength = () => {
//     const { leads } = this.props;
//     const { allRowsSelected, touchedRowsIds } = this.state;

//     const totalElements = get(leads, 'leads.data.totalElements');

//     let selectedRowsLength = touchedRowsIds.length;

//     if (allRowsSelected) {
//       selectedRowsLength = totalElements > MAX_SELECTED_ROWS
//         ? MAX_SELECTED_ROWS - selectedRowsLength
//         : totalElements - selectedRowsLength;
//     }

//     return selectedRowsLength;
//   };

//   render() {
//     const {
//       leads: {
//         loading,
//         leads,
//       },
//       location: { query },
//     } = this.props;

//     const {
//       allRowsSelected,
//       touchedRowsIds,
//     } = this.state;
//     const entities = get(leads, 'data') || { content: [] };
//     const filters = get(query, 'filters', {});

//     const selectedRowsLength = this.getSelectedRowLength();

//     const allowActions = Object
//       .keys(filters)
//       .filter(i => (filters[i] && Array.isArray(filters[i]) && filters[i].length > 0) || filters[i]).length > 0;

//     return (
//       <div className="card">

//         <LeadsGridFilter
//           onSubmit={this.handleFiltersChanged}
//           onReset={this.handleFilterReset}
//           disabled={!allowActions}
//           setDesksTeamsOperators={this.setDesksTeamsOperators}
//           isFetchingProfileData={loading}
//         />


//       </div>
//     );
//   }
// }

// export default List;

