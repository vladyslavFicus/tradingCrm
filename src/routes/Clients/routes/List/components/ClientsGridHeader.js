import React, { Component } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import PropTypes from 'constants/propTypes';
import { TextRow } from 'react-placeholder/lib/placeholders';
import Placeholder from 'components/Placeholder';
import ClientsGridBulkActions from './ClientsGridBulkActions';

class ClientsGridHeader extends Component {
  static propTypes = {
    searchLimit: PropTypes.number,
    allRowsSelected: PropTypes.bool.isRequired,
    touchedRowsIds: PropTypes.arrayOf(PropTypes.number).isRequired,
    selectedRowsLength: PropTypes.number.isRequired,
    resetClientsGridInitialState: PropTypes.func.isRequired,
    profiles: PropTypes.shape({
      profiles: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.shape({
          totalElements: PropTypes.number,
          page: PropTypes.number,
          last: PropTypes.bool,
          content: PropTypes.profileView,
        })),
      }),
      loading: PropTypes.bool.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    searchLimit: null,
  };

  render() {
    const {
      profiles,
      profiles: { loading },
      searchLimit,
      touchedRowsIds,
      allRowsSelected,
      selectedRowsLength,
      resetClientsGridInitialState,
    } = this.props;

    const { totalElements } = get(profiles, 'profiles.data') || {};

    const clientsListCount = (searchLimit && searchLimit < totalElements)
      ? searchLimit
      : totalElements;

    return (
      <div className="card-heading card-heading--is-sticky">
        {/* Left header part */}
        <Placeholder
          ready={!loading}
          className={null}
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
            <When condition={!!totalElements}>
              <span id="users-list-header" className="font-size-20 height-55 users-list-header">
                <div>
                  <strong>{clientsListCount} </strong>
                  {I18n.t('COMMON.CLIENTS_FOUND')}
                </div>
                <div className="font-size-14">
                  <strong>{selectedRowsLength} </strong>
                  {I18n.t('COMMON.CLIENTS_SELECTED')}
                </div>
              </span>
            </When>
            <Otherwise>
              <span className="font-size-20" id="users-list-header">
                {I18n.t('COMMON.CLIENTS')}
              </span>
            </Otherwise>
          </Choose>
        </Placeholder>

        {/* Right header part */}
        <If condition={totalElements && selectedRowsLength}>
          <ClientsGridBulkActions
            profiles={profiles}
            touchedRowsIds={touchedRowsIds}
            allRowsSelected={allRowsSelected}
            selectedRowsLength={selectedRowsLength}
            resetClientsGridInitialState={resetClientsGridInitialState}
          />
        </If>
      </div>
    );
  }
}

export default ClientsGridHeader;
