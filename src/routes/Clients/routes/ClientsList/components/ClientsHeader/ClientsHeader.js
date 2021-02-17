import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { TextRow } from 'react-placeholder/lib/placeholders';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
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

        <If condition={totalElements && selectedCount}>
          <div className="ClientsHeader__right">
            <ClientsBulkActions
              select={select}
              selectedRowsLength={selectedCount}
              clientsQuery={clientsQuery}
            />
          </div>
        </If>
      </div>
    );
  }
}

export default withRouter(ClientsHeader);
