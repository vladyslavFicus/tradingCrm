import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import I18n from 'i18n-js';
import ReactPlaceholder from 'react-placeholder';
import { TextRow } from 'react-placeholder/lib/placeholders';
import PropTypes from 'constants/propTypes';
import ClientsBulkActions from '../ClientsBulkActions';
import { MAX_SELECTED_CLIENTS } from '../../constants';
import './ClientsHeader.scss';

class ClientsHeader extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    touchedRowsIds: PropTypes.arrayOf(PropTypes.number).isRequired,
    updateClientsListState: PropTypes.func.isRequired,
    allRowsSelected: PropTypes.bool.isRequired,
    clientsQuery: PropTypes.query({
      profiles: PropTypes.pageable(PropTypes.profileView),
    }).isRequired,
  };

  get selectedRowsLength() {
    const {
      location,
      clientsQuery,
      touchedRowsIds,
      allRowsSelected,
    } = this.props;

    let rowsLength = touchedRowsIds.length;

    if (allRowsSelected) {
      const totalElements = clientsQuery.data.profiles?.totalElements;
      const searchLimit = location.state?.filters?.searchLimit || Infinity;

      rowsLength = Math.min(searchLimit, totalElements, MAX_SELECTED_CLIENTS) - rowsLength;
    }

    return rowsLength;
  }

  render() {
    const {
      location,
      clientsQuery,
      touchedRowsIds,
      allRowsSelected,
      updateClientsListState,
    } = this.props;

    const totalElements = clientsQuery.data.profiles?.totalElements;
    const searchLimit = location.state?.filters?.searchLimit;

    const clientsListCount = (searchLimit && searchLimit < totalElements)
      ? searchLimit
      : totalElements;

    return (
      <div className="ClientsHeader">
        <div className="ClientsHeader__left">
          <ReactPlaceholder
            ready={!clientsQuery.loading}
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
              <When condition={clientsListCount}>
                <div>
                  <div className="ClientsHeader__title">
                    <b>{clientsListCount} </b> {I18n.t('COMMON.CLIENTS_FOUND')}
                  </div>

                  <div className="ClientsHeader__selected">
                    <b>{this.selectedRowsLength}</b> {I18n.t('COMMON.CLIENTS_SELECTED')}
                  </div>
                </div>
              </When>
              <Otherwise>
                <div className="ClientsHeader__title">
                  {I18n.t('COMMON.CLIENTS')}
                </div>
              </Otherwise>
            </Choose>
          </ReactPlaceholder>
        </div>

        <If condition={totalElements && this.selectedRowsLength}>
          <div className="ClientsHeader__right">
            <ClientsBulkActions
              touchedRowsIds={touchedRowsIds}
              allRowsSelected={allRowsSelected}
              updateClientsListState={updateClientsListState}
              selectedRowsLength={this.selectedRowsLength}
              clientsQuery={clientsQuery}
            />
          </div>
        </If>
      </div>
    );
  }
}

export default withRouter(ClientsHeader);
