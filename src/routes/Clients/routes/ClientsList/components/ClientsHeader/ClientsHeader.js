import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { FiltersTogglerButton } from 'components/FiltersToggler';
import Placeholder from 'components/Placeholder';
import ClientsBulkActions from '../ClientsBulkActions';
import './ClientsHeader.scss';

class ClientsHeader extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    select: PropTypes.TableSelection,
    clientsQuery: PropTypes.query({
      profiles: PropTypes.pageable(PropTypes.profileView),
    }).isRequired,
  };

  static defaultProps = {
    select: null,
  };

  render() {
    const {
      location,
      clientsQuery,
      select,
    } = this.props;

    const totalElements = clientsQuery.data?.profiles?.totalElements;
    const searchLimit = location.state?.filters?.searchLimit;

    const clientsListCount = (searchLimit && searchLimit < totalElements)
      ? searchLimit
      : totalElements;

    const selectedCount = this.props.select?.selected || 0;

    return (
      <div className="ClientsHeader">
        <div className="ClientsHeader__left">
          <Placeholder
            ready={!clientsQuery.loading}
            rows={[{ width: 220, height: 20 }, { width: 220, height: 12 }]}
          >
            <Choose>
              <When condition={clientsListCount}>
                <div>
                  <div className="ClientsHeader__title">
                    <b>{clientsListCount} </b> {I18n.t('COMMON.CLIENTS_FOUND')}
                  </div>

                  <div className="ClientsHeader__selected">
                    <b>{selectedCount}</b> {I18n.t('COMMON.CLIENTS_SELECTED')}
                  </div>
                </div>
              </When>
              <Otherwise>
                <div className="ClientsHeader__title">
                  {I18n.t('COMMON.CLIENTS')}
                </div>
              </Otherwise>
            </Choose>
          </Placeholder>
        </div>

        <div className="ClientsHeader__right">
          <If condition={totalElements && selectedCount}>
            <ClientsBulkActions
              select={select}
              selectedRowsLength={selectedCount}
              clientsQuery={clientsQuery}
            />
          </If>

          <FiltersTogglerButton className="ClientsHeader__filters-toggler-button" />
        </div>
      </div>
    );
  }
}

export default withRouter(ClientsHeader);
